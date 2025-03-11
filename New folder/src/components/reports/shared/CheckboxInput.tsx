import React from 'react';

interface CheckboxInputProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function CheckboxInput({ label, checked, onChange }: CheckboxInputProps) {
  return (
    <label className="flex items-center gap-2 text-white cursor-pointer">
      <input 
        type="checkbox" 
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="form-checkbox"
      />
      <span>{label}</span>
    </label>
  );
}