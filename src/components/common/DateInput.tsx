import React, { forwardRef, KeyboardEvent, useState, useEffect } from "react";

interface DateInputProps {
  label: string;
  title: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  value?: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  fieldName?: any;
  FIELD_INDEXES?: any;
  inputRefs?: any;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      label,
      title,
      className = "",
      size = "sm",
      value = "",
      onChange = () => {},
      onKeyDown,
      fieldName,
      FIELD_INDEXES,
      inputRefs,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value);

    useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;

      // Remove any non-digit characters
      const digitsOnly = input.replace(/\D/g, "");

      // Format as user types - don't allow more than 8 digits (YYYYMMDD)
      if (digitsOnly.length <= 8) {
        let formattedValue = "";

        if (digitsOnly.length <= 4) {
          // Just show the digits as part of year
          formattedValue = digitsOnly;
        } else if (digitsOnly.length <= 6) {
          // Format as YYYY-MM
          formattedValue = `${digitsOnly.substring(
            0,
            4
          )}-${digitsOnly.substring(4)}`;
        } else {
          // Format as YYYY-MM-DD
          formattedValue = `${digitsOnly.substring(
            0,
            4
          )}-${digitsOnly.substring(4, 6)}-${digitsOnly.substring(6)}`;
        }

        setInternalValue(formattedValue);
        onChange(formattedValue);
      }
    };

    // const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    //   // Allow backspace, delete, arrow keys, etc.
    //   if (onKeyDown) {
    //     onKeyDown(e);
    //   }
    // };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (onKeyDown) {
        const currentIndex = FIELD_INDEXES[fieldName];
        console.log(fieldName, "fieldName==>");
        const input = e.target as HTMLInputElement;
        const currentValue = input.value;
        if (e.key === "Backspace") {
          return;
        }
        if (currentValue.length === 10) {
          const nextField = Object.keys(FIELD_INDEXES).find(
            (key) => FIELD_INDEXES[key] === currentIndex + 1
          );
          if (nextField) inputRefs[nextField].current?.focus();
        }

        onKeyDown(e);
      }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();

      if (internalValue) {
        setInternalValue("");
        onChange("");
        return;
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      setInternalValue(formattedDate);
      onChange(formattedDate);
    };

    const sizeClasses = {
      xs: "w-20",
      sm: "w-32",
      md: "w-48",
      lg: "w-64",
      xl: "w-96",
      full: "w-full",
    };

    const handleDateBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const currentValue = e.target.value;

      if (currentValue) {
        // On blur, ensure the date is formatted properly
        const digitsOnly = currentValue.replace(/\D/g, "");

        if (digitsOnly.length === 8) {
          // We have a complete date YYYYMMDD
          const year = digitsOnly.substring(0, 4);
          const month = digitsOnly.substring(4, 6);
          const day = digitsOnly.substring(6, 8);

          // Validate month and day
          const monthNum = parseInt(month, 10);
          const dayNum = parseInt(day, 10);

          if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
            const formattedDate = `${year}-${month}-${day}`;
            setInternalValue(formattedDate);
            onChange(formattedDate);
          }
        } else if (digitsOnly.length > 0) {
          // Handle short years (convert 23 to 2023)
          if (digitsOnly.length <= 2) {
            const currentYear = new Date().getFullYear();
            const century = Math.floor(currentYear / 100) * 100;
            const fullYear = century + parseInt(digitsOnly.padEnd(2, "0"), 10);

            setInternalValue(String(fullYear));
            onChange(String(fullYear));
          }
        }
      }
    };

    return (
      <div className={size === "full" ? "w-full" : "inline-block"}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          ref={ref}
          autoComplete="off"
          type="text"
          className={`mt-1 block ${sizeClasses[size]} rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
          title={`${title} (Format: YYYY-MM-DD, Right-click to insert/clear date)`}
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleDateBlur}
          maxLength={10}
          onContextMenu={handleContextMenu}
          placeholder="YYYY-MM-DD"
        />
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export default DateInput;
