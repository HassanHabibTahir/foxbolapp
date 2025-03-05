// import React, { forwardRef, KeyboardEvent } from 'react';

// interface CurrencyInputProps {
//   value: number;
//   onChange: (value: number) => void;
//   onEnterPress?: () => void;
//   className?: string;
//   disabled?: boolean;
//   min?: number;
//   max?: number;
//   allowNegative?: boolean;
//   onKeyDown?:any
// }

// const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(({
//   value,
//   onChange,
//   onEnterPress,
//   className = '',
//   disabled = false,
//   min = -999999.99,
//   max = 999999.99,
//   allowNegative = true,
//   onKeyDown
// }, ref) => {
//   const formatValue = (num: number): string => {
//     if (isNaN(num)) return '';
//     return num === 0 ? '' : num.toFixed(2);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (/[^0-9.]/.test(e?.target?.value)) {
//       return value; // Return the character input
//   }
//     const inputValue = e.target.value.replace(/[^\d.-]/g, '');
    
//     if (inputValue === '' || inputValue === '-') {
//       onChange(0);
//       return;
//     }

//     let newValue = parseFloat(inputValue);

//     if (isNaN(newValue)) {
//       onChange(0);
//       return;
//     }

//     // Handle min/max bounds
//     if (newValue < min) {
//       newValue = min;
//     } else if (newValue > max) {
//       newValue = max;
//     }

//     // Handle negative values
//     if (!allowNegative && newValue < 0) {
//       newValue = 0;
//     }

//     onChange(newValue);
//   };

//   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
//     // Handle arrow keys for increment/decrement
//     // if (e.key === 'ArrowUp') {
//     //   e.preventDefault();
//     //   const newValue = Math.min(value + 1, max);
//     //   onChange(newValue);
//     // } else if (e.key === 'ArrowDown') {
//     //   e.preventDefault();
//     //   const newValue = Math.max(value - 1, min);
//     //   onChange(newValue);
//     // } else if (e.key === 'Enter' && !e.shiftKey && onEnterPress) {
//     //   e.preventDefault();
//     //   onEnterPress();
//     // }
//     if (e.key === "ArrowUp" || e.key === "ArrowDown") {
//       e.preventDefault(); // Prevents number from changing
//     }
//     onKeyDown(e);
//   };

//   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//     const newValue = parseFloat(e.target.value);
//     if (isNaN(newValue)) {
//       onChange(0);
//     } else {
//       // Ensure value is within bounds on blur
//       if (newValue < min) {
//         onChange(min);
//       } else if (newValue > max) {
//         onChange(max);
//       } else {
//         onChange(newValue);
//       }
//     }
//   };

//   return (
//     <input
//       ref={ref} 
//       type="text"
//       value={formatValue(typeof value !== 'number' ? Number(value) : value)}
//       onChange={handleChange}
//       onKeyDown={handleKeyDown}
//       onBlur={handleBlur}
//       className={`
        // block w-full rounded-md border border-gray-300 p-2 text-right
        // focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        // disabled:bg-gray-100 disabled:cursor-not-allowed
//         ${className}
//       `}
//       disabled={disabled}
//       placeholder="0.00"
//     />
//   );
// });

// CurrencyInput.displayName = 'CurrencyInput';

// export default CurrencyInput;


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
      placeholder = "0.00",
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

    const formatDisplayValue = () => {
      return rawValue ? `${rawValue}` : ""
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value.replace(/[^0-9.]/g, "") // Allow only numbers and `.`

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
                    block w-full rounded-md border border-gray-300 p-2 text-right
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        disabled:bg-gray-100 disabled:cursor-not-allowed
      
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

