import React from 'react';
import { StatementSettings } from './types';

interface OtherOptionsProps {
  settings: StatementSettings['otherOptions'];
  onChange: (key: keyof StatementSettings['otherOptions'], value: string) => void;
}

const OtherOptions = ({ settings, onChange }: OtherOptionsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Other Statement Options</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Default Due Date
        </label>
        <select
          value={settings.defaultDueDate}
          onChange={(e) => onChange('defaultDueDate', e.target.value)}
          className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="net30">Net 30</option>
          <option value="net45">Net 45</option>
          <option value="net60">Net 60</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Disclaimer
        </label>
        <textarea
          value={settings.disclaimer}
          onChange={(e) => onChange('disclaimer', e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter statement disclaimer text..."
        />
      </div>
    </div>
  );
};

export default OtherOptions;