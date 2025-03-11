import React from 'react';
import TextInput from '../shared/TextInput';

interface IdentificationInputsProps {
  onCallingAccountChange: (value: string) => void;
  onDriverIdChange: (value: string) => void;
  onTruckIdChange: (value: string) => void;
}

export default function IdentificationInputs({ 
  onCallingAccountChange, 
  onDriverIdChange, 
  onTruckIdChange 
}: IdentificationInputsProps) {
  return (
    <div className="space-y-4">
      <TextInput label="Calling Account #" onChange={onCallingAccountChange} />
      <TextInput label="Driver #" onChange={onDriverIdChange} />
      <TextInput label="Truck #" onChange={onTruckIdChange} />
    </div>
  );
}