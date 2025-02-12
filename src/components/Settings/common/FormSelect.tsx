import React from 'react';
import { GPSProvider } from '../GPS/types';

interface FormSelectProps {
  label: string;
  options: GPSProvider[];
  value: string;
  onChange: (value: string) => void;
}

const FormSelect = ({ label, options, value, onChange }: FormSelectProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a provider</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;