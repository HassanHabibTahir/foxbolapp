import React from 'react';
import { MileageOptions } from '../types';
import { Checkbox } from '../ui/Checkbox';
import { MILEAGE_CALCULATION_METHODS, FILL_IN_METHODS } from '../constants';

interface MileageSectionProps {
  options: MileageOptions;
  onChange: (options: MileageOptions) => void;
}

export function MileageSection({ options, onChange }: MileageSectionProps) {
  const handleChange = (key: keyof MileageOptions, value: boolean | string) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Mileage</h3>
      
      <div className="space-y-3">
        <Checkbox
          id="setUnloadedMileage"
          checked={options.setUnloadedMileage}
          onChange={(checked) => handleChange('setUnloadedMileage', checked)}
          label="When submitting invoices, set unloaded mileage to 1 if its missing or the total is 0"
        />

        <Checkbox
          id="roundUpMileage"
          checked={options.roundUpMileage}
          onChange={(checked) => handleChange('roundUpMileage', checked)}
          label="When calculating mileage, round up to the next full mile"
        />

        <Checkbox
          id="includeDeadhead"
          checked={options.includeDeadhead}
          onChange={(checked) => handleChange('includeDeadhead', checked)}
          label="Include Deadhead Mileage on calls for this account"
        />

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