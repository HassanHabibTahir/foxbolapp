import React, { useState } from 'react';
import DateRangeInputs from './DateRangeInputs';
import IdentificationInputs from './IdentificationInputs';
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

export default function CallLog() {
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
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-emerald-800 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Call Log Report</h2>
        
        <div className="space-y-6">
          <h3 className="text-xl text-white mb-4">Leave Field Blank for All</h3>
          
          <DateRangeInputs 
            onBeginningDateChange={(date) => setFormData(prev => ({ ...prev, beginningDate: date }))}
            onEndingDateChange={(date) => setFormData(prev => ({ ...prev, endingDate: date }))}
          />
          
          <IdentificationInputs 
            onCallingAccountChange={(value) => setFormData(prev => ({ ...prev, callingAccount: value }))}
            onDriverIdChange={(value) => setFormData(prev => ({ ...prev, driverId: value }))}
            onTruckIdChange={(value) => setFormData(prev => ({ ...prev, truckId: value }))}
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