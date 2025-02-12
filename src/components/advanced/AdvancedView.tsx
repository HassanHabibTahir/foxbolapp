import React from 'react';
import { DefaultSettingsSection } from './sections/DefaultSettingsSection';
import { AdvancedOptionsSection } from './sections/AdvancedOptionsSection';
import { MileageSection } from './sections/MileageSection';
import { useAccountSettings } from '../../hooks/useAccountSettings';
import type { AdvancedSettings } from './types';

const DEFAULT_SETTINGS: AdvancedSettings = {
  defaults: {
    defaultPO: '',
    defaultStorage: 'Impounds/Storage: Daily Impound Rate',
    defaultAssetBodyType: 'Light',
    defaultBillToAccount: 'None'
  },
  advancedOptions: {
    setHighPriority: true,
    alertManagers: false,
    hideCharges: false,
    hideDiscounts: false,
    includeInvoiceCopies: false,
    hidePhotos: false,
    allowViewFiles: false
  },
  mileageOptions: {
    setUnloadedMileage: false,
    roundUpMileage: false,
    includeDeadhead: false,
    calculationMethod: 'Optimal (Google Suggested Route)',
    fillInMethod: 'Use Company Default - Currently set to add automatically'
  }
};

export function AdvancedView() {
  const accountId = '123'; // TODO: Get from context/props
  const { 
    settings, 
    setSettings, 
    saveSettings, 
    loading, 
    error 
  } = useAccountSettings<AdvancedSettings>(
    accountId,
    'advanced_settings',
    DEFAULT_SETTINGS
  );

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error.message}</div>;
  }

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      // Show success message
    } catch (error) {
      // Show error message
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <DefaultSettingsSection
        settings={settings.defaults}
        onChange={(defaults) => setSettings({ ...settings, defaults })}
      />

      <AdvancedOptionsSection
        options={settings.advancedOptions}
        onChange={(advancedOptions) => setSettings({ ...settings, advancedOptions })}
      />

      <MileageSection
        options={settings.mileageOptions}
        onChange={(mileageOptions) => setSettings({ ...settings, mileageOptions })}
      />

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}