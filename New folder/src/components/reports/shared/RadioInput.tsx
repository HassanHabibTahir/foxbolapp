import React from 'react';

interface RadioInputProps {
  name: string;
  label: string;
  value: string;
  checked?: boolean;
  onChange?: () => void;
}

export default function RadioInput({ name, label, value, checked, onChange }: RadioInputProps) {
  return (
    <label className="flex items-center gap-2 text-white cursor-pointer">
      <input 
        type="radio" 
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="form-radio"
      />
      <span>{label}</span>
    </label>
  );
}