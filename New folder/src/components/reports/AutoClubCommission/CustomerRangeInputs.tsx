import React from 'react';
import TextInput from '../shared/TextInput';

interface CustomerRangeInputsProps {
  onFirstCustomerChange: (value: string) => void;
  onLastCustomerChange: (value: string) => void;
}

export default function CustomerRangeInputs({ onFirstCustomerChange, onLastCustomerChange }: CustomerRangeInputsProps) {
  return (
    <div className="space-y-4">
      <TextInput label="First Customer #" onChange={onFirstCustomerChange} />
      <TextInput label="Last Customer #" onChange={onLastCustomerChange} />
    </div>
  );
}