import React from 'react';
import TextInput from '../shared/TextInput';

interface DriverAccountInputsProps {
  onDriverChange: (value: string) => void;
  onAccountChange: (value: string) => void;
}

export default function DriverAccountInputs({ onDriverChange, onAccountChange }: DriverAccountInputsProps) {
  return (
    <div className="space-y-4">
      <TextInput label="Driver" onChange={onDriverChange} />
      <TextInput label="Acct#" onChange={onAccountChange} />
    </div>
  );
}