import React from 'react';
import { ExternalAccessSettings } from './types';

interface ExternalAccessProps {
  settings: ExternalAccessSettings;
  onToggle: (enabled: boolean) => void;
}

export function ExternalAccess({ settings, onToggle }: ExternalAccessProps) {
  return (
    <div className="mb-6">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label className="font-medium text-gray-700">
            Enable external link for this account
          </label>
          <p className="text-gray-500">
            Let people from this account outside your company access the account online to submit job requests, see job history, and more!
          </p>
        </div>
      </div>
    </div>
  );
}