import React from 'react';
import TextInput from '../shared/TextInput';

interface DateRangeInputsProps {
  onBeginningDateChange: (value: string) => void;
  onEndingDateChange: (value: string) => void;
}

export default function DateRangeInputs({ onBeginningDateChange, onEndingDateChange }: DateRangeInputsProps) {
  return (
    <div className="space-y-4">
      <TextInput label="Beginning Date:" onChange={onBeginningDateChange} />
      <TextInput label="Ending Date:" onChange={onEndingDateChange} />
    </div>
  );
}