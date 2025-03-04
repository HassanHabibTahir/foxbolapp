import React, { forwardRef, KeyboardEvent } from 'react';

interface DateInputProps {
  label: string;
  title: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  value?: string;
  onChange?: (value: string) => void;
  onEnterPress?: () => void;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(({ 
  label, 
  title, 
  className = '', 
  size = 'sm',
  value = '',
  onChange = () => {},
  onEnterPress
}, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && onEnterPress) {
      e.preventDefault();
      onEnterPress();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If there's already a value, clear it
    if (value) {
      onChange('');
      return;
    }

    // Otherwise, insert current date
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    onChange(formattedDate);
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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input 
        ref={ref}
        type="date"
        className={`mt-1 block ${sizeClasses[size]} rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        title={`${title} (Right-click to insert/clear date)`}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onContextMenu={handleContextMenu}
      />
    </div>
  );
});

DateInput.displayName = 'DateInput';

export default DateInput;