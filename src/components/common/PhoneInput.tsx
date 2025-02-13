import React, { useState, forwardRef, KeyboardEvent } from 'react';
import { appConfig } from '../../config/appConfig';

interface PhoneInputProps {
  label: string;
  title: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  value?: string;
  onChange?: (value: string) => void;
  onEnterPress?: () => void;
  format?: 'US' | 'INTL';
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({
  label,
  title,
  className = '',
  size = 'md',
  value = '',
  onChange,
  onEnterPress,
  format = appConfig.defaultPhoneFormat
}, ref) => {
  const [isInternational, setIsInternational] = useState(format === 'INTL');
  const [inputValue, setInputValue] = useState(value);

  // Update internal state when prop value changes
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const sizeClasses = {
    xs: 'w-20',
    sm: 'w-32',
    md: 'w-48',
    lg: 'w-64',
    xl: 'w-96',
    full: 'w-full'
  };

  const formatPhoneNumber = (input: string) => {
    // Remove all non-numeric characters
    const cleaned = input.replace(/\D/g, '');
    
    // Format based on the length of the number
    if (isInternational) {
      // International format logic here
      return cleaned;
    } else {
      // US format (XXX) XXX-XXXX
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (!match) return cleaned;

      const parts = [match[1], match[2], match[3]].filter(Boolean);
      
      if (parts.length === 0) return '';
      if (parts.length === 1) return `(${parts[0]}`;
      if (parts.length === 2) return `(${parts[0]}) ${parts[1]}`;
      return `(${parts[0]}) ${parts[1]}-${parts[2]}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setInputValue(formatted);
    
    // Call the parent's onChange with the cleaned value
    if (onChange) {
      onChange(formatted);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && onEnterPress) {
      e.preventDefault();
      onEnterPress();
    }
  };

  return (
    <div className={size === 'full' ? 'w-full' : 'inline-block'}>
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium text-gray-700 ">{label}</label>
      </div>
      <input
        ref={ref}
        type="tel"
        className={`mt-1 block rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${sizeClasses[size]} ${className}`}
        placeholder={isInternational ? '+1 234 567 8900' : '(___) ___-____'}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        title={title}
      />
    </div>
  );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;