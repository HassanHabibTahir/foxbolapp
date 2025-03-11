import React, { useState } from 'react';
import DateInput from './DateInput';
import TextInput from './TextInput';
import DetailOptions from './DetailOptions';
import ActionButtons from './ActionButtons';

interface CallLogFormData {
  beginningDate: string;
  endingDate: string;
  callingAccount: string;
  driverId: string;
  truckId: string;
  detailType: 'detail1' | 'detail2' | 'storedOnly' | null;
}

export default function CallLogReport() {
  const [formData, setFormData] = useState<CallLogFormData>({
    beginningDate: '',
    endingDate: '',
    callingAccount: '',
    driverId: '',
    truckId: '',
    detailType: null,
  });

  const handleSubmit = (action: 'download' | 'send' | 'print' | 'cancel') => {
    console.log(`Action: ${action}`, formData);
    // Implement actual functionality based on the action
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-emerald-800 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Call Log Report</h2>
        
        <div className="space-y-6">
          <h3 className="text-xl text-white mb-4">Leave Field Blank for All</h3>
          
          <DateInput label="Beginning Date" />
          <DateInput label="Ending Date" />
          
          <TextInput 
            label="Calling Account #"
            value={formData.callingAccount}
            onChange={(value) => setFormData(prev => ({ ...prev, callingAccount: value }))}
          />
          <TextInput 
            label="Driver #"
            value={formData.driverId}
            onChange={(value) => setFormData(prev => ({ ...prev, driverId: value }))}
          />
          <TextInput 
            label="Truck #"
            value={formData.truckId}
            onChange={(value) => setFormData(prev => ({ ...prev, truckId: value }))}
          />

          <DetailOptions 
            value={formData.detailType}
            onChange={(value) => setFormData(prev => ({ ...prev, detailType: value }))}
          />

          <ActionButtons onAction={handleSubmit} />
        </div>
      </div>
    </div>
  );
}