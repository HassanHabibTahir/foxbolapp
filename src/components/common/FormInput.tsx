import React, { forwardRef, KeyboardEvent } from 'react';
import { fieldSizes } from '../../utils/fieldSizes';
import { useDeviceType } from '../../hooks/useDeviceType';

interface FormInputProps {
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

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({ 
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

  // const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter' && !e.shiftKey && onEnterPress) {
  //     e.preventDefault();
  //     onEnterPress();
  //   }
  // };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) {
      onKeyDown(e)
    }
  }
  return (
    <div className={isMobile ? 'w-full' : ''}>
      <label className="block text-sm font-medium text-gray-700 mobile-text-sm mb-1">
        {label}
      </label>
      <input 
        ref={ref}
        type={type}
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
        onChange={onChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;