import React from 'react';

interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  step?: string;
  maxLength?: number;
}

function TextInput({
  label,
  name,
  value = '', // Add default empty string
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  disabled = false,
  error,
  step,
  maxLength
}: TextInputProps) {
  // Ensure value is always a string
  const safeValue = value || '';
  
  // Handle input change with length validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // For text inputs, enforce maxLength at the component level
    if (type !== 'number' && maxLength && newValue.length > maxLength) {
      // Don't update if exceeding max length
      return;
    }
    
    // Pass the event to the parent's onChange handler
    onChange(e);
  };
  
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={safeValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        step={step}
        maxLength={maxLength}
        className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-3 text-base border-gray-300 rounded-md hover:border-indigo-300 transition duration-200 ease-in-out ${
          error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
        } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : ''}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {maxLength && (
        <p className="mt-1 text-xs text-gray-500 text-right">
          {safeValue.length}/{maxLength}
        </p>
      )}
    </div>
  );
}

export default TextInput;
