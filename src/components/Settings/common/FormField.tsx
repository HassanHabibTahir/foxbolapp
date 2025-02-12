import React from 'react';

interface FormFieldProps {
  label: string;
  type: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const FormField = ({ label, type, placeholder, value, onChange }: FormFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};

export default FormField;