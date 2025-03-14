"use client"

import React, { useState, useEffect, createRef } from "react"
import FormSection from "./common/FormSection"
import CurrencyInput from "./common/CurrencyInput"
import QuantityInput from "./common/QuantityInput"
import ItemDescriptionCombobox from "./common/ItemDescriptionCombobox"
import InvoiceTotals from "./InvoiceTotals"
import { lookupPrice } from "../lib/priceService"
import ExtendedCurrencyInput from "./common/ExtendedCurrenctInput"
import { supabase } from "../lib/supabase"
import { XCircle  } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

interface LineItem {
  itemId?: any
  id?: number
  _id?: string
  description: string
  quantity: number
  price: number
  extended: number
  isDiscount?: boolean
  gl_account?: string
  gl_subaccount?: string
  itemnum?: string
  itemgroup?: string
  hasActualItem: boolean
}

const INITIAL_ITEMS: any[] = [
  {
    id: 1,
    description: "",
    quantity: 1,
    price: 0,
    extended: 0,
    itemgroup: "",
    hasActualItem: false,
  },
]

interface ChargesSectionProps {
  transactionItems: LineItem[]
  invoice: any
  onInvoiceChange: (updates: any) => void
  onItemsChange: (items: LineItem[]) => void
  refs: any
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void
}

