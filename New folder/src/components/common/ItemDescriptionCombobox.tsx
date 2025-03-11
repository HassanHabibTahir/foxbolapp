"use client"

import type React from "react"
import { useState, useEffect, forwardRef } from "react"
import Select from "react-select"
import { supabase } from "../../lib/supabase"

interface Item {
  description: string
  shortcut1: string
  shortcut2: string
}

interface ItemOption {
  value: string
  label: string
  item: Item
}

interface ItemDescriptionComboboxProps {
  value?: string
  onChange?: (value: string) => void
  onItemSelect?: (item: Item) => void
  onEnterPress?: () => void
  className?: string
  onKeyDown?: (e: React.KeyboardEvent) => void
  inputRefs?: any
  index?: number
}

const ItemDescriptionCombobox = forwardRef<any, ItemDescriptionComboboxProps>(
  ({ value, onChange, onItemSelect, onEnterPress, className = "", onKeyDown, inputRefs,index }, ref) => {
    const [selectedOption, setSelectedOption] = useState<ItemOption | null>(null)
    const [options, setOptions] = useState<ItemOption[]>([])
const [menuIsOpen, setMenuIsOpen] = useState(false);
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

    const formatLabel = (item: Item): string => {
      return `${item.description} ${item.shortcut1 ? `(${item.shortcut1})` : ""} ${item.shortcut2 ? `(${item.shortcut2})` : ""}`.trim()
    }

    const handleChange = (option: ItemOption | null) => {
      setSelectedOption(option)
      if (option) {
        onChange?.(option.value) // Ensure value is updated
        onItemSelect?.(option.item)
        if (onEnterPress) {
          setTimeout(onEnterPress, 0)
        }
      } else {
        onChange?.("") // Clear value if no option is selected
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      // if (e.key === "Enter" && selectedOption) {
      //   e.preventDefault()
      //   handleChange(selectedOption)
      //   if (onEnterPress) {
      //     onEnterPress()
      //   }
      // }
      // if (onKeyDown) {
      //   onKeyDown(e)
      // }
      if (e.key === "Enter" || e.key === " ") {
        const focusedOption = document.querySelector(
          ".react-select__option--is-focused"
        );
     
        if (focusedOption) {
          e.preventDefault();
          const selectedOptionText = focusedOption.textContent;
          console.log(selectedOptionText , "focused option");
          console.log(selectedOptionText, "selectedOptionText",options);
          const _selectedOption = options?.find(
            (opt: { label: string | null }) => opt.label === selectedOptionText
          );

          console.log(_selectedOption, "selectedOptions-->",);
  
          if (_selectedOption) {
            handleChange(_selectedOption);
            setMenuIsOpen(false);
          }
        }
      }
      onKeyDown?.(e);
    }

    const customStyles = {
      control: (provided: any, state: { isFocused: boolean }) => ({
        ...provided,
        borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
        boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : "none",
        "&:hover": {
          borderColor: "#9CA3AF",
        },
        minHeight: "35px",
        height:"34px"
      }),
      option: (provided: any, state: { isSelected: boolean; isFocused: boolean }) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#E5E7EB" : state.isFocused ? "#F3F4F6" : "white",
        color: "#111827",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#F3F4F6",
        },
      }),
      menu: (provided: any) => ({
        ...provided,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        borderRadius: "0.375rem",
        zIndex: 50,
      }),
      input: (provided: any) => ({
        ...provided,
        color: "#111827",
      }),
      singleValue: (provided: any) => ({
        ...provided,
        color: "#111827",
      }),
      placeholder: (provided: any) => ({
        ...provided,
        color: "#6B7280",
      }),
      noOptionsMessage: (provided: any) => ({
        ...provided,
        color: "#6B7280",
      }),
    }

    const selectProps = {
      id: "select",
      name: "select",

      options: options,
      value: selectedOption,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      className: "react-select-container",
      classNamePrefix: "react-select",
      menuPortalTarget: document.body,
      blurInputOnSelect: true,
      menuIsOpen: menuIsOpen,
      onMenuOpen: () => setMenuIsOpen(true),
      onMenuClose: () => setMenuIsOpen(false),
      openMenuOnFocus: true,
    }
// Add this useEffect to sync the value prop with selectedOption state
useEffect(() => {
  if (value && options.length > 0) {
    const matchingOption = options.find(option => option.value === value);
    if (matchingOption && (!selectedOption || selectedOption.value !== value)) {
      setSelectedOption(matchingOption);
    }
  } else if (!value) {
    setSelectedOption(null);
  }
}, [value, options, selectedOption]);


    return (
      <div className={className}>
     
      <Select
        {...selectProps}
        ref={ref}
        styles={customStyles}
        placeholder="Select..."
        menuPlacement="auto"
        blurInputOnSelect
        components={{
          IndicatorSeparator: null
        }}
      />
    </div>
    )
  },
)

ItemDescriptionCombobox.displayName = "ItemDescriptionCombobox"

export default ItemDescriptionCombobox

