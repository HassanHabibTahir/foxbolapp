import React, { useState } from 'react';
import ItemRangeInputs from './ItemRangeInputs';
import ActionButtons from './ActionButtons';

interface ItemReportFormData {
  itemStart: string;
  itemEnd: string;
}

export default function ItemReport() {
  const [formData, setFormData] = useState<ItemReportFormData>({
    itemStart: '',
    itemEnd: '',
  });

  const handleSubmit = (action: 'screen' | 'printer' | 'others' | 'cancel') => {
    console.log(`Action: ${action}`, formData);
    // Implement actual functionality based on the action
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-emerald-800 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Item Report</h2>
        
        <div className="space-y-8">
          <h3 className="text-xl text-white mb-4">Leave Field Blank for All</h3>
          
          <ItemRangeInputs 
            onStartChange={(value) => setFormData(prev => ({ ...prev, itemStart: value }))}
            onEndChange={(value) => setFormData(prev => ({ ...prev, itemEnd: value }))}
          />

          <ActionButtons onAction={handleSubmit} />
        </div>
      </div>
    </div>
  );
}