const ChargesSection: React.FC<ChargesSectionProps> = ({
  invoice,
  transactionItems,
  onInvoiceChange,
  onItemsChange,
  refs,
  onKeyDown,
}) => {
  const [items, setItems] = useState<any[]>([])
  const [taxRate, setTaxRate] = useState(8.25)
  const [amountReceived, setAmountReceived] = useState(0)
  const [total, setTotal] = useState(0)
  const [taxAmount, setTaxAmount] = useState(0)

  const [transaction, setTransactions] = useState<any>([])
  const [isInitialSet, setIsInitialSet] = React.useState(false)
  const [discountPrice, setDiscountPrice] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const isSmallToMediumScreen = useMediaQuery({ maxWidth: 1024 });

  useEffect(() => {
    let updatedSubtotal = calculateSubtotal()
    let _calculateTaxAmount = calculateTaxAmount(updatedSubtotal)
    let _calculateTotal = calculateTotal(updatedSubtotal, _calculateTaxAmount)
    if (discountPrice) {
      updatedSubtotal -= discountPrice
      _calculateTaxAmount -= discountPrice
      _calculateTotal -= discountPrice
    }
    setTaxAmount(_calculateTaxAmount)
    setSubtotal(updatedSubtotal)
    setTotal(_calculateTotal)
  }, [items, discountPrice])

  React.useEffect(() => {
    let updatedItems: any = []

    if (!isInitialSet) {
      updatedItems = [...INITIAL_ITEMS]
      setIsInitialSet(true)
    } else if (transactionItems.length > 0) {
      // First map all actual items from the backend
      const actualItems = transactionItems
        .filter((item) => item.description && item.description !== "DISCOUNT")
        .map((item, index) => ({
          ...item,
          _id: item.id,
          id: index,
          extended: item.extended || item.price * item.quantity,
          hasActualItem: Boolean(item.description),
        }))
      updatedItems = [...actualItems]
      const emptyRow = createEmptyRow()
      emptyRow.id = updatedItems.length
      updatedItems.push(emptyRow)
    }
    setTransactions(updatedItems)
  }, [transactionItems])
  const createEmptyRow = (): any => {
    const newId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1

    return {
      _id: "",
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
      }))

      const hasEmptyRow = newItems.some((item) => item.description === "" && !item.isDiscount)
      if (!hasEmptyRow) {
        newItems.push(createEmptyRow())
      }
      const sortedItems = newItems.sort((a, b) => {
        if (a.description === "DISCOUNT") return 1
        if (b.description === "DISCOUNT") return -1
        return 0
      })

      setItems(sortedItems)
    } else {
      setItems([...INITIAL_ITEMS])
    }
  }, [transaction])

  const calculateExtended = (item: LineItem, quantity: number, price: number) => {
    const qty = quantity || 1
    const prc = price || 0
    return qty * prc
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.extended || 0), 0)
  }

  const calculateTaxAmount = (subtotal: number) => {
    return (subtotal * (taxRate || 0)) / 100
  }

  const calculateTotal = (subtotal: number, taxAmount: number) => {
    return subtotal + taxAmount
  }

  const updateItemAndNotify = (updatedItems: LineItem[]) => {
    setItems(updatedItems)
    onItemsChange(updatedItems)
  }

  const handleQuantityChange = (id: number, value = 0) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const extended = calculateExtended(item, value, item.price)
        return {
          ...item,
          quantity: value,
          extended,
          itemgroup: invoice.group,
        }
      }
      return item
    })

    updateItemAndNotify(updatedItems)
  }

  const handlePriceChange = (id: number, value = 0) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const extended = calculateExtended(item, item.quantity, value)
        return {
          ...item,
          price: value,
          extended,
          itemgroup: invoice.group,
        }
      }
      return item
    })
    updateItemAndNotify(updatedItems)
  }

  const handleItemChange = async (id: number, description: string) => {
    let updatedItems = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          description,
          itemgroup: invoice.group,
        }
      }
      return item
    })

    // If description changed and we have an item group, lookup price
    if (description && invoice.itemgroup) {
      const { price, quantity } = await lookupPrice(description, invoice.itemgroup)
      if (price !== null || quantity !== null) {
        updatedItems = updatedItems.map((item) => {
          if (item.id === id) {
            const qty = quantity === "" ? 1 : (quantity ?? item.quantity)
            const prc = price ?? item.price
            const extended = calculateExtended(item, qty, prc)
            return {
              ...item,
              quantity: qty,
              price: prc,
              extended,
            }
          }
          return item
        })
      }
    }

    updateItemAndNotify(updatedItems)
  }

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
          }
        }
        return item
      })
      updateItemAndNotify(updatedItems)
    }
  }

  const handleItemSelect = (id: number, selectedItem: any) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const price = selectedItem.price?.toString() || ""
        const quantity = item.quantity || 1 // Default quantity 1 رکھیں
        const extended = calculateExtended(item, quantity, price)
        return {
          ...item,
          description: selectedItem.description,
          price,
          quantity,
          extended,
        }
      }
      return item
    })

    if (id === items[items.length - 1].id) {
      updatedItems.push(createEmptyRow())
    }

    updateItemAndNotify(updatedItems)
  }

  const handleDeleteItem = async (id: number) => {
try{
      // Find the item to be deleted
      console.log(items, "items", id, "this is id")
      const itemToDelete = items.find((item) => item.id === id)
  
      // Don't delete if it's the last empty row
      if (items.length <= 1 || (itemToDelete && !itemToDelete.description)) {
        return
      }
    const iDforDelete= itemToDelete._id;
    if (iDforDelete && typeof iDforDelete === 'string') {
    
      const { error } = await supabase
    .from('towtrans')
    .delete()
    .eq('foxtow_id', itemToDelete?.foxtow_id)
    .eq('id', itemToDelete?._id)
    .eq('dispnumtrs', itemToDelete?.dispnumtrs);
    if (error) {
      console.log('Error deleting item:');
    } else {
      console.log('Item deleted successfully');
    }
    } else {
      console.error("Invalid ID: ID is either missing or not a string.");
    }
  
      // Remove from local state
      let updatedItems = items.filter((item) => item.id !== id)
  
      // Reindex the remaining items
      updatedItems = updatedItems.map((item, index) => ({
        ...item,
        id: index,
      }))
  
      // Ensure there's at least one empty row
      const hasEmptyRow = updatedItems.some((item) => item.description === "" && !item.isDiscount)
  
      if (!hasEmptyRow) {
        const emptyRow = {
          _id: "",
          id: updatedItems.length,
          description: "",
          quantity: 0,
          price: 0,
          extended: 0,
          itemgroup: invoice.group || "",
          hasActualItem: false,
        }
        updatedItems.push(emptyRow)
      }
  
      // Clear any references to the deleted item
      if (refs.current) {
        Object.keys(refs.current).forEach((key) => {
          if (key.startsWith(`description${69 + id * 3}`)) {
            refs.current[key] = createRef<HTMLInputElement>()
          }
        })
      }
  
      updateItemAndNotify(updatedItems)
}catch(err){
  console.error(err)
}
  }

  useEffect(() => {
    const newSubtotal = calculateSubtotal()
    const newTaxAmount = calculateTaxAmount(newSubtotal)
    const newTotal = calculateTotal(newSubtotal, newTaxAmount)

    setSubtotal(newSubtotal)
    setTaxAmount(newTaxAmount)
    setTotal(newTotal)
  }, [items, taxRate])

  useEffect(() => {
    onInvoiceChange({ ...invoice, total })
  }, [total])

  // Initialize refs before rendering
  useEffect(() => {
    if (!refs.current) return // Prevent undefined error

    items.forEach((_, index) => {
      const descriptionKey = `description${69 + (index > 2 ? index + 1 : index)}`
      if (!refs.current[descriptionKey]) {
        refs.current[descriptionKey] = createRef<HTMLInputElement>()
      }
    })
  }, [items])

  const [options, setOptions] = useState<any[]>([])
  const formatLabel = (item: any): string => {
    return `${item.description} ${
      item.shortcut1 ? `(${item.shortcut1})` : ""
    } ${item.shortcut2 ? `(${item.shortcut2})` : ""}`.trim()
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
    if (!value) {
      setDiscountPrice(0)
      return
    } else {
      setDiscountPrice(value)
    }
  }
  const sortedItems = items.sort((a, b) => {
    if (a.description === "DISCOUNT") return 1
    if (b.description === "DISCOUNT") return -1
    return 0
  })

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
                const baseRef = 69 + index * 3
                const descriptionRef = refs[`description${baseRef}`]
                const sectionRef = refs[`description${baseRef + 1}`]
                const priceRef = refs[`description${baseRef + 2}`]

                return (
                  <tr key={item.id} className={item.isDiscount ? "bg-gray-50" : ""}>
                    <td className="p-1">
                      {item.isDiscount ? (
                        <></>
                      ) : (
                        <div className="flex items-center gap-1">
                        {!item.isDiscount && item.description && (
                          <button
                            type="button"
                            className="p-0.5 rounded-full w-4  transition-colors"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={!item.description}
                            title="Delete item"
                          >
                            <XCircle   className=" w-4 text-red-500" />
                          </button>
                        )}
                        <div className="flex-1">
                          <ItemDescriptionCombobox
                            options={options}
                            ref={descriptionRef}
                            value={item.description}
                            onChange={(value) => handleItemChange(item.id, value)}
                            onItemSelect={(selectedItem) => handleItemSelect(item.id, selectedItem)}
                            placeholder={isSmallToMediumScreen?"click..":"click here and choose an item from the list"}
                            inputRefs={descriptionRef}
                            onKeyDown={(e: React.KeyboardEvent<Element>) => onKeyDown(e, `description${baseRef}`)}
                            className={`${!item?.description?"ml-5":""}`}
                          />
                        </div>
                      </div>
                        // <ItemDescriptionCombobox
                        //   options={options}
                        //   ref={descriptionRef}
                        //   value={item.description}
                        //   onChange={(value) => handleItemChange(item.id, value)}
                        //   onItemSelect={(selectedItem) => handleItemSelect(item.id, selectedItem)}
                        //   placeholder={"click here and choose an item from the list"}
                        //   inputRefs={descriptionRef}
                        //   onKeyDown={(e: React.KeyboardEvent<Element>) => onKeyDown(e, `description${baseRef}`)}
                        // />
                      )}
                    </td>
                    <td className="p-1">
                      {!item.isDiscount && (
                        <QuantityInput
                          className="h-9"
                          ref={sectionRef}
                          value={item.quantity}
                          onChange={(value) => handleQuantityChange(item.id, value)}
                          onBlur={() => handleQuantityBlur(item.id, item.quantity)}
                          onKeyDown={(e: React.KeyboardEvent<Element>) => onKeyDown(e, `description${baseRef + 1}`)}
                        />
                      )}
                    </td>
                    <td className="p-1">
                      <CurrencyInput
                        ref={priceRef}
                        className="h-9"
                        value={item.price}
                        onChange={(value) => handlePriceChange(item.id, value)}
                        onKeyDown={(e: React.KeyboardEvent<Element>) => onKeyDown(e, `description${baseRef + 2}`)}
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
                    {/* <td className="p-1">
                      {!item.isDiscount && item.description&& (
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            className="p-1 rounded-md hover:bg-red-100 transition-colors"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={!item.description}
                            title="Delete item"
                          >
                            <Trash2 className="h-5 w-5 text-gray-500 hover:text-red-500" />
                          </button>
                        </div>
                      )}
                    </td> */}
                  </tr>
                )
              })}
              <tr className="bg-gray-50">
                <td className="p-1">
                  <input
                    type="text"
                    
                    className={`ml-5 mr-4 ${isSmallToMediumScreen?'w-[85%]':'w-[97%]'} h-9 rounded-md border border-gray-300 p-2 bg-gray-50 text-sm`}
                    value="DISCOUNT"
                    disabled
                  />
                </td>

                <td className="p-1" colSpan={2}>
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
                <td className="p-1"></td>
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
  )
}

export default ChargesSection

