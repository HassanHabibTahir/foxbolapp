import React from 'react';
import RadioInput from '../shared/RadioInput';

interface SortOptionsProps {
  value: 'dispatch' | 'makeDispatch' | 'dateDispatch' | 'lotDispatch';
  onChange: (value: 'dispatch' | 'makeDispatch' | 'dateDispatch' | 'lotDispatch') => void;
}

export default function SortOptions({ value, onChange }: SortOptionsProps) {
  return (
    <div className="border border-emerald-600 p-4 rounded-lg">
      <h4 className="text-white mb-4">Sort by:</h4>
      <div className="space-y-2">
        <RadioInput
          name="sortBy"
          label="Dispatch #"
          value="dispatch"
          checked={value === 'dispatch'}
          onChange={() => onChange('dispatch')}
        />
        <RadioInput
          name="sortBy"
          label="Make & Dispatch #"
          value="makeDispatch"
          checked={value === 'makeDispatch'}
          onChange={() => onChange('makeDispatch')}
        />
        <RadioInput
          name="sortBy"
          label="Date-in & Dispatch #"
          value="dateDispatch"
          checked={value === 'dateDispatch'}
          onChange={() => onChange('dateDispatch')}
        />
        <RadioInput
          name="sortBy"
          label="Lot Section & Dispatch #"
          value="lotDispatch"
          checked={value === 'lotDispatch'}
          onChange={() => onChange('lotDispatch')}
        />
      </div>
    </div>
  );
}