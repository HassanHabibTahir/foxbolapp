import React, { useState, useEffect, useRef, createRef } from "react";
import FormSection from "./common/FormSection";
import CurrencyInput from "./common/CurrencyInput";
import QuantityInput from "./common/QuantityInput";
import ItemDescriptionCombobox from "./common/ItemDescriptionCombobox";
import InvoiceTotals from "./InvoiceTotals";
import { lookupPrice } from "../lib/priceService";
import FormInput from "./common/FormInput";
import ExtendedCurrencyInput from "./common/ExtendedCurrenctInput";
import { supabase } from "../lib/supabase";

interface LineItem {
  itemId?: any;
  id?: number;
  _id?:string;
  description: string;
  quantity: number;
  price: number;
  extended: number;
  isDiscount?: boolean;
  gl_account?: string;
  gl_subaccount?: string;
  itemnum?: string;
  itemgroup?: string;
  hasActualItem: boolean;
}

const INITIAL_ITEMS: any[] = [
  {
    id: 1,
    description: "",
    quantity: 0,
    price: 0,
    extended: 0,
    itemgroup: "",
    hasActualItem: false,
  },
];


interface ChargesSectionProps {
  transactionItems: LineItem[];
  invoice: any;
  onInvoiceChange: (updates: any) => void;
  onItemsChange: (items: LineItem[]) => void;
  refs: any;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

const ChargesSection: React.FC<ChargesSectionProps> = ({
  invoice,
  transactionItems,
  onInvoiceChange,
  onItemsChange,
  refs,
  onKeyDown,
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [taxRate, setTaxRate] = useState(8.25);
  const [amountReceived, setAmountReceived] = useState(0);
  const [total, setTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  
  const [transaction,setTransactions]= useState<any>([])
  const [isInitialSet, setIsInitialSet] = React.useState(false);
  const [discountPrice, setDiscountPrice] = useState(0)
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    console.log(discountPrice,"discountPrice")
    if (discountPrice) {
      setSubtotal(subtotal - discountPrice); // Discount lagao
    } else {
      setSubtotal(subtotal); // Wapis original value pe aa jao
    }
  }, [discountPrice]);

React.useEffect(() => {
  let updatedItems: any = [];

  if (!isInitialSet) {
    updatedItems = [...INITIAL_ITEMS];
    setIsInitialSet(true);
  } else if (transactionItems.length > 0) {
    // First map all actual items from the backend
    const actualItems = transactionItems
      .filter(item => item.description && item.description !== "DISCOUNT")
      .map((item, index) => ({
        ...item,
        _id: item.id,
        id: index,
        extended: item.extended || item.price * item.quantity,
        hasActualItem: Boolean(item.description),
      }));
    
    updatedItems = [...actualItems];
    
    // Add exactly one empty row if needed
    const emptyRow = createEmptyRow();
    emptyRow.id = updatedItems.length;
    updatedItems.push(emptyRow);

  }

  setTransactions(updatedItems);
}, [transactionItems]);



console.log(items,"items",transaction,"transaction")
  const createEmptyRow = (): any => {
    const newId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1

    return {
      _id: '',
      id: newId,
      description: "",
      quantity: 0,
      price: 0,
      extended: 0,
      itemgroup: invoice.group || "",
      hasActualItem: false,
    }
  }

  useEffect(() => {
    if (transaction.length > 0) {
      // Map transaction items to your format
      const newItems = transactionItems.map((item, index) => ({
        ...item,
        _id: item._id || item.id,
        id: index,
        extended: item.extended || item.price * item.quantity,
        hasActualItem: Boolean(item.description),
      }));
      
      const hasEmptyRow = newItems.some(item => 
        item.description === "" && !item.isDiscount
      );
            if (!hasEmptyRow) {
        newItems.push(createEmptyRow());
      }
      const sortedItems = newItems.sort((a, b) => {
        if (a.description === "DISCOUNT") return 1;
        if (b.description === "DISCOUNT") return -1;
        return 0;
      });
      
      setItems(sortedItems);
    } else {
      setItems([...INITIAL_ITEMS]);
    }
  }, [transaction]);

  const calculateExtended = (
    item: LineItem,
    quantity: number,
    price: number
  ) => {
    const qty = quantity || 1;
    const prc = price || 0;
    return item.isDiscount ? -discountPrice * prc : qty * prc;
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.extended || 0), 0);
  };

  const calculateTaxAmount = (subtotal: number) => {
    return (subtotal * (taxRate || 0)) / 100;
  };

  const calculateTotal = (subtotal: number, taxAmount: number) => {
    return subtotal + taxAmount;
  };

  const updateItemAndNotify = (updatedItems: LineItem[]) => {
    setItems(updatedItems);
    onItemsChange(updatedItems);
  };

  const handleQuantityChange = (id: number, value = 0) => {
  
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const extended = calculateExtended(item, value, item.price);
        return {
          ...item,
          quantity: value,
          extended,
          itemgroup: invoice.group,
        };
      }
      return item;
    });

    updateItemAndNotify(updatedItems);
  };

  const handlePriceChange = (id: number, value = 0) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const extended = calculateExtended(item, item.quantity, value);
        return {
          ...item,
          price: value,
          extended,
          itemgroup: invoice.group,
        };
      }
      return item;
    });
    updateItemAndNotify(updatedItems);
  };

  const handleItemChange = async (id: number, description: string) => {
    let updatedItems = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          description,
          itemgroup: invoice.group,
        };
      }
      return item;
    });

    // If description changed and we have an item group, lookup price
    if (description && invoice.itemgroup) {
      const { price, quantity } = await lookupPrice(
        description,
        invoice.itemgroup
      );
      if (price !== null || quantity !== null) {
        updatedItems = updatedItems.map((item) => {
          if (item.id === id) {
            const qty = quantity === "" ? 1 : quantity ?? item.quantity;
            const prc = price ?? item.price;
            const extended = calculateExtended(item, qty, prc);
            return {
              ...item,
              quantity: qty,
              price: prc,
              extended,
            };
          }
          return item;
        });
      }
    }

    updateItemAndNotify(updatedItems);
  };

  const handleQuantityBlur = (id: number, quantity: number) => {
    if (quantity === 0) {
      const updatedItems = items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            description: "",
            quantity: 0,
            price: 0,
            extended: 0,
          };
        }
        return item;
      });
      updateItemAndNotify(updatedItems);
    }
  };


  const handleItemSelect = (id: number, selectedItem: any) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const price = selectedItem.price?.toString() || "";
        const quantity = item.quantity || 1; // Default quantity 1 رکھیں
        const extended = calculateExtended(item, quantity, price);
        return {
          ...item,
          description: selectedItem.description,
          price,
          quantity,
          extended,
        };
      }
      return item;
    });
    
    if (id === items[items.length - 1].id) {
      updatedItems.push(createEmptyRow());
    }
  
    updateItemAndNotify(updatedItems);
   
  };

  useEffect(() => {
    const newSubtotal = calculateSubtotal();
    const newTaxAmount = calculateTaxAmount(newSubtotal);
    const newTotal = calculateTotal(newSubtotal, newTaxAmount);

    setSubtotal(newSubtotal);
    setTaxAmount(newTaxAmount);
    setTotal(newTotal);
  }, [items, taxRate]);

  useEffect(() => {
    onInvoiceChange({ ...invoice, total });
  }, [total]);

  // Initialize refs before rendering
  useEffect(() => {
    if (!refs.current) return; // Prevent undefined error

    items.forEach((_, index) => {
      const descriptionKey = `description${
        69 + (index > 2 ? index + 1 : index)
      }`;
      if (!refs.current[descriptionKey]) {
        refs.current[descriptionKey] = createRef<HTMLInputElement>();
      }
    });
  }, [items]);





 const [options, setOptions] = useState<any[]>([])
