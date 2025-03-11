import React from 'react';
import RadioInput from '../shared/RadioInput';

interface OutputOptionsProps {
  value: 'original' | 'picturesSmall' | 'picturesMedium' | 'unused';
  onChange: (value: 'original' | 'picturesSmall' | 'picturesMedium' | 'unused') => void;
}

export default function OutputOptions({ value, onChange }: OutputOptionsProps) {
  return (
    <div className="border border-emerald-600 p-4 rounded-lg">
      <div className="space-y-2">
        <RadioInput
          name="output"
          label="Original Report"
          value="original"
          checked={value === 'original'}
          onChange={() => onChange('original')}
        />
        <RadioInput
          name="output"
          label="Pictures (Small)"
          value="picturesSmall"
          checked={value === 'picturesSmall'}
          onChange={() => onChange('picturesSmall')}
        />
        <RadioInput
          name="output"
          label="Pictures (Medium)"
          value="picturesMedium"
          checked={value === 'picturesMedium'}
          onChange={() => onChange('picturesMedium')}
        />
        <RadioInput
          name="output"
          label="Unused"
          value="unused"
          checked={value === 'unused'}
          onChange={() => onChange('unused')}
        />
      </div>
    </div>
  );
}