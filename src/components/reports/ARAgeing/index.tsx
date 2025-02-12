import React, { useState } from 'react';
import CustomerRangeInputs from './CustomerRangeInputs';
import DateInputs from './DateInputs';
import ReportOptions, { ReportOptionsType } from './ReportOptions';
import ActionButtons from './ActionButtons';

interface ARAgeingFormData {
  firstCustomer: string;
  lastCustomer: string;
  ageingCutoffDate: string;
  dateRange: {
    start: string;
    end: string;
  };
  options: ReportOptionsType;
}

export default function ARAgeing() {
  const [formData, setFormData] = useState<ARAgeingFormData>({
    firstCustomer: '',
    lastCustomer: '',
    ageingCutoffDate: '',
    dateRange: {
      start: '',
      end: '',
    },
    options: {
      summary: false,
      dateRange: false,
      sortByInv: false,
    },
  });

  const handleSubmit = (action: 'screen' | 'printer' | 'others' | 'cancel') => {
    console.log(`Action: ${action}`, formData);
    // Implement actual functionality based on the action
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-emerald-800 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-red-500">A/R Ageing Report</h2>
        
        <div className="space-y-8">
          <h3 className="text-xl text-white mb-4">Leave Field Blank for All</h3>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <CustomerRangeInputs 
                onFirstCustomerChange={(value) => setFormData(prev => ({ ...prev, firstCustomer: value }))}
                onLastCustomerChange={(value) => setFormData(prev => ({ ...prev, lastCustomer: value }))}
              />
              
              <DateInputs 
                onAgeingCutoffDateChange={(value) => setFormData(prev => ({ ...prev, ageingCutoffDate: value }))}
                onStartDateChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, start: value }
                }))}
                onEndDateChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  dateRange: { ...prev.dateRange, end: value }
                }))}
                dateRangeEnabled={formData.options.dateRange}
              />
            </div>

            <ReportOptions 
              onChange={(options) => setFormData(prev => ({ 
                ...prev, 
                options: { ...prev.options, ...options }
              }))}
            />
          </div>

          <ActionButtons onAction={handleSubmit} />
        </div>
      </div>
    </div>
  );
}