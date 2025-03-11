import React from 'react';

interface AdvancedOptionsProps {
  options: {
    setHighPriority: boolean;
    alertManagers: boolean;
    hideCharges: boolean;
    hideDiscounts: boolean;
    includeInvoiceCopies: boolean;
    hidePhotos: boolean;
    allowViewFiles: boolean;
  };
  onChange: (options: any) => void;
}

export function AdvancedOptions({ options, onChange }: AdvancedOptionsProps) {
  const handleChange = (key: string, value: boolean) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Advanced Options</h3>
      
      <div className="space-y-2">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="setHighPriority"
            checked={options.setHighPriority}
            onChange={(e) => handleChange('setHighPriority', e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="setHighPriority" className="ml-2 text-sm text-gray-700">
            Set all calls to High Priority
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="alertManagers"
            checked={options.alertManagers}
            onChange={(e) => handleChange('alertManagers', e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="alertManagers" className="ml-2 text-sm text-gray-700">
            Alert (text) all managers when a call is created for this account
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="hideCharges"
            checked={options.hideCharges}
            onChange={(e) => handleChange('hideCharges', e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hideCharges" className="ml-2 text-sm text-gray-700">
            Always hide charges when printing or emailing the receipt
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="hideDiscounts"
            checked={options.hideDiscounts}
            onChange={(e) => handleChange('hideDiscounts', e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hideDiscounts" className="ml-2 text-sm text-gray-700">
            Always hide discounts when printing or emailing the receipt
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="includeInvoiceCopies"
            checked={options.includeInvoiceCopies}
            onChange={(e) => handleChange('includeInvoiceCopies', e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="includeInvoiceCopies" className="ml-2 text-sm text-gray-700">
            Include copies of invoices as a part of statements
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="hidePhotos"
            checked={options.hidePhotos}
            onChange={(e) => handleChange('hidePhotos', e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hidePhotos" className="ml-2 text-sm text-gray-700">
            Always hide photos when printing or emailing the receipt
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="allowViewFiles"
            checked={options.allowViewFiles}
            onChange={(e) => handleChange('allowViewFiles', e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="allowViewFiles" className="ml-2 text-sm text-gray-700">
            Allow users that login to this account to view files attached to calls
          </label>
        </div>
      </div>
    </div>
  );
}