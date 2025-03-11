import React from 'react';
import { StatementSettings } from './types';

interface ShowHideDetailsProps {
  settings: StatementSettings['showHideDetails'];
  onChange: (key: keyof StatementSettings['showHideDetails'], value: boolean) => void;
}

const ShowHideDetails = ({ settings, onChange }: ShowHideDetailsProps) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Show/Hide Details from Statement</h2>
      
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.showInvoiceItems}
          onChange={(e) => onChange('showInvoiceItems', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Show Invoice Items</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.showReason}
          onChange={(e) => onChange('showReason', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Show Reason</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.showToFromAddress}
          onChange={(e) => onChange('showToFromAddress', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Show To From address</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.showDriver}
          onChange={(e) => onChange('showDriver', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Show Driver</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.showOdometer}
          onChange={(e) => onChange('showOdometer', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Show Odometer</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.showVIN}
          onChange={(e) => onChange('showVIN', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Show VIN</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.showInvoiceNumber}
          onChange={(e) => onChange('showInvoiceNumber', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Show Invoice Number</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.formatVinAsLastEight}
          onChange={(e) => onChange('formatVinAsLastEight', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Format Vin as Last Eight</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.includePaymentsAfterStatementDate}
          onChange={(e) => onChange('includePaymentsAfterStatementDate', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Include Payments made after the statement date</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.showCallNumber}
          onChange={(e) => onChange('showCallNumber', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Show Call Number</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.includeLinksToSeeInvoice}
          onChange={(e) => onChange('includeLinksToSeeInvoice', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Include links to see invoice</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.showAccountContact}
          onChange={(e) => onChange('showAccountContact', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Show Account Contact</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.useCompletionDate}
          onChange={(e) => onChange('useCompletionDate', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Use Completion Date (create date will be used by default)</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.showPlateNumber}
          onChange={(e) => onChange('showPlateNumber', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Show Plate Number</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.showUnitNumber}
          onChange={(e) => onChange('showUnitNumber', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Show Unit Number</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.showTruck}
          onChange={(e) => onChange('showTruck', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Show Truck</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={settings.showBillingNotes}
          onChange={(e) => onChange('showBillingNotes', e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-600">Show Billing Notes</span>
      </label>
    </div>
  );
};

export default ShowHideDetails;