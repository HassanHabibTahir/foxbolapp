import React, { forwardRef, KeyboardEvent } from 'react';

interface LienTypeInputProps {
  label: string;
  title: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  value: string;
  onChange: (value: string) => void;
  onEnterPress?: () => void;
  disabled?: boolean;
  onKeyDown?:any
}

const LienTypeInput = forwardRef<HTMLInputElement, LienTypeInputProps>(({
  label,
  title,
  className = '',
  size = 'xs',
  value,
  onChange,
  onEnterPress,
  disabled = false,
  onKeyDown
}, ref) => {
  const validTypes = ['U', 'R', 'O'] as const;
  type ValidLienType = typeof validTypes[number];

  const getTypeDescription = (type: ValidLienType | string): string => {
    switch (type) {
      case 'U': return 'Unclaimed';
      case 'R': return 'Released';
      case 'O': return 'Other';
      default: return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    if (newValue === '' || validTypes.includes(newValue as ValidLienType)) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // if (e.key === 'Enter' && !e.shiftKey && onEnterPress) {
    //   e.preventDefault();
    //   onEnterPress();
    // }
    onKeyDown(e)
  };

  const handleBlur = () => {
    if (value && !validTypes.includes(value as ValidLienType)) {
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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        <span className="text-xs text-gray-500 ml-2">
          ({validTypes.join('/')})
        </span>
      </label>
      <div className="relative">
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
          title={`${title} - ${validTypes.map(t => `${t}=${getTypeDescription(t)}`).join(', ')}`}
          placeholder={validTypes.join('/')}
          maxLength={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          disabled={disabled}
          aria-label={`${label} - Select lien type: ${validTypes.map(t => `${t} for ${getTypeDescription(t)}`).join(', ')}`}
        />
        {value && (
          <div className="absolute left-0 mt-1 text-xs text-gray-500">
            {getTypeDescription(value)}
          </div>
        )}
      </div>
    </div>
  );
});

LienTypeInput.displayName = 'LienTypeInput';

export default LienTypeInput;