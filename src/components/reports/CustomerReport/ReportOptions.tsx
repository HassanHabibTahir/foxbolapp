import React from 'react';
import CheckboxInput from '../shared/CheckboxInput';

interface ReportOptionsProps {
  onChange: (options: ReportOptionsType) => void;
}

export interface ReportOptionsType {
  publicAgenciesOnly: boolean;
  accountsOnly: boolean;
  salesStatistics: boolean;
  detail: boolean;
}

export default function ReportOptions({ onChange }: ReportOptionsProps) {
  const handleOptionChange = (key: keyof ReportOptionsType) => (checked: boolean) => {
    onChange({ [key]: checked } as any);
  };

  return (
    <div className="space-y-2">
      <h4 className="text-white mb-2">Options:</h4>
      <CheckboxInput 
        label="Public Agencies Only"
        onChange={handleOptionChange('publicAgenciesOnly')}
      />
      <CheckboxInput 
        label="Accounts Only"
        onChange={handleOptionChange('accountsOnly')}
      />
      <CheckboxInput 
        label="Sales Statistics"
        onChange={handleOptionChange('salesStatistics')}
      />
      <CheckboxInput 
        label="Detail"
        onChange={handleOptionChange('detail')}
      />
    </div>
  );
}