import React from 'react';
import { STORAGE_OPTIONS, ASSET_BODY_TYPES } from './types';

interface DefaultSettingsProps {
  defaultPO: string;
  defaultStorage: string;
  defaultAssetBodyType: string;
  defaultBillToAccount: string;
  onDefaultPOChange: (value: string) => void;
  onDefaultStorageChange: (value: string) => void;
  onDefaultAssetBodyTypeChange: (value: string) => void;
  onDefaultBillToAccountChange: (value: string) => void;
}

export function DefaultSettings({
  defaultPO,
  defaultStorage,
  defaultAssetBodyType,
  defaultBillToAccount,
  onDefaultPOChange,
  onDefaultStorageChange,
  onDefaultAssetBodyTypeChange,
  onDefaultBillToAccountChange
}: DefaultSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Default PO #</label>
        <input
          type="text"
          value={defaultPO}
          onChange={(e) => onDefaultPOChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Default Storage</label>
        <select
          value={defaultStorage}
          onChange={(e) => onDefaultStorageChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {STORAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Default Asset Body Type</label>
        <select
          value={defaultAssetBodyType}
          onChange={(e) => onDefaultAssetBodyTypeChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {ASSET_BODY_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Default Bill To Account</label>
        <select
          value={defaultBillToAccount}
          onChange={(e) => onDefaultBillToAccountChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="none">None</option>
        </select>
      </div>
    </div>
  );
}