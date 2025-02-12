import React from 'react';
import CurrencyInput from './CurrencyInput';

interface TotalDisplayProps {
  label: string;
  amount: number;
  disabled?: boolean;
  className?: string;
}

const TotalDisplay: React.FC<TotalDisplayProps> = ({ 
  label, 
  amount, 
  disabled = true,
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-end gap-4 ${className}`}>
      <span className="font-medium text-gray-700">{label}:</span>
      <div className="w-40">
        <CurrencyInput
          value={amount}
          onChange={() => {}}
          disabled={disabled}
          className="font-bold"
        />
      </div>
    </div>
  );
};

export default TotalDisplay;