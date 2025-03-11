import React from 'react';
import TextInput from '../shared/TextInput';

interface CustomerRangeInputsProps {
  onStartingChange: (value: string) => void;
  onEndingChange: (value: string) => void;
}

export default function CustomerRangeInputs({ onStartingChange, onEndingChange }: CustomerRangeInputsProps) {
  return (
    <div className="space-y-4">
      <TextInput label="Starting Customer:" onChange={onStartingChange} />
      <TextInput label="Ending Customer:" onChange={onEndingChange} />
    </div>
  );
}