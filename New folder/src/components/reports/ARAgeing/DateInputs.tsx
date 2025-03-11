import React from 'react';
import DateInput from '../shared/DateInput';

interface DateInputsProps {
  onAgeingCutoffDateChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  dateRangeEnabled: boolean;
}

export default function DateInputs({ 
  onAgeingCutoffDateChange, 
  onStartDateChange, 
  onEndDateChange,
  dateRangeEnabled 
}: DateInputsProps) {
  return (
    <div className="space-y-4">
      <DateInput label="Ageing Cutoff Date" onChange={onAgeingCutoffDateChange} />
      {dateRangeEnabled && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <DateInput label="" onChange={onStartDateChange} />
          <DateInput label="" onChange={onEndDateChange} />
        </div>
      )}
    </div>
  );
}