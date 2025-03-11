import React from 'react';
import { DestinationPreference } from './DestinationPreference';
import { StorageFacilitySelect } from './StorageFacilitySelect';
import { useAccountSettings } from '../../hooks/useAccountSettings';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../common/Toast';
import type { ImpoundSettings } from './types';

const STORAGE_FACILITIES: any[] = [
  {
    id: '1',
    name: 'Certified Towing Lot 1 (2777 Giant Rd.)',
    address: '2777 Giant Rd'
  }
];

const DEFAULT_SETTINGS: ImpoundSettings = {
  destinationType: 'always',
  defaultFacilityId: STORAGE_FACILITIES[0].id
};

export function ImpoundsView() {
  const accountId = '123'; // TODO: Get from context/props
  const { settings, setSettings, saveSettings, loading, error } = 
    useAccountSettings<ImpoundSettings>(
      accountId,
      'impound_settings',
      DEFAULT_SETTINGS
    );
  const { toast, showToast } = useToast();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error.message}</div>;
  }

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      showToast('Impound settings saved successfully', 'success');
    } catch (error) {
      showToast('Error saving impound settings', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <DestinationPreference
        value={settings.destinationType}
        onChange={(value) => setSettings({ ...settings, destinationType: value })}
      />

      <StorageFacilitySelect
        facilities={STORAGE_FACILITIES}
        selectedFacilityId={settings.defaultFacilityId}
        onChange={(facilityId) => setSettings({ ...settings, defaultFacilityId: facilityId })}
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

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}