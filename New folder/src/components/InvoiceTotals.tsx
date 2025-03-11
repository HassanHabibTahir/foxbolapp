import React from 'react';
import FormSection from './common/FormSection';
import TotalDisplay from './common/TotalDisplay';
import CurrencyInput from './common/CurrencyInput';

interface InvoiceTotalsProps {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  amountReceived: number;
  total: number;
  onTaxRateChange: (value: number) => void;
  onAmountReceivedChange: (value: number) => void;
}

const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({
  subtotal,
  taxRate,
  taxAmount,
  amountReceived,
  total,
  onTaxRateChange,
  onAmountReceivedChange
}) => {
  return (
    <FormSection>
      <div className="flex flex-col gap-3 max-w-md ml-auto">
        <TotalDisplay label="Subtotal" amount={subtotal} />
        
        <div className="flex items-center justify-end gap-4">
          <span className="font-medium text-gray-700">Tax Rate %:</span>
          <div className="w-40">
            <CurrencyInput

              value={taxRate}
              onChange={onTaxRateChange}
              className="text-right h-9"
              
            />
          </div>
        </div>

        <TotalDisplay label="Tax Amount" amount={taxAmount} className='h-9'/>
        
        <div className="flex items-center justify-end gap-4">
          <span className="font-medium text-gray-700">Amount Received:</span>
          <div className="w-40">
            <CurrencyInput
              value={amountReceived}
              onChange={onAmountReceivedChange}
              className="text-right h-9"

            />
          </div>
        </div>

        <div className="border-t border-gray-300 pt-3 mt-3">
          <TotalDisplay 
            label="Invoice Total" 
            amount={total}
            className="text-lg h-9" 
          />
        </div>
      </div>
    </FormSection>
  );
};

export default InvoiceTotals;