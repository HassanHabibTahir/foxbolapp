import React, { useState } from 'react';
import DateRangeInputs from './DateRangeInputs';
import CustomerRangeInputs from './CustomerRangeInputs';
import SortOptions from './SortOptions';
import DrawerTimeInputs from './DrawerTimeInputs';
import ActionButtons from './ActionButtons';

interface PaymentsReceivedFormData {
  beginningDate: string;
  endingDate: string;
  firstCustomer: string;
  lastCustomer: string;
  drawer: string;
  startTime: string;
  endTime: string;
  sortBy: 'date' | 'invoice' | 'customer' | 'dateCashier' | 'drawerTime';
}

export default function PaymentsReceived() {
  const [formData, setFormData] = useState<PaymentsReceivedFormData>({
    beginningDate: '',
    endingDate: '',
    firstCustomer: '',
    lastCustomer: '',
    drawer: '0',
    startTime: '04:31 PM',
    endTime: '04:31 PM',
    sortBy: 'date'
  });

  const handleSubmit = (action: 'screen' | 'printer' | 'others' | 'cancel') => {
    console.log(`Action: ${action}`, formData);
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-emerald-800 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Payment Received Report</h2>
        
        <div className="space-y-8">
          <h3 className="text-xl text-white mb-4">Leave Field Blank for All</h3>
          
          <DateRangeInputs 
            onBeginningDateChange={(date) => setFormData(prev => ({ ...prev, beginningDate: date }))}
            onEndingDateChange={(date) => setFormData(prev => ({ ...prev, endingDate: date }))}
          />
          
          <CustomerRangeInputs 
            onFirstCustomerChange={(value) => setFormData(prev => ({ ...prev, firstCustomer: value }))}
            onLastCustomerChange={(value) => setFormData(prev => ({ ...prev, lastCustomer: value }))}
          />

          <div className="grid grid-cols-2 gap-8">
            <SortOptions 
              value={formData.sortBy}
              onChange={(value) => setFormData(prev => ({ ...prev, sortBy: value }))}
            />
            
            <DrawerTimeInputs 
              drawer={formData.drawer}
              startTime={formData.startTime}
              endTime={formData.endTime}
              onDrawerChange={(value) => setFormData(prev => ({ ...prev, drawer: value }))}
              onStartTimeChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}
              onEndTimeChange={(value) => setFormData(prev => ({ ...prev, endTime: value }))}
            />
          </div>

          <ActionButtons onAction={handleSubmit} />
        </div>
      </div>
    </div>
  );
}