import React from 'react';
import RadioInput from '../shared/RadioInput';

interface SortOptionsProps {
  value: 'date' | 'invoice' | 'customer' | 'dateCashier' | 'drawerTime';
  onChange: (value: 'date' | 'invoice' | 'customer' | 'dateCashier' | 'drawerTime') => void;
}

export default function SortOptions({ value, onChange }: SortOptionsProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-white mb-2">Sort by:</h4>
      <RadioInput
        name="sortBy"
        label="Date"
        value="date"
        checked={value === 'date'}
        onChange={() => onChange('date')}
      />
      <RadioInput
        name="sortBy"
        label="Invoice #"
        value="invoice"
        checked={value === 'invoice'}
        onChange={() => onChange('invoice')}
      />
      <RadioInput
        name="sortBy"
        label="Customer #"
        value="customer"
        checked={value === 'customer'}
        onChange={() => onChange('customer')}
      />
      <RadioInput
        name="sortBy"
        label="Date & Cashier"
        value="dateCashier"
        checked={value === 'dateCashier'}
        onChange={() => onChange('dateCashier')}
      />
      <RadioInput
        name="sortBy"
        label="Drawer & Time"
        value="drawerTime"
        checked={value === 'drawerTime'}
        onChange={() => onChange('drawerTime')}
      />
    </div>
  );
}