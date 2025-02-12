import React from 'react';
import { MILEAGE_CALCULATION_METHODS, FILL_IN_METHODS } from './types';

interface MileageOptionsProps {
  options: {
    setUnloadedMileage: boolean;
    roundUpMileage: boolean;
    includeDeadhead: boolean;
    calculationMethod: string;
    fillInMethod: string;
  };
  onChange: (options: any) => void;
}

export function MileageOptions({ options, onChange }: MileageOptionsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Mileage</h3>
      
      <div className="space-y-2">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="setUnloadedMileage"
            checked={options.setUnloadedMileage}
            onChange={(e) => handleChange('setUnloadedMileage', e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="setUnloadedMileage" className="ml-2 text-sm text-gray-700">
            When submitting invoices, set unloaded mileage to 1 if its missing or the total is 0
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="roundUpMileage"
            checked={options.roundUpMileage}
            onChange={(e) => handleChange('roundUpMileage', e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="roundUpMileage" className="ml-2 text-sm text-gray-700">
            When calculating mileage, round up to the next full mile
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="includeDeadhead"
            checked={options.includeDeadhead}
            onChange={(e) => handleChange('includeDeadhead', e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="includeDeadhead" className="ml-2 text-sm text-gray-700">
            Include Deadhead Mileage on calls for this account
          </label>
        </div>

        <div>
          <label className="block text-sm text-blue-600">Options for calculating mileage for your calls</label>
          <select
            value={options.calculationMethod}
            onChange={(e) => handleChange('calculationMethod', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {MILEAGE_CALCULATION_METHODS.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-blue-600">Automatically fill in invoice mileage quantities</label>
          <select
            value={options.fillInMethod}
            onChange={(e) => handleChange('fillInMethod', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {FILL_IN_METHODS.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}