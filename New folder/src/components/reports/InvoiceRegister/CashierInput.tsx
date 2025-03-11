import React from 'react';
import TextInput from '../shared/TextInput';

interface CashierInputProps {
  onChange: (value: string) => void;
}

export default function CashierInput({ onChange }: CashierInputProps) {
  return (
    <TextInput label="Cashier" onChange={onChange} className="w-full" />
  );
}