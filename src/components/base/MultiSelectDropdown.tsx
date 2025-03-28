import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';

interface MultiSelectDropdownProps {
  label: string;
  name: string;
  options: string[];
  value: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  name,
  options,
  value = [],
  onChange,
  required = false,
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionChange = (option: string) => {
    // Create a synthetic event to match the expected onChange interface
    const syntheticEvent = {
      target: {
        name,
        value: option,
        type: 'checkbox',
        checked: !value.includes(option),
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  const removeOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create a synthetic event to match the expected onChange interface
    const syntheticEvent = {
      target: {
        name,
        value: option,
        type: 'checkbox',
        checked: false,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div
        onClick={handleToggle}
        className={`flex items-center justify-between px-4 py-2 border rounded-md cursor-pointer ${
          isOpen ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-300'
        } ${error ? 'border-red-500' : ''} ${
          disabled ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'hover:border-indigo-300'
        } transition duration-200 ease-in-out min-h-[42px]`}
      >
        <div className="flex flex-wrap gap-1 py-1">
          {value.length === 0 ? (
            <span className="text-gray-500">Select options...</span>
          ) : (
            value.map((option) => (
              <div
                key={option}
                className="flex items-center bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded-md"
              >
                <span>{option}</span>
                {!disabled && (
                  <X
                    size={14}
                    className="ml-1 cursor-pointer hover:text-indigo-600"
                    onClick={(e) => removeOption(option, e)}
                  />
                )}
              </div>
            ))
          )}
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      
      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleOptionChange(option)}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className={`w-5 h-5 border rounded mr-2 flex items-center justify-center ${
                value.includes(option) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
              }`}>
                {value.includes(option) && <Check size={14} className="text-white" />}
              </div>
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default MultiSelectDropdown;
