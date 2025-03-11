import React from 'react';
import TextInput from '../shared/TextInput';

interface DriverRangeInputsProps {
  onFirstDriverChange: (value: string) => void;
  onLastDriverChange: (value: string) => void;
}

export default function DriverRangeInputs({ onFirstDriverChange, onLastDriverChange }: DriverRangeInputsProps) {
  return (
    <div className="space-y-4">
      <TextInput label="First Driver #" onChange={onFirstDriverChange} />
      <TextInput label="Last Driver #" onChange={onLastDriverChange} />
    </div>
  );
}