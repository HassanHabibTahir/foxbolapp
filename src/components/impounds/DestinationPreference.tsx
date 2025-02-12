import React from 'react';
import type { DestinationType } from './types';

interface DestinationPreferenceProps {
  value: DestinationType;
  onChange: (value: DestinationType) => void;
}

export function DestinationPreference({
  value,
  onChange
}: DestinationPreferenceProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Choose your destination preference for this account.
      </h3>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="radio"
            id="none"
            name="destination"
            value="none"
            checked={value === 'none'}
            onChange={(e) => onChange(e.target.value as DestinationType)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label htmlFor="none" className="ml-2 text-sm text-gray-700">
            None. Let me specify an address (Tow).
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="radio"
            id="always"
            name="destination"
            value="always"
            checked={value === 'always'}
            onChange={(e) => onChange(e.target.value as DestinationType)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label htmlFor="always" className="ml-2 text-sm text-gray-700">
            Always impound vehicles for this account.
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="radio"
            id="third-party"
            name="destination"
            value="third-party"
            checked={value === 'third-party'}
            onChange={(e) => onChange(e.target.value as DestinationType)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label htmlFor="third-party" className="ml-2 text-sm text-gray-700">
            This account's vehicles should be impounded at a third-party storage facility.
          </label>
        </div>
      </div>
    </div>
  );
}