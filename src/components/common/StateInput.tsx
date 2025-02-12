import React, { forwardRef, KeyboardEvent } from 'react';

interface StateInputProps {
  label: string;
  title: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  value: string;
  onChange: (value: string) => void;
  onEnterPress?: () => void;
  disabled?: boolean;
}

const StateInput = forwardRef<HTMLInputElement, StateInputProps>(({ 
  label, 
  title, 
  className = '', 
  size = 'xs',
  value,
  onChange,
  onEnterPress,
  disabled = false
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
    onChange(newValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && onEnterPress) {
      e.preventDefault();
      onEnterPress();
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
        className={`
          mt-1 block rounded-md border border-gray-300 p-2 uppercase
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${sizeClasses[size]} 
          ${className}
        `}
        title={title}
        maxLength={2}
        placeholder="XX"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
    </div>
  );
});

StateInput.displayName = 'StateInput';

export default StateInput;