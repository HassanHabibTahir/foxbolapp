import React from 'react';
import TextInput from '../shared/TextInput';
import DateInput from '../shared/DateInput';

interface LotSectionInputProps {
  onLotSectionChange: (value: string) => void;
  onFirstDateChange: (value: string) => void;
  onLastDateChange: (value: string) => void;
}

export default function LotSectionInput({ 
  onLotSectionChange, 
  onFirstDateChange, 
  onLastDateChange 
}: LotSectionInputProps) {
  return (
    <div className="border border-emerald-600 p-4 rounded-lg space-y-4">
      <TextInput label="Lot Section" onChange={onLotSectionChange} />
      <DateInput label="First Date" onChange={onFirstDateChange} />
      <DateInput label="Last Date" onChange={onLastDateChange} />
    </div>
  );
}