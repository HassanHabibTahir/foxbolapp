import React from 'react';
import CheckboxInput from '../shared/CheckboxInput';

interface ReportOptionsProps {
  onChange: (options: ReportOptionsType) => void;
}

export interface ReportOptionsType {
  century: boolean;
  clearedOnly: boolean;
  evenIfReleased: boolean;
  extraNotesLine: boolean;
  showHoldnote: boolean;
  showTowtag: boolean;
  showOdometer: boolean;
}

export default function ReportOptions({ onChange }: ReportOptionsProps) {
  const handleOptionChange = (key: keyof ReportOptionsType) => (checked: boolean) => {
    onChange({ [key]: checked } as any);
  };

  return (
    <div className="space-y-2">
      <CheckboxInput 
        label="Century ON/OFF"
        onChange={handleOptionChange('century')}
      />
      <CheckboxInput 
        label="Cleared Only"
        onChange={handleOptionChange('clearedOnly')}
      />
      <CheckboxInput 
        label="Even If Released"
        onChange={handleOptionChange('evenIfReleased')}
      />
      <CheckboxInput 
        label="Extra Notes Line"
        onChange={handleOptionChange('extraNotesLine')}
      />
      <CheckboxInput 
        label="Show Holdnote (no VIN)"
        onChange={handleOptionChange('showHoldnote')}
      />
      <CheckboxInput 
        label="Show Towtag (no Key or Lot)"
        onChange={handleOptionChange('showTowtag')}
      />
      <CheckboxInput 
        label="Show Odometer (No Color)"
        onChange={handleOptionChange('showOdometer')}
      />
    </div>
  );
}