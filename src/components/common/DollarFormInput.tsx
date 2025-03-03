import React, { forwardRef, useState, useEffect } from 'react';
import { fieldSizes } from '../../utils/fieldSizes';
import { useDeviceType } from '../../hooks/useDeviceType';

interface DollarFormInputProps {
  label: string;
  title: string;
  placeholder?: string;
  className?: string;
  size?: keyof typeof fieldSizes;
  value?: string;
  height?: string;
  onChange?: (value: string) => void;
  onEnterPress?: () => void;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const DollarFormInput = forwardRef<HTMLInputElement, DollarFormInputProps>(({
  label,
  title,
  placeholder = '$0.00',
  className = '',
  size = 'auto',
  value = '',
  height = '',
  onChange,
  onEnterPress,
  disabled = false,
  onKeyDown
}, ref) => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const width = isMobile ? '100%' : fieldSizes[size];

  const [rawValue, setRawValue] = useState('');

  // Initialize from props
  useEffect(() => {
    if (value !== undefined) {
      const cleanValue = value.replace(/[^0-9.]/g, '');
      setRawValue(cleanValue);
    }
  }, [value]);

  const formatDisplayValue = () => {
    return rawValue ? `$${rawValue}` : '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numbers and `.`
    
    // Prevent multiple decimal points
    const parts = newValue.split('.');
    if (parts.length > 2) {
      newValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit to 2 decimal places
    if (parts.length > 1 && parts[1].length > 2) {
      newValue = `${parts[0]}.${parts[1].substring(0, 2)}`;
    }

    setRawValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && rawValue.length === 0) {
      e.preventDefault(); // Prevent removing the `$` sign
      return;
    }

    if (e.key === 'Enter' && onEnterPress) {
      e.preventDefault();
      onEnterPress();
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleBlur = () => {
    if (rawValue) {
      let formattedValue = rawValue;

      if (!rawValue.includes('.')) {
        formattedValue = `${rawValue}.00`;
      } else {
        const parts = rawValue.split('.');
        if (parts[1] === '') formattedValue = `${parts[0]}.00`;
        else if (parts[1].length === 1) formattedValue = `${parts[0]}.${parts[1]}0`;
      }

      setRawValue(formattedValue);
      if (onChange) onChange(formattedValue);
    }
  };

  return (
    <div className={isMobile ? 'w-full' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        ref={ref}
        type="text"
        className={`
          mt-1 block rounded-md border border-gray-300
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${isMobile ? 'w-full' : `p-2 w-[${width}]`}
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
  );
});

DollarFormInput.displayName = 'DollarFormInput';

export default DollarFormInput;
