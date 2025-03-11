import React from 'react';

interface DeliveryPreferencesProps {
  preferences: {
    print: boolean;
    email: boolean;
  };
  onChange: (preferences: { print: boolean; email: boolean }) => void;
}

export function DeliveryPreferences({ preferences, onChange }: DeliveryPreferencesProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-900">Delivery Preference</h3>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="print"
            checked={preferences.print}
            onChange={(e) => onChange({ ...preferences, print: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="print" className="ml-2 text-sm text-gray-700">Print</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="email"
            checked={preferences.email}
            onChange={(e) => onChange({ ...preferences, email: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="email" className="ml-2 text-sm text-gray-700">Email</label>
        </div>
      </div>
    </div>
  );
}