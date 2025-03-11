import React from 'react';
import DateInput from '../shared/DateInput';

interface DateRangeInputsProps {
  onBeginningDateChange: (date: string) => void;
  onEndingDateChange: (date: string) => void;
}

export default function DateRangeInputs({ onBeginningDateChange, onEndingDateChange }: DateRangeInputsProps) {
  return (
    <div className="space-y-4">
      <DateInput label="Beginning Date" onChange={onBeginningDateChange} />
      <DateInput label="Ending Date" onChange={onEndingDateChange} />
    </div>
  );
}