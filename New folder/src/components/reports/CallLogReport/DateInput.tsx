import React from 'react';

interface DateInputProps {
  label: string;
  onChange?: (date: string) => void;
}

export default function DateInput({ label }: DateInputProps) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-center gap-4 text-white">
      <label>{label}</label>
      <div className="flex gap-2">
        <input 
          type="text" 
          className="w-16 px-2 py-1 text-black"
          placeholder="MM"
          maxLength={2}
        />
        <span>/</span>
        <input 
          type="text" 
          className="w-16 px-2 py-1 text-black"
          placeholder="DD"
          maxLength={2}
        />
        <span>/</span>
        <input 
          type="text" 
          className="w-16 px-2 py-1 text-black"
          placeholder="YYYY"
          maxLength={4}
        />
      </div>
    </div>
  );
}