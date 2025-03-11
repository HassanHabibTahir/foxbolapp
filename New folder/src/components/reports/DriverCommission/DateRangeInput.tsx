import React from 'react';
import DateInput from '../shared/DateInput';

interface DateRangeInputProps {
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function DateRangeInput({ onStartDateChange, onEndDateChange }: DateRangeInputProps) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-white">Date Range:</label>
      <DateInput label="" onChange={onStartDateChange} />
      <DateInput label="" onChange={onEndDateChange} />
    </div>
  );
}