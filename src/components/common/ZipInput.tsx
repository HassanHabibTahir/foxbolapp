import React, { forwardRef, KeyboardEvent } from 'react';

interface ZipInputProps {
  label: string;
  title: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  value: string;
  onChange: (value: string) => void;
  onEnterPress?: () => void;
  disabled?: boolean;
}

const ZipInput = forwardRef<HTMLInputElement, ZipInputProps>(({
  label,
  title,
  className = '',
  size = 'sm',
  value,
  onChange,
  onEnterPress,
  disabled = false
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 5);
    onChange(newValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && onEnterPress) {
      e.preventDefault();
      onEnterPress();
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const zipCode = e.target.value;
    // Validate zip code length
    if (zipCode && zipCode.length !== 5) {
      onChange('');
    }
  };

  const sizeClasses = {
    xs: 'w-20',
    sm: 'w-32',
    md: 'w-48',
    lg: 'w-64',
    xl: 'w-96',
    full: 'w-full'
  };

  return (
    <div className={size === 'full' ? 'w-full' : 'inline-block'}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input 
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className={`
          mt-1 block rounded-md border border-gray-300 p-2
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${sizeClasses[size]} 
          ${className}
        `}
        title={title}
        placeholder="#####"
        maxLength={5}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={disabled}
        aria-label={`${label} - Enter 5-digit zip code`}
      />
    </div>
  );
});

ZipInput.displayName = 'ZipInput';

export default ZipInput;