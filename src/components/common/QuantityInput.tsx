import React, { forwardRef, KeyboardEvent } from 'react';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  onEnterPress?: () => void;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  onKeyDown?:any
}

const QuantityInput = forwardRef<HTMLInputElement, QuantityInputProps>(({
  value,
  onChange,
  onBlur,
  onEnterPress,
  className = '',
  disabled = false,
  min = 0,
  max = 9999,
  step = 1,
  onKeyDown
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/[^0-9.]/.test(value)) {
        return value; // Return the character input
    }

    const newValue = value === '' ? 0 : parseFloat(value);

    if (isNaN(newValue)) {
        onChange(0);
        return;
    }

    // Ensure value is within bounds
    if (newValue < min) {
        onChange(min);
    } else if (newValue > max) {
        onChange(max);
    } else {
        onChange(newValue);
    }
};


  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Handle arrow keys for increment/decrement
    // if (e.key === 'ArrowUp') {
    //   e.preventDefault();
    //   const newValue = Math.min(value + step, max);
    //   onChange(newValue);
    // } else if (e.key === 'ArrowDown') {
    //   e.preventDefault();
    //   const newValue = Math.max(value - step, min);
    //   onChange(newValue);
    // } else if (e.key === 'Enter' && !e.shiftKey && onEnterPress) {
    //   e.preventDefault();
    //   onEnterPress();
    // }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault(); // Prevents number from changing
    }
    onKeyDown(e)
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Ensure value is a valid number on blur
    const newValue = parseFloat(e.target.value);
    if (isNaN(newValue) || newValue < min) {
      onChange(min);
    }
    onBlur?.();
  };

  return (
    <input
      ref={ref}
      type="text"
      value={value === 0 ? '' : value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className={`
        block w-full rounded-md border border-gray-300 p-2 text-right
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${className}
      `}
      placeholder="0"
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      title={`Enter quantity (${min}-${max})`}
      aria-label="Quantity"
    />
  );
});

QuantityInput.displayName = 'QuantityInput';

export default QuantityInput;