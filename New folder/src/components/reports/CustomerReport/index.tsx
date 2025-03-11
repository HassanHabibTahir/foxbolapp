import React, { useState } from 'react';
import CustomerRangeInputs from './CustomerRangeInputs';
import ReportOptions, { ReportOptionsType } from './ReportOptions';
import SortOptions from './SortOptions';
import ActionButtons from './ActionButtons';

interface CustomerReportFormData {
  startingCustomer: string;
  endingCustomer: string;
  options: ReportOptionsType;
  sortBy: 'name' | 'number';
}

export default function CustomerReport() {
  const [formData, setFormData] = useState<CustomerReportFormData>({
    startingCustomer: '',
    endingCustomer: '',
    options: {
      publicAgenciesOnly: false,
      accountsOnly: false,
      salesStatistics: false,
      detail: false,
    },
    sortBy: 'name',
  });

  const handleSubmit = (action: 'screen' | 'printer' | 'others' | 'cancel') => {
    console.log(`Action: ${action}`, formData);
    // Implement actual functionality based on the action
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-emerald-800 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Customer Report</h2>
        
        <div className="space-y-8">
          <h3 className="text-xl text-white mb-4">Leave Field Blank for All</h3>
          
          <CustomerRangeInputs 
            onStartingChange={(value) => setFormData(prev => ({ ...prev, startingCustomer: value }))}
            onEndingChange={(value) => setFormData(prev => ({ ...prev, endingCustomer: value }))}
          />

          <div className="grid grid-cols-2 gap-8">
            <ReportOptions 
              onChange={(options) => setFormData(prev => ({ 
                ...prev, 
                options: { ...prev.options, ...options }
              }))}
            />
            <SortOptions 
              value={formData.sortBy}
              onChange={(value) => setFormData(prev => ({ ...prev, sortBy: value }))}
            />
          </div>

          <ActionButtons onAction={handleSubmit} />
        </div>
      </div>
    </div>
  );
}