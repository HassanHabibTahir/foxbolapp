import React from 'react';
import CheckboxInput from '../shared/CheckboxInput';

interface ReportOptionsProps {
  onChange: (options: ReportOptionsType) => void;
}

export interface ReportOptionsType {
  includeStored: boolean;
  showDeleted: boolean;
  paidInDateRange: boolean;
  lookAtTowdate: boolean;
  noPoRecords: boolean;
}

export default function ReportOptions({ onChange }: ReportOptionsProps) {
  const handleOptionChange = (key: keyof ReportOptionsType) => (checked: boolean) => {
    onChange({ [key]: checked } as any);
  };

  return (
    <div className="space-y-2">
      <CheckboxInput 
        label="Include Stored"
        onChange={handleOptionChange('includeStored')}
      />
      <CheckboxInput 
        label="Show Deleted"
        onChange={handleOptionChange('showDeleted')}
      />
      <CheckboxInput 
        label="Paid in this Date range only"
        onChange={handleOptionChange('paidInDateRange')}
      />
      <CheckboxInput 
        label="Look at Towdate Not Invoice Date"
        onChange={handleOptionChange('lookAtTowdate')}
      />
      <CheckboxInput 
        label="Only Records With No PO"
        onChange={handleOptionChange('noPoRecords')}
      />
    </div>
  );
}