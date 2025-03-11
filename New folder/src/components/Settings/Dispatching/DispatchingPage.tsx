import React, { useState } from 'react';
import { CustomField, DispatchingSettings } from './types';
import CustomFieldsList from './CustomFieldsList';
import DispatchingSettingsForm from './DispatchingSettingsForm';

const initialFields: CustomField[] = [
  { id: '1', name: 'Lien Start', type: 'DateTime' },
  { id: '2', name: 'Lien Clear', type: 'DateTime' },
  { id: '3', name: 'Lien Fee', type: 'Number' },
  { id: '4', name: 'Impound Reason', type: 'Text' },
  { id: '5', name: 'Lien Type', type: 'Text' },
  { id: '6', name: 'Forsale?', type: 'Text' },
  { id: '7', name: 'Bid number', type: 'Text' },
  { id: '8', name: 'Complete?', type: 'Yes/No' },
  { id: '9', name: 'Cat?', type: 'Yes/No' },
  { id: '10', name: 'Sale Price?', type: 'Number' },
  { id: '11', name: 'Car Sold Date?', type: 'DateTime' },
  { id: '12', name: 'PINK-Comm?', type: 'Yes/No' },
  { id: '13', name: 'Problem', type: 'Selection' },
  { id: '14', name: 'Repairs Needed', type: 'Text' }
];

const initialSettings: DispatchingSettings = {
  destinationArrival: false,
  keepCompletedCalls: false,
  disableCompletionSound: false,
  autoDispatchRecall: false
};

const DispatchingPage = () => {
  const [fields] = useState<CustomField[]>(initialFields);
  const [showDeleted, setShowDeleted] = useState(false);
  const [settings, setSettings] = useState<DispatchingSettings>(initialSettings);

  const handleSettingChange = (key: keyof DispatchingSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-2">Dispatching</h1>
        <p className="text-gray-600">
          If you find yourself needing to store information that we don't have fields for, you can add custom fields to store it in the call editor and implement throughout your company.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          Add a new Field
        </button>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={() => setShowDeleted(!showDeleted)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Show Deleted Fields</span>
        </label>
      </div>

      <CustomFieldsList fields={fields} />
      <DispatchingSettingsForm settings={settings} onSettingChange={handleSettingChange} />
    </div>
  );
};

export default DispatchingPage;