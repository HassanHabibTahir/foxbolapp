import React, { useState } from 'react';
import DateRangeInputs from './DateRangeInputs';
import CustomerRangeInputs from './CustomerRangeInputs';
import DriverRangeInputs from './DriverRangeInputs';
import ActionButtons from './ActionButtons';

interface AutoClubCommissionFormData {
  beginningDate: string;
  endingDate: string;
  firstCustomer: string;
  lastCustomer: string;
  firstDriver: string;
  lastDriver: string;
}

export default function AutoClubCommission() {
  const [formData, setFormData] = useState<AutoClubCommissionFormData>({
    beginningDate: '',
    endingDate: '',
    firstCustomer: '',
    lastCustomer: '',
    firstDriver: '',
    lastDriver: '',
  });

  const handleSubmit = (action: 'screen' | 'printer' | 'cancel') => {
    console.log(`Action: ${action}`, formData);
    // Implement actual functionality based on the action
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-emerald-800 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Auto Club Commission Report</h2>
        
        <div className="space-y-6">
          <h3 className="text-xl text-white mb-4">Leave Field Blank for All</h3>
          
          <DateRangeInputs 
            onBeginningDateChange={(value) => setFormData(prev => ({ ...prev, beginningDate: value }))}
            onEndingDateChange={(value) => setFormData(prev => ({ ...prev, endingDate: value }))}
          />
          
          <CustomerRangeInputs 
            onFirstCustomerChange={(value) => setFormData(prev => ({ ...prev, firstCustomer: value }))}
            onLastCustomerChange={(value) => setFormData(prev => ({ ...prev, lastCustomer: value }))}
          />
          
          <DriverRangeInputs 
            onFirstDriverChange={(value) => setFormData(prev => ({ ...prev, firstDriver: value }))}
            onLastDriverChange={(value) => setFormData(prev => ({ ...prev, lastDriver: value }))}
          />

          <ActionButtons onAction={handleSubmit} />
        </div>
      </div>
    </div>
  );
}