import React from 'react';
import CheckboxInput from '../shared/CheckboxInput';

interface VehicleOptionsProps {
  onChange: (options: VehicleOptionsType) => void;
}

export interface VehicleOptionsType {
  storedVehicles: boolean;
  impoundedVehicles: boolean;
  holdVehicles: boolean;
  privateImpounds: boolean;
  thirtyDayImpound: boolean;
  recovered: boolean;
  abandoned: boolean;
  wrecked: boolean;
  towed: boolean;
}

export default function VehicleOptions({ onChange }: VehicleOptionsProps) {
  const handleOptionChange = (key: keyof VehicleOptionsType) => (checked: boolean) => {
    onChange({ [key]: checked } as any);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <CheckboxInput 
          label="Stored Vehicles"
          onChange={handleOptionChange('storedVehicles')}
        />
        <CheckboxInput 
          label="Impounded Vehicles"
          onChange={handleOptionChange('impoundedVehicles')}
        />
        <CheckboxInput 
          label="Hold Vehicles"
          onChange={handleOptionChange('holdVehicles')}
        />
        <CheckboxInput 
          label="Private Impounds"
          onChange={handleOptionChange('privateImpounds')}
        />
        <CheckboxInput 
          label="30 Day Impound"
          onChange={handleOptionChange('thirtyDayImpound')}
        />
      </div>
      <div className="space-y-2">
        <CheckboxInput 
          label="Recovered"
          onChange={handleOptionChange('recovered')}
        />
        <CheckboxInput 
          label="Abandoned"
          onChange={handleOptionChange('abandoned')}
        />
        <CheckboxInput 
          label="Wrecked"
          onChange={handleOptionChange('wrecked')}
        />
        <CheckboxInput 
          label="Towed"
          onChange={handleOptionChange('towed')}
        />
      </div>
    </div>
  );
}