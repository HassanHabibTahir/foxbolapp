import React from 'react';

interface DetailOptionsProps {
  value: 'detail1' | 'detail2' | 'storedOnly' | null;
  onChange: (value: 'detail1' | 'detail2' | 'storedOnly') => void;
}

export default function DetailOptions({ value, onChange }: DetailOptionsProps) {
  return (
    <div className="flex gap-8 text-white">
      <label className="flex items-center gap-2 cursor-pointer">
        <input 
          type="radio" 
          name="detail" 
          value="detail1"
          checked={value === 'detail1'}
          onChange={(e) => onChange(e.target.value as 'detail1')}
          className="form-radio"
        />
        Detail (1)
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input 
          type="radio" 
          name="detail" 
          value="detail2"
          checked={value === 'detail2'}
          onChange={(e) => onChange(e.target.value as 'detail2')}
          className="form-radio"
        />
        Detail (2)
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input 
          type="radio" 
          name="detail" 
          value="storedOnly"
          checked={value === 'storedOnly'}
          onChange={(e) => onChange(e.target.value as 'storedOnly')}
          className="form-radio"
        />
        Stored Only
      </label>
    </div>
  );
}