const formatLabel = (item: Item): string => {
  return `${item.description} ${item.shortcut1 ? `(${item.shortcut1})` : ""} ${item.shortcut2 ? `(${item.shortcut2})` : ""}`.trim()
}

   useEffect(() => {
      const fetchOptions = async () => {
        const { data, error } = await supabase.from("items").select("description, shortcut1, shortcut2").limit(100) // Adjust the limit as needed

        if (!error && data) {
          const newOptions = data.map((item) => ({
            value: item.description,
            label: formatLabel(item),
            item,
          }))
          setOptions(newOptions)
        } else {
          console.error("Error fetching items:", error)
        }
      }

      fetchOptions()
    }, [])











    const handleDiscountPriceChange = (value = 0) => {
      if(!value){
        setDiscountPrice(0)
        return
      }else{

        setDiscountPrice(value)
      }
          }
    const sortedItems = items.sort((a, b) => {
        if (a.description === "DISCOUNT") return 1;
        if (b.description === "DISCOUNT") return -1;
        return 0;
    });

  return (
    <>
      <FormSection title="Charges">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 w-32">Quantity</th>
                <th className="px-4 py-2 w-40">Price</th>
                <th className="px-4 py-2 w-40">Extended</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item, index) => {
                const baseRef = 69 + index * 3;
                const descriptionRef = refs[`description${baseRef}`];
                const sectionRef = refs[`description${baseRef + 1}`];
                const priceRef = refs[`description${baseRef + 2}`];
console.log(item,"item")
                return (
                  <tr
                    key={item.id}
                    className={item.isDiscount ? "bg-gray-50" : ""}
                  >
                    <td className="p-1">
                      {item.isDiscount ? (   
                        <></>   
                        // <input
                        //   type="text"
                        //   className="w-full h-9 rounded-md border border-gray-300 p-2 bg-gray-50"
                        //   value={item.description}
                        //   disabled
                        // />
                      ) : (
                        <ItemDescriptionCombobox
                        options={options}
                          ref={descriptionRef}
                          value={item.description}
                          onChange={(value) => handleItemChange(item.id, value)}
                          onItemSelect={(selectedItem) =>
                            handleItemSelect(item.id, selectedItem)
                          }
                          placeholder={"click here and choose an item from the list"}
                          inputRefs={descriptionRef}
                          onKeyDown={(e: React.KeyboardEvent<Element>) =>
                            onKeyDown(e, `description${baseRef}`)
                          }
                        />
                       )} 
                    </td>
                    <td className="p-1">
                      {!item.isDiscount && (
                        <QuantityInput
                          className="h-9"
                          ref={sectionRef}
                          value={item.quantity}
                          onChange={(value) =>
                            handleQuantityChange(item.id, value)
                          }
                          onBlur={() =>
                            handleQuantityBlur(item.id, item.quantity)
                          }
                          onKeyDown={(e: React.KeyboardEvent<Element>) =>
                            onKeyDown(e, `description${baseRef + 1}`)
                          }
                        />
                      )}
                    </td>
                    <td className="p-1">
                      <CurrencyInput
                        ref={priceRef}
                        className="h-9"
                        value={item.price}
                        onChange={(value) => handlePriceChange(item.id, value)}
                        onKeyDown={(e: React.KeyboardEvent<Element>) =>
                          onKeyDown(e, `description${baseRef + 2}`)
                        }
                      />
                    </td>
                    <td className="p-1">
                      <ExtendedCurrencyInput
                        value={item.extended}
                        onChange={() => {}} // Read-only
                        disabled={true}
                        className={item.isDiscount ? "text-red-600 h-9" : ""}
                      />
                    </td>
                  </tr>
                );
              })}
                <tr className="bg-gray-50">
                <td className="p-1">
                  <input
                    type="text"
                    className="w-full h-9 rounded-md border border-gray-300 p-2 bg-gray-50"
                    value="DISCOUNT"
                    disabled
                  />
                </td>
        
                <td className="p-1" colSpan={2} >
                  <CurrencyInput className="h-9" value={discountPrice} onChange={handleDiscountPriceChange} />
                </td>
                <td className="p-1">
                  <ExtendedCurrencyInput
                    value={discountPrice}
                    onChange={() => {}} // Read-only
                    disabled={true}
                    className="text-red-600 h-9"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormSection>

      <InvoiceTotals
        subtotal={subtotal}
        taxRate={taxRate}
        taxAmount={taxAmount}
        amountReceived={amountReceived}
        total={total}
        onTaxRateChange={setTaxRate}
        onAmountReceivedChange={setAmountReceived}
      />
    </>
  );
};

export default ChargesSection;
