import React, { useState } from 'react';
import { StatementSettings } from './types';
import ShowHideDetails from './ShowHideDetails';
import OtherOptions from './OtherOptions';

const StatementsPage = () => {
  const [settings, setSettings] = useState<StatementSettings>({
    showHideDetails: {
      showInvoiceItems: true,
      showReason: true,
      showToFromAddress: true,
      showDriver: true,
      showOdometer: true,
      showVIN: true,
      showInvoiceNumber: true,
      formatVinAsLastEight: true,
      includePaymentsAfterStatementDate: true,
      showCallNumber: false,
      includeLinksToSeeInvoice: false,
      showAccountContact: true,
      useCompletionDate: true,
      showPlateNumber: false,
      showUnitNumber: true,
      showTruck: true,
      showBillingNotes: false
    },
    otherOptions: {
      defaultDueDate: 'net30',
      disclaimer: 'Certified Towing appreciates your business. If you have any questions regarding this statement, please contact us at 510-235-0874.'
    }
  });

  const handleShowHideChange = (key: keyof StatementSettings['showHideDetails'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      showHideDetails: {
        ...prev.showHideDetails,
        [key]: value
      }
    }));
  };

  const handleOtherOptionsChange = (key: keyof StatementSettings['otherOptions'], value: string) => {
    setSettings(prev => ({
      ...prev,
      otherOptions: {
        ...prev.otherOptions,
        [key]: value
      }
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-2">Statement Settings</h1>
        <p className="text-gray-600">Customize what displays on your printed Statements.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <ShowHideDetails 
          settings={settings.showHideDetails}
          onChange={handleShowHideChange}
        />
        <OtherOptions
          settings={settings.otherOptions}
          onChange={handleOtherOptionsChange}
        />
      </div>

      <div className="mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default StatementsPage;