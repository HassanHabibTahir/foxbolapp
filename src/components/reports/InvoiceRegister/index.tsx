import React, { useState } from 'react';
import DateRangeInputs from './DateRangeInputs';
import InvoiceInputs from './InvoiceInputs';
import DriverAccountInputs from './DriverAccountInputs';
import CashierInput from './CashierInput';
import ReportOptions, { ReportOptionsType } from './ReportOptions';
import ActionButtons from './ActionButtons';

interface InvoiceRegisterFormData {
  beginningDate: string;
  endingDate: string;
  beginningInvoice: string;
  endingInvoice: string;
  driver: string;
  account: string;
  cashier: string;
  options: ReportOptionsType;
}

export default function InvoiceRegister() {
  const [formData, setFormData] = useState<InvoiceRegisterFormData>({
    beginningDate: '',
    endingDate: '',
    beginningInvoice: '',
    endingInvoice: '',
    driver: '',
    account: '',
    cashier: '',
    options: {
      includeStored: false,
      showDeleted: false,
      paidInDateRange: false,
      lookAtTowdate: false,
      noPoRecords: false,
    },
  });

  const handleSubmit = (action: 'screen' | 'printer' | 'others' | 'close') => {
    console.log(`Action: ${action}`, formData);
    // Implement actual functionality based on the action
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-emerald-800 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Invoice Register Report</h2>
        
        <div className="space-y-6">
          <h3 className="text-xl text-white mb-4">Leave Field Blank for All</h3>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <DateRangeInputs 
                onBeginningDateChange={(date) => setFormData(prev => ({ ...prev, beginningDate: date }))}
                onEndingDateChange={(date) => setFormData(prev => ({ ...prev, endingDate: date }))}
              />
              
              <InvoiceInputs 
                onBeginningInvoiceChange={(value) => setFormData(prev => ({ ...prev, beginningInvoice: value }))}
                onEndingInvoiceChange={(value) => setFormData(prev => ({ ...prev, endingInvoice: value }))}
              />
            </div>

            <DriverAccountInputs 
              onDriverChange={(value) => setFormData(prev => ({ ...prev, driver: value }))}
              onAccountChange={(value) => setFormData(prev => ({ ...prev, account: value }))}
            />
          </div>

          <CashierInput 
            onChange={(value) => setFormData(prev => ({ ...prev, cashier: value }))}
          />

          <div className="grid grid-cols-2 gap-8">
            <ReportOptions 
              onChange={(options) => setFormData(prev => ({ 
                ...prev, 
                options: { ...prev.options, ...options }
              }))}
            />
            <ActionButtons onAction={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}