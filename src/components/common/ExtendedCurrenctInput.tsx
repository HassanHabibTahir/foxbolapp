
import type React from "react"
import { forwardRef, useState, useEffect } from "react"
import { fieldSizes } from "../../utils/fieldSizes"
import { useDeviceType } from "../../hooks/useDeviceType"

interface CurrencyInputProps {
  label?: string
  title?: string
  placeholder?: string
  className?: string
  size?: keyof typeof fieldSizes
  value?: number
  height?: string
  onChange?: (value: any) => void
  onEnterPress?: () => void
  disabled?: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      label,
      title,
      placeholder = "$0.00",
      className = "",
      size = "auto",
      value = 0,
      height = "",
      onChange,
      onEnterPress,
      disabled = false,
      onKeyDown,
    },
    ref,
  ) => {
    const deviceType = useDeviceType()
    const isMobile = deviceType === "mobile"
    const width = isMobile ? "100%" : fieldSizes[size]

    const [rawValue, setRawValue] = useState("")

    // Initialize from props
    useEffect(() => {
      if (value !== undefined) {
        // Convert number to string before using replace
        const cleanValue = value.toString().replace(/[^0-9.]/g, "")
        setRawValue(cleanValue)
      }
    }, [value])

    // Format number with commas and 2 decimal places
    const formatCurrency = (value: string) => {
      if (!value || Number.parseFloat(value) === 0) return ""

      // Parse the value as a float
      const numValue = Number.parseFloat(value)
      if (isNaN(numValue)) return ""

      // Format with commas and 2 decimal places
      return (
        "$" +
        numValue.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      )
    }

    const formatDisplayValue = () => {
      return formatCurrency(rawValue)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Remove dollar sign, commas, and other non-numeric characters
      let newValue = e.target.value.replace(/[$,]/g, "").replace(/[^0-9.]/g, "")

      // Prevent multiple decimal points
      const parts = newValue.split(".")
      if (parts.length > 2) {
        newValue = parts[0] + "." + parts.slice(1).join("")
      }

      // Limit to 2 decimal places
      if (parts.length > 1 && parts[1].length > 2) {
        newValue = `${parts[0]}.${parts[1].substring(0, 2)}`
      }

      setRawValue(newValue)
      if (onChange) {
        onChange(newValue)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && rawValue.length === 0) {
        e.preventDefault() // Prevent removing the `$` sign
        return
      }

      if (e.key === "Enter" && onEnterPress) {
        e.preventDefault()
        onEnterPress()
      }

      if (onKeyDown) {
        onKeyDown(e)
      }
    }

    const handleBlur = () => {
      if (rawValue) {
        let formattedValue = rawValue

        if (!rawValue.includes(".")) {
          formattedValue = `${rawValue}.00`
        } else {
          const parts = rawValue.split(".")
          if (parts[1] === "") formattedValue = `${parts[0]}.00`
          else if (parts[1].length === 1) formattedValue = `${parts[0]}.${parts[1]}0`
        }

        setRawValue(formattedValue)
        if (onChange) onChange(formattedValue)
      }
    }

    return (
      <div className={isMobile ? "w-full" : ""}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
          ref={ref}
          type="text"
          className={`
          mt-1 h-9 block rounded-md border border-gray-300
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm
          ${isMobile ? "w-full" : `p-2 w-[${width}]`}
          ${className} ${height}
        `}
          title={title}
          placeholder={placeholder}
          value={formatDisplayValue()}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      </div>
    )
  },
)

CurrencyInput.displayName = "CurrencyInput"

export default CurrencyInput

