import React from 'react';
import { X } from 'lucide-react';
import type { PrintSettings as Settings } from '../../../types/print';

interface PrintSettingsProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

const PrintSettings: React.FC<PrintSettingsProps> = ({ settings, onSave, onClose }) => {
  const [localSettings, setLocalSettings] = React.useState(settings);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Print Settings</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="font-medium">Company Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                value={localSettings.companyName}
                onChange={(e) => setLocalSettings(s => ({ ...s, companyName: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={localSettings.companyAddress}
                onChange={(e) => setLocalSettings(s => ({ ...s, companyAddress: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={localSettings.companyPhone}
                onChange={(e) => setLocalSettings(s => ({ ...s, companyPhone: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          {/* Display Options */}
          <div className="space-y-4">
            <h3 className="font-medium">Display Options</h3>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showHeader"
                checked={localSettings.showHeader}
                onChange={(e) => setLocalSettings(s => ({ ...s, showHeader: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="showHeader" className="ml-2">Show Header</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showFooter"
                checked={localSettings.showFooter}
                onChange={(e) => setLocalSettings(s => ({ ...s, showFooter: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="showFooter" className="ml-2">Show Footer</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Footer Text</label>
              <textarea
                value={localSettings.footerText}
                onChange={(e) => setLocalSettings(s => ({ ...s, footerText: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(localSettings)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintSettings;