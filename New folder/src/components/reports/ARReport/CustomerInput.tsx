import React from 'react';

interface CustomerInputProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function CustomerInput({ label, value, onChange }: CustomerInputProps) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-center gap-4 text-white">
      <label>{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-3 py-1 text-black"
      />
    </div>
  );
}