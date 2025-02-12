import React from 'react';
import RadioInput from '../shared/RadioInput';

interface SortOptionsProps {
  value: 'name' | 'number';
  onChange: (value: 'name' | 'number') => void;
}

export default function SortOptions({ value, onChange }: SortOptionsProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-white mb-2">Sort By:</h4>
      <div className="space-y-2">
        <RadioInput
          name="sortBy"
          label="Customer Name"
          value="name"
          checked={value === 'name'}
          onChange={() => onChange('name')}
        />
        <RadioInput
          name="sortBy"
          label="Customer #"
          value="number"
          checked={value === 'number'}
          onChange={() => onChange('number')}
        />
      </div>
    </div>
  );
}