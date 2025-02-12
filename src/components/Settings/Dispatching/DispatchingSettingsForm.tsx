import React from 'react';
import { DispatchingSettings } from './types';

interface DispatchingSettingsFormProps {
  settings: DispatchingSettings;
  onSettingChange: (key: keyof DispatchingSettings) => void;
}

const DispatchingSettingsForm = ({ settings, onSettingChange }: DispatchingSettingsFormProps) => {
  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-lg font-medium text-gray-900">Use the following dispatching fields</h2>
      <div className="space-y-3">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={settings.destinationArrival}
            onChange={() => onSettingChange('destinationArrival')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Destination Arrival (time arrived at destination)</span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={settings.keepCompletedCalls}
            onChange={() => onSettingChange('keepCompletedCalls')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Keep Completed Calls in current list until Acknowledged</span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={settings.disableCompletionSound}
            onChange={() => onSettingChange('disableCompletionSound')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Disable Call Completion Sound in Dispatching</span>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={settings.autoDispatchRecall}
            onChange={() => onSettingChange('autoDispatchRecall')}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Auto-dispatch Recalls to their previous driver</span>
        </label>
      </div>
    </div>
  );
};

export default DispatchingSettingsForm;