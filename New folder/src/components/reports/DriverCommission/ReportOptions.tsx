import React from 'react';
import RadioInput from '../shared/RadioInput';
import CheckboxInput from '../shared/CheckboxInput';

interface ReportOptionsProps {
  onCallTypeChange: (type: 'all' | 'commission') => void;
  onSummaryChange: (checked: boolean) => void;
  onIncludeAAAChange: (checked: boolean) => void;
}

export default function ReportOptions({ 
  onCallTypeChange, 
  onSummaryChange, 
  onIncludeAAAChange 
}: ReportOptionsProps) {
  return (
    <div className="space-y-6">
      <div className="flex gap-8">
        <RadioInput
          name="callType"
          label="All Calls"
          value="all"
          onChange={() => onCallTypeChange('all')}
        />
        <RadioInput
          name="callType"
          label="Commission Calls"
          value="commission"
          onChange={() => onCallTypeChange('commission')}
        />
      </div>
      
      <div className="flex gap-8">
        <CheckboxInput
          label="Summary Only"
          onChange={onSummaryChange}
        />
        <CheckboxInput
          label="Include AAA"
          onChange={onIncludeAAAChange}
        />
      </div>
    </div>
  );
}