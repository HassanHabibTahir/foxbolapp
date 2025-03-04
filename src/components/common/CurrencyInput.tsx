import React, { forwardRef, KeyboardEvent } from 'react';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  onEnterPress?: () => void;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  allowNegative?: boolean;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(({
  value,
  onChange,
  onEnterPress,
  className = '',
  disabled = false,
  min = -999999.99,
  max = 999999.99,
  allowNegative = true
}, ref) => {
  const formatValue = (num: number): string => {
    if (isNaN(num)) return '';
    return num === 0 ? '' : num.toFixed(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^\d.-]/g, '');
    
    if (inputValue === '' || inputValue === '-') {
      onChange(0);
      return;
    }

    let newValue = parseFloat(inputValue);

    if (isNaN(newValue)) {
      onChange(0);
      return;
    }

    // Handle min/max bounds
    if (newValue < min) {
      newValue = min;
    } else if (newValue > max) {
      newValue = max;
    }

    // Handle negative values
    if (!allowNegative && newValue < 0) {
      newValue = 0;
    }

    onChange(newValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Handle arrow keys for increment/decrement
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newValue = Math.min(value + 1, max);
      onChange(newValue);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newValue = Math.max(value - 1, min);
      onChange(newValue);
    } else if (e.key === 'Enter' && !e.shiftKey && onEnterPress) {
      e.preventDefault();
      onEnterPress();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (isNaN(newValue)) {
      onChange(0);
    } else {
      // Ensure value is within bounds on blur
      if (newValue < min) {
        onChange(min);
      } else if (newValue > max) {
        onChange(max);
      } else {
        onChange(newValue);
      }
    }
  };

  return (
    <input
      ref={ref}
      type="number"
      value={formatValue(typeof value !== 'number' ? Number(value) : value)}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className={`
        block w-full rounded-md border border-gray-300 p-2 text-right
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={disabled}
      placeholder="0.00"
    />
  );
});

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;