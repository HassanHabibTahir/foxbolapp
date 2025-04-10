import React, { useEffect, useState } from "react"
import Select, { components } from "react-select"
import { supabase } from "../../lib/supabase"

interface AccountNameProps {
  label: string
  title: string
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full"
  value?: string
  onChange?: (value: string) => void
  onEnterPress?: () => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  className?: string
}

// this is account Name
const SelectAccountName = React.forwardRef<HTMLInputElement, AccountNameProps>(
  ({ label, title, size = "full", value = "", onChange, onEnterPress, onKeyDown, className }, ref) => {
    const [companies, setCompanies] = useState<any[]>([])
    const [selectedOption, setSelectedOption] = useState<any | null>(null)
    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    const sizeClasses = {
      xs: "5rem",
      sm: "8rem",
      md: "12rem",
      lg: "16rem",
      xl: "60%",
      full: "100%",
    }

    const fetchCompanies = async () => {
      const { data, error } = await supabase
        .from("customer")
        .select("custname,custnum")
        .ilike("custname", `%${searchTerm}%`)
        .ilike("custnum", `%${searchTerm}%`)
        .limit(10)

      if (!error && data) {
        const result = data.map((item) => ({
          value: item.custname,
          label: `${item.custname} (${item.custnum})`,
        }))
        setCompanies(result)
      }
    }

    useEffect(() => {
      const debounce = setTimeout(fetchCompanies, 300)
      return () => clearTimeout(debounce)
    }, [searchTerm])

    useEffect(() => {
      if (value) {
        const option = companies.find((company) => company.value === value)
        if (option) {
          setSelectedOption(option)
        }
      } else {
        setSelectedOption(null)
      }
    }, [value, companies])

    const handleChange = (option: any | null) => {
      setSelectedOption(option)
      if (option) {
        onChange?.(option.value)
      } else {
        onChange?.("")
      }
    }

    const handleKeyDown = (e: any) => {
      if (e.key === "Enter" && onEnterPress) {
        e.preventDefault()
        onEnterPress()
      }
      onKeyDown?.(e)
    }

    const handleInputChange = (inputValue: string) => {
      setSearchTerm(inputValue)
    }

    const customStyles = {
      control: (provided: any, state: { isFocused: boolean }) => ({
        ...provided,
        fontSize: "14px",
        borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
        "&:hover": {
          borderColor: state.isFocused ? "#3B82F6" : "#9CA3AF",
        },
        boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : "none",
        minHeight: "43px",
        height: "43px",
      }),
      option: (provided: any, state: { isSelected: boolean; isFocused: boolean }) => ({
        ...provided,
        fontSize: "14px",
        backgroundColor: state.isSelected ? "#3B82F6" : state.isFocused ? "#F3F4F6" : "white",
        color: state.isSelected ? "white" : "#111827",
        cursor: "pointer",
        "&:active": {
          backgroundColor: "#3B82F6",
          color: "white",
        },
      }),
      menu: (provided: any) => ({
        ...provided,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        borderRadius: "0.375rem",
        zIndex: 1000,
        width: "90%", // Ensure menu is full width
      }),
      menuList: (provided: any) => ({
        ...provided,
        padding: "4px",
      }),
      input: (provided: any) => ({
        ...provided,
        color: "#111827",
      }),
      container: (provided: any) => ({
        ...provided,
        width: sizeClasses[size], // Apply the width from sizeClasses
      }),
    }

    const selectProps = {
      id: "select",
      name: "select",
      options: companies,
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
      onInputChange: handleInputChange,
      openMenuOnFocus: true,
    }

    return (
      <div className={`w-[95%] ${className || ""}`}>
        {/* {label && (
          <label htmlFor="select" className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )} */}
        <div style={{ width: sizeClasses[size] }}>
          <Select
            {...selectProps}
            ref={ref as any}
            styles={customStyles}
            placeholder="Select a account"
            isClearable
            isSearchable
            components={{
              Option: ({ children, ...props }) => <components.Option {...props}>{children}</components.Option>,
            }}
          />
        </div>
      </div>
    )
  },
)

SelectAccountName.displayName = "SelectAccountName"
export default SelectAccountName

