import React from 'react';
import CheckboxInput from '../shared/CheckboxInput';

interface ReportOptionsProps {
  onChange: (options: ReportOptionsType) => void;
}

export interface ReportOptionsType {
  summary: boolean;
  dateRange: boolean;
  sortByInv: boolean;
}

export default function ReportOptions({ onChange }: ReportOptionsProps) {
  const handleOptionChange = (key: keyof ReportOptionsType) => (checked: boolean) => {
    onChange({ [key]: checked } as any);
  };

  return (
    <div className="space-y-2">
      <CheckboxInput 
        label="Summary"
        onChange={handleOptionChange('summary')}
      />
      <CheckboxInput 
        label="Date Range"
        onChange={handleOptionChange('dateRange')}
      />
      <CheckboxInput 
        label="Sort By Inv#"
        onChange={handleOptionChange('sortByInv')}
      />
    </div>
  );
}