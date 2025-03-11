import React from 'react';
import type { StorageFacility } from './types';

interface StorageFacilitySelectProps {
  facilities: StorageFacility[];
  selectedFacilityId: string;
  onChange: (facilityId: string) => void;
}

export function StorageFacilitySelect({
  facilities,
  selectedFacilityId,
  onChange
}: StorageFacilitySelectProps) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Default storage facility for this account
      </label>
      <select
        value={selectedFacilityId}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {facilities.map((facility) => (
          <option key={facility.id} value={facility.id}>
            {facility.name}
          </option>
        ))}
      </select>
    </div>
  );
}