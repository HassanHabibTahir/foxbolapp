import React from 'react';
import { PricingTable } from './PricingTable';
import { useAccountSettings } from '../../hooks/useAccountSettings';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../common/Toast';
import { VEHICLE_TYPES, DEFAULT_RATES } from './constants';
import type { PricingRate } from './types';

export function PricingView() {
  const accountId = '123'; // TODO: Get from context/props
  const { settings: rates, setSettings: setRates, saveSettings, loading, error } = 
    useAccountSettings<PricingRate[]>(
      accountId,
      'pricing_settings',
      DEFAULT_RATES
    );
  const { toast, showToast } = useToast();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error.message}</div>;
  }

  const handleRateClick = (rateId: string, vehicleType: string) => {
    const updatedRates = rates.map(rate => {
      if (rate.id === rateId) {
        return {
          ...rate,
          rates: {
            ...rate.rates,
            [vehicleType]: {
              ...rate.rates[vehicleType],
              isCustom: !rate.rates[vehicleType].isCustom
            }
          }
        };
      }
      return rate;
    });
    setRates(updatedRates);
  };

  const handleSave = async () => {
    try {
      await saveSettings(rates);
      showToast('Pricing settings saved successfully', 'success');
    } catch (error) {
      showToast('Error saving pricing settings', 'error');
    }
  };

  return (
    <div className="p-6">
      <PricingTable
        rates={rates}
        vehicleTypes={VEHICLE_TYPES}
        onRateClick={handleRateClick}
      />

      <div className="mt-6 flex justify-end space-x-4">
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