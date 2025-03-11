import React from 'react';
import { DefaultSettings } from '../types';
import {
  STORAGE_OPTIONS,
  ASSET_BODY_TYPES,
  BILL_TO_ACCOUNT_OPTIONS
} from '../constants';

interface DefaultSettingsSectionProps {
  settings: DefaultSettings;
  onChange: (settings: DefaultSettings) => void;
}

export function DefaultSettingsSection({ settings, onChange }: DefaultSettingsSectionProps) {
  const handleChange = (field: keyof DefaultSettings, value: string) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="defaultPO" className="block text-sm font-medium text-blue-600">Default PO #</label>
        <input
          id="defaultPO"
          type="text"
          value={settings.defaultPO}
          onChange={(e) => handleChange('defaultPO', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter default PO number"
        />
      </div>

      <div>
        <label htmlFor="defaultStorage" className="block text-sm font-medium text-blue-600">Default Storage</label>
        <select
          id="defaultStorage"
          value={settings.defaultStorage}
          onChange={(e) => handleChange('defaultStorage', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {STORAGE_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="defaultAssetBodyType" className="block text-sm font-medium text-blue-600">Default Asset Body Type</label>
        <select
          id="defaultAssetBodyType"
          value={settings.defaultAssetBodyType}
          onChange={(e) => handleChange('defaultAssetBodyType', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {ASSET_BODY_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="defaultBillToAccount" className="block text-sm font-medium text-blue-600">Default Bill To Account</label>
        <select
          id="defaultBillToAccount"
          value={settings.defaultBillToAccount}
          onChange={(e) => handleChange('defaultBillToAccount', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {BILL_TO_ACCOUNT_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
}