import React, { useState } from 'react';
import CustomerInput from './CustomerInput';
import DateInput from '../shared/DateInput';
import CheckboxInput from './CheckboxInput';
import ARActionButtons from './ARActionButtons';

interface ARReportFormData {
  firstCustomer: string;
  lastCustomer: string;
  ageingCutoffDate: string;
  dateRange: {
    start: string;
    end: string;
  };
  summary: boolean;
  dateRangeEnabled: boolean;
  sortByInv: boolean;
}

export default function ARReport() {
  const [formData, setFormData] = useState<ARReportFormData>({
    firstCustomer: '',
    lastCustomer: '',
    ageingCutoffDate: '',
    dateRange: {
      start: '',
      end: '',
    },
    summary: false,
    dateRangeEnabled: false,
    sortByInv: false,
  });

  const handleSubmit = (action: 'screen' | 'printer' | 'others' | 'cancel') => {
    console.log(`Action: ${action}`, formData);
    // Implement actual functionality based on the action
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-emerald-800 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-red-500">A/R Ageing Report</h2>
        
        <div className="space-y-6">
          <h3 className="text-xl text-white mb-4">Leave Field Blank for All</h3>
          
          <div className="grid grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-6">
              <CustomerInput 
                label="First Customer #"
                value={formData.firstCustomer}
                onChange={(value) => setFormData(prev => ({ ...prev, firstCustomer: value }))}
              />
              
              <CustomerInput 
                label="Last Customer #"
                value={formData.lastCustomer}
                onChange={(value) => setFormData(prev => ({ ...prev, lastCustomer: value }))}
              />
              
              <DateInput 
                label="Ageing Cutoff Date"
                onChange={(date) => setFormData(prev => ({ ...prev, ageingCutoffDate: date }))}
              />
            </div>

            <div className="space-y-4 pt-2">
              <CheckboxInput 
                label="Summary"
                checked={formData.summary}
                onChange={(checked) => setFormData(prev => ({ ...prev, summary: checked }))}
              />
              
              <CheckboxInput 
                label="Date Range"
                checked={formData.dateRangeEnabled}
                onChange={(checked) => setFormData(prev => ({ ...prev, dateRangeEnabled: checked }))}
              />
              
              <CheckboxInput 
                label="Sort By Inv#"
                checked={formData.sortByInv}
                onChange={(checked) => setFormData(prev => ({ ...prev, sortByInv: checked }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DateInput 
              label=""
              onChange={(date) => setFormData(prev => ({ 
                ...prev, 
                dateRange: { ...prev.dateRange, start: date }
              }))}
            />
            <DateInput 
              label=""
              onChange={(date) => setFormData(prev => ({ 
                ...prev, 
                dateRange: { ...prev.dateRange, end: date }
              }))}
            />
          </div>

          <ARActionButtons onAction={handleSubmit} />
        </div>
      </div>
    </div>
  );
}