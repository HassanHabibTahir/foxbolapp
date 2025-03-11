import React, { forwardRef, KeyboardEvent } from "react";

interface StateInputProps {
  label: string;
  title: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  value: string;
  onChange: (value: string) => void;
  onEnterPress?: () => void;
  disabled?: boolean;
  onKeyDown?: any;
  maxLength?: number;
  placeholder?: string;
}

const StateInput = forwardRef<HTMLInputElement, StateInputProps>(
  (
    {
      label,
      title,
      className = "",
      size = "xs",
      value,
      onChange,
      onEnterPress,
      placeholder,
      maxLength = 7,
      disabled = false,
      onKeyDown,
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Get the new input value
      const inputValue = e.target.value;
      
      // Check if we're deleting (backspace/delete) by comparing lengths
      if (inputValue.length < value.length) {
        // If we're deleting, just pass the new value directly
        onChange(inputValue.toUpperCase());
      } else {
        // If we're adding characters, apply the filter
        const newValue = inputValue
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "") // Allow numbers too (optional)
          .slice(0, maxLength);
        onChange(newValue);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onEnterPress) {
        onEnterPress();
      }
      
      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    const sizeClasses = {
      xs: "w-20",
      sm: "w-32",
      md: "w-48",
      lg: "w-64",
      xl: "w-96",
      full: "w-full",
    };

    return (
      <div className={size === "full" ? "w-full" : "inline-block"}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          ref={ref}
          type="text"
          className={`h-9
          mt-1 block rounded-md border border-gray-300 p-2 uppercase
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${sizeClasses[size]} 
          ${className}
        `}
          title={title}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      </div>
    );
  }
);

StateInput.displayName = "StateInput";

export default StateInput;