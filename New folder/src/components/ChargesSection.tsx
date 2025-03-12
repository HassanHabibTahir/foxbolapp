import React, { useState, useEffect, useRef, createRef } from "react";
import FormSection from "./common/FormSection";
import CurrencyInput from "./common/CurrencyInput";
import QuantityInput from "./common/QuantityInput";
import ItemDescriptionCombobox from "./common/ItemDescriptionCombobox";
import InvoiceTotals from "./InvoiceTotals";
import { lookupPrice } from "../lib/priceService";
import FormInput from "./common/FormInput";
import ExtendedCurrencyInput from "./common/ExtendedCurrenctInput";

interface LineItem {
  itemId?: any;
  id: number;
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

const INITIAL_ITEMS: LineItem[] = [
  {
    id: 1,
    description: "",
    quantity: 0,
    price: 0,
    extended: 0,
    itemgroup: "",
    hasActualItem: false,
  },
  // {
  //   id: 2,
  //   description: "",
  //   quantity: 0,
  //   price: 0,
  //   extended: 0,
  //   itemgroup: "",
  //   hasActualItem: false,
  // },
  // {
  //   id: 3,
  //   description: "",
  //   quantity: 0,
  //   price: 0,
  //   extended: 0,
  //   itemgroup: "",
  //   hasActualItem: false,
  // },
  // {
  //   id: 4,
  //   description: "",
  //   quantity: 0,
  //   price: 0,
  //   extended: 0,
  //   itemgroup: "",
  //   hasActualItem: false,
  // },
  {
    id: 2,
    description: "DISCOUNT",
    quantity: 0,
    price: 0,
    extended: 0,
    itemgroup: "",
    isDiscount: true,
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
  const [items, setItems] = useState<LineItem[]>([]);
  const [taxRate, setTaxRate] = useState(8.25);
  const [amountReceived, setAmountReceived] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  // Create refs for keyboard navigation
  const itemRefs = useRef<(HTMLInputElement | null)[]>([]);




  const createEmptyRow = (): LineItem => {
    const newId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1

    return {
      id: newId,
      description: "",
      quantity: 0,
      price: 0,
      extended: 0,
      itemgroup: invoice.group || "",
      hasActualItem: false,
    }
  }




  // useEffect(() => {
  //   if (transactionItems.length > 0) {

  //           const mappedItems = transactionItems.map((item) => ({
  //       ...item,
  //       extended: item.extended || item.price * item.quantity,
  //       hasActualItem: Boolean(item.description),
  //     }))
   
  //     mappedItems.push(createEmptyRow());
      
      
  //     setItems(mappedItems);
  //   } else {
  //     setItems([...INITIAL_ITEMS]);
  //   }
  // }, [transactionItems]);




  useEffect(() => {
    if (transactionItems.length > 0) {
             const newItems = transactionItems.map((item,index) => ({
        ...item,
        id:index,
        extended: item.extended || item.price * item.quantity,
        hasActualItem: Boolean(item.description),
      }))
      if (!newItems.some(item => item.description === "")) {
        newItems.push(createEmptyRow());
      }
      setItems(newItems);
    } else {
      setItems([...INITIAL_ITEMS]);
    }
  }, [transactionItems]);






  

  // useEffect(() => {
  //   if (transactionItems.length > 0) {
  //     setItems((prevItems) =>
  //       prevItems.map((item) => {
  //         const matchingTransaction = transactionItems.find(
  //           (transItem) => transItem.itemId === item.id
  //         );
  
  //         return matchingTransaction
  //           ? { 
  //               ...item,  // Existing state preserve karna
  //               ...matchingTransaction,  
  //               extended: matchingTransaction.extended || matchingTransaction.price * matchingTransaction.quantity 
  //             }
  //           : item;
  //       })
  //     );
  //   } else {
  //     setItems(INITIAL_ITEMS);
  //   }
  // }, [transactionItems]);
  
  const calculateExtended = (
    item: LineItem,
    quantity: number,
    price: number
  ) => {
    const qty = quantity || 1;
    const prc = price || 0;
    return item.isDiscount ? -qty * prc : qty * prc;
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
    console.log(id, value,"this is teh vaues");
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
    console.log(updatedItems,"updateItems ")
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

  // const handleItemSelect = (id: number, selectedItem: any) => {
  //   const updatedItems = items.map((item) => {
  //     if (item.id === id) {
  //       const price = selectedItem.price?.toString() || "";
  //       const extended = calculateExtended(item, item.quantity, price);
  //       return {
  //         ...item,
  //         description: selectedItem.description,
  //         price,
  //         extended,
  //       };
  //     }
  //     return item;
  //   });


  //     updatedItems.push(createEmptyRow())
    
  //   updateItemAndNotify(updatedItems);
  // };

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
              {items.map((item, index) => {
                const baseRef = 69 + index * 3;
                const descriptionRef = refs[`description${baseRef}`];
                const sectionRef = refs[`description${baseRef + 1}`];
                const priceRef = refs[`description${baseRef + 2}`];

                return (
                  <tr
                    key={item.id}
                    className={item.isDiscount ? "bg-gray-50" : ""}
                  >
                    <td className="p-1">
                      {item.isDiscount ? (
                        <input
                          type="text"
                          className="w-full h-9 rounded-md border border-gray-300 p-2 bg-gray-50"
                          value={item.description}
                          disabled
                        />
                      ) : (
                        <ItemDescriptionCombobox
                          ref={descriptionRef}
                          value={item.description}
                          onChange={(value) => handleItemChange(item.id, value)}
                          onItemSelect={(selectedItem) =>
                            handleItemSelect(item.id, selectedItem)
                          }
                          placeholder="click here and choose an item from the list"
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
