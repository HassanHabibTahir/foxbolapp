import React, { forwardRef, KeyboardEvent } from 'react';
import { fieldSizes } from '../../utils/fieldSizes';
import { useDeviceType } from '../../hooks/useDeviceType';

interface NumberInputProps {
  label: string;
  title: string;
  type?: string;
  placeholder?: string;
  className?: string;
  size?: keyof typeof fieldSizes;
  value?: string;
  height?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterPress?: () => void;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(({
  label, 
  title, 
  type = 'text',
  placeholder,
  className = '',
  size = 'auto',
  value,
  height = '',
  onChange,
  onEnterPress,
  disabled = false,
  onKeyDown
}, ref) => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const width = isMobile ? '100%' : fieldSizes[size];

  // Only allow numbers (0-9) and special keys like Backspace, Tab, Enter, Arrow keys
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }

    if (!/^\d$/.test(e.key) && 
        !['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className={isMobile ? 'w-full' : ''}>
      <label className="block text-sm font-medium text-gray-700 mobile-text-sm mb-1">
        {label}
      </label>
      <input 
        ref={ref}
        type="text" // Keep text type to allow control over input behavior
        className={`
          mt-1 block rounded-md border border-gray-300
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${isMobile ? 'mobile-compact-input w-full' : `p-2 w-[${width}]`}
          ${className}
          ${height}
        `}
        title={title}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          // Prevent non-numeric characters (for pasted values)
          if (/^\d*$/.test(e.target.value)) {
            onChange?.(e);
          }
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
    </div>
  );
});

NumberInput.displayName = 'NumberInput';

export default NumberInput;
