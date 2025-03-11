import React, { useState } from 'react';
import LotSectionInput from './LotSectionInput';
import VehicleOptions, { VehicleOptionsType } from './VehicleOptions';
import ReportOptions, { ReportOptionsType } from './ReportOptions';
import SortOptions from './SortOptions';
import OutputOptions from './OutputOptions';
import ActionButtons from './ActionButtons';

interface LotInventoryFormData {
  lotSection: string;
  firstDate: string;
  lastDate: string;
  vehicleOptions: VehicleOptionsType;
  reportOptions: ReportOptionsType;
  sortBy: 'dispatch' | 'makeDispatch' | 'dateDispatch' | 'lotDispatch';
  outputType: 'original' | 'picturesSmall' | 'picturesMedium' | 'unused';
}

export default function LotInventory() {
  const [formData, setFormData] = useState<LotInventoryFormData>({
    lotSection: '',
    firstDate: '',
    lastDate: '',
    vehicleOptions: {
      storedVehicles: false,
      impoundedVehicles: false,
      holdVehicles: false,
      privateImpounds: false,
      thirtyDayImpound: false,
      recovered: false,
      abandoned: false,
      wrecked: false,
      towed: false,
    },
    reportOptions: {
      century: false,
      clearedOnly: false,
      evenIfReleased: false,
      extraNotesLine: false,
      showHoldnote: false,
      showTowtag: false,
      showOdometer: false,
    },
    sortBy: 'dispatch',
    outputType: 'original',
  });

  const handleSubmit = (action: 'screen' | 'printer' | 'others' | 'drilldown' | 'cancel') => {
    console.log(`Action: ${action}`, formData);
    // Implement actual functionality based on the action
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-emerald-800 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-red-500">Lot Inventory Report</h2>
        
        <div className="space-y-8">
          <h3 className="text-xl text-white mb-4">Leave Field Blank for All</h3>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-8">
              <LotSectionInput 
                onLotSectionChange={(value) => setFormData(prev => ({ ...prev, lotSection: value }))}
                onFirstDateChange={(value) => setFormData(prev => ({ ...prev, firstDate: value }))}
                onLastDateChange={(value) => setFormData(prev => ({ ...prev, lastDate: value }))}
              />
              
              <SortOptions 
                value={formData.sortBy}
                onChange={(value) => setFormData(prev => ({ ...prev, sortBy: value }))}
              />
              
              <OutputOptions 
                value={formData.outputType}
                onChange={(value) => setFormData(prev => ({ ...prev, outputType: value }))}
              />
            </div>

            <div className="space-y-8">
              <VehicleOptions 
                onChange={(options) => setFormData(prev => ({ 
                  ...prev, 
                  vehicleOptions: { ...prev.vehicleOptions, ...options }
                }))}
              />
              
              <ReportOptions 
                onChange={(options) => setFormData(prev => ({ 
                  ...prev, 
                  reportOptions: { ...prev.reportOptions, ...options }
                }))}
              />
            </div>
          </div>

          <ActionButtons onAction={handleSubmit} />
        </div>
      </div>
    </div>
  );
}