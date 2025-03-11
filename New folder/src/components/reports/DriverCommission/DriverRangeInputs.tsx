import React from 'react';
import TextInput from '../shared/TextInput';

interface DriverRangeInputsProps {
  onFirstDriverChange: (value: string) => void;
  onLastDriverChange: (value: string) => void;
}

export default function DriverRangeInputs({ onFirstDriverChange, onLastDriverChange }: DriverRangeInputsProps) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <TextInput label="First Driver #:" onChange={onFirstDriverChange} />
      <TextInput label="Last Driver #:" onChange={onLastDriverChange} />
    </div>
  );
}