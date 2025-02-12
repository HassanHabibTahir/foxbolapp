import React, { useState } from 'react';
import DateRangeInput from './DateRangeInput';
import DriverRangeInputs from './DriverRangeInputs';
import ReportOptions from './ReportOptions';
import ActionButtons from './ActionButtons';

interface DriverCommissionFormData {
  dateRange: {
    start: string;
    end: string;
  };
  firstDriver: string;
  lastDriver: string;
  callType: 'all' | 'commission';
  summaryOnly: boolean;
  includeAAA: boolean;
}

export default function DriverCommission() {
  const [formData, setFormData] = useState<DriverCommissionFormData>({
    dateRange: {
      start: '',
      end: '',
    },
    firstDriver: '',
    lastDriver: '',
    callType: 'all',
    summaryOnly: false,
    includeAAA: false,
  });

  const handleSubmit = (action: 'screen' | 'printer' | 'others' | 'cancel') => {
    console.log(`Action: ${action}`, formData);
    // Implement actual functionality based on the action
  };

  return (
    <div className=" bg-gray-100 flex  justify-center p-4">
      <div className="w-full max-w-3xl bg-emerald-800 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Driver Commission Report</h2>
        
        <div className="space-y-8">
          <h3 className="text-xl text-white mb-4">Leave Field Blank for All</h3>
          
          <DateRangeInput 
            onStartDateChange={(date) => setFormData(prev => ({ 
              ...prev, 
              dateRange: { ...prev.dateRange, start: date }
            }))}
            onEndDateChange={(date) => setFormData(prev => ({ 
              ...prev, 
              dateRange: { ...prev.dateRange, end: date }
            }))}
          />
          
          <DriverRangeInputs 
            onFirstDriverChange={(value) => setFormData(prev => ({ ...prev, firstDriver: value }))}
            onLastDriverChange={(value) => setFormData(prev => ({ ...prev, lastDriver: value }))}
          />
          
          <ReportOptions 
            onCallTypeChange={(type) => setFormData(prev => ({ ...prev, callType: type }))}
            onSummaryChange={(checked) => setFormData(prev => ({ ...prev, summaryOnly: checked }))}
            onIncludeAAAChange={(checked) => setFormData(prev => ({ ...prev, includeAAA: checked }))}
          />

          <ActionButtons onAction={handleSubmit} />
        </div>
      </div>
    </div>
  );
}