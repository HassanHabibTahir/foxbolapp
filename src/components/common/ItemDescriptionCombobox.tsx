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
  placeholder?: string
  options?: ItemOption[]
}

const ItemDescriptionCombobox = forwardRef<any, ItemDescriptionComboboxProps>(
  ({ value, onChange, onItemSelect, onEnterPress, className = "", onKeyDown, inputRefs, index, placeholder, options = [] }, ref) => {
    const [selectedOption, setSelectedOption] = useState<ItemOption | null>(null)
    const [menuIsOpen, setMenuIsOpen] = useState(false)

    const formatLabel = (item: Item): string => {
      return `${item.description} ${item.shortcut1 ? `(${item.shortcut1})` : ""} ${item.shortcut2 ? `(${item.shortcut2})` : ""}`.trim()
    }

    const handleChange = (option: ItemOption | null) => {
      setSelectedOption(option)
      if (option) {
        // Ensure value is updated
        if (onChange) {
          onChange(option.value)
        }
        // Call onItemSelect if provided
        if (onItemSelect) {
          onItemSelect(option.item)
        }
        // Call onEnterPress if provided
        if (onEnterPress) {
          setTimeout(onEnterPress, 0)
        }
      } else {
        // Clear value if no option is selected
        if (onChange) {
          onChange("")
        }
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        const focusedOption = document.querySelector(".react-select__option--is-focused")

        if (focusedOption) {
          e.preventDefault()
          const selectedOptionText = focusedOption.textContent

          // Find the option by comparing the formatted label text
          const _selectedOption = options.find((opt) => formatLabel(opt.item) === selectedOptionText)

          if (_selectedOption) {
            // Important: Update both the selectedOption state and call onChange
            setSelectedOption(_selectedOption)
            
            // Explicitly call onChange with the selected value
            if (onChange) {
              onChange(_selectedOption.value)
            }
            
            // Call onItemSelect if provided
            if (onItemSelect) {
              onItemSelect(_selectedOption.item)
            }
            
            setMenuIsOpen(false)

            // Call onEnterPress if provided
            if (onEnterPress) {
              setTimeout(onEnterPress, 0)
            }
          }
        }
      }
      onKeyDown?.(e)
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
        height: "34px",
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

    // Add this useEffect to sync the value prop with selectedOption state
    useEffect(() => {
      if (value && options.length > 0) {
        const matchingOption = options.find((option) => option.value === value)
        if (matchingOption && (!selectedOption || selectedOption.value !== value)) {
          setSelectedOption(matchingOption)
        }
      } else if (value === "" || value === undefined) {
        setSelectedOption(null)  // Uncommented this line to clear selection when value is empty
      }
    }, [value, options, selectedOption])

    return (
      <div className={className}>
        <Select
          id="select"
          name="select"
          options={options}
          value={selectedOption}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="react-select-container"
          classNamePrefix="react-select"
          menuPortalTarget={document.body}
          blurInputOnSelect={true}
          menuIsOpen={menuIsOpen}
          onMenuOpen={() => setMenuIsOpen(true)}
          onMenuClose={() => setMenuIsOpen(false)}
          openMenuOnFocus={true}
          ref={ref}
          styles={customStyles}
          placeholder={placeholder}
          menuPlacement="auto"
          components={{
            IndicatorSeparator: null,
          }}
        />
      </div>
    )
  },
)

ItemDescriptionCombobox.displayName = "ItemDescriptionCombobox"

export default ItemDescriptionCombobox