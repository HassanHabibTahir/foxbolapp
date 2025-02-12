import React from 'react';
import TextInput from '../shared/TextInput';

interface ItemRangeInputsProps {
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
}

export default function ItemRangeInputs({ onStartChange, onEndChange }: ItemRangeInputsProps) {
  return (
    <div className="space-y-4">
      <TextInput label="Item Start" onChange={onStartChange} />
      <TextInput label="Item End" onChange={onEndChange} />
    </div>
  );
}