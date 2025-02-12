import React from 'react';
import TextInput from '../shared/TextInput';

interface InvoiceInputsProps {
  onBeginningInvoiceChange: (value: string) => void;
  onEndingInvoiceChange: (value: string) => void;
}

export default function InvoiceInputs({ onBeginningInvoiceChange, onEndingInvoiceChange }: InvoiceInputsProps) {
  return (
    <div className="space-y-4">
      <TextInput label="Beginning Invoice #" onChange={onBeginningInvoiceChange} />
      <TextInput label="Ending Invoice #" onChange={onEndingInvoiceChange} />
    </div>
  );
}