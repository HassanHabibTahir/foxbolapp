import React from 'react';
import { GPSProvider } from './types';
import FormField from '../common/FormField';
import FormSelect from '../common/FormSelect';

const GPSForm = () => {
  const providers: GPSProvider[] = [
    { id: 'provider1', name: 'GPS Provider 1' },
    { id: 'provider2', name: 'GPS Provider 2' },
    { id: 'provider3', name: 'GPS Provider 3' },
  ];

  return (
    <form className="space-y-6">
      <FormSelect
        label="GPS Provider"
        options={providers}
        value=""
        onChange={(value) => console.log(value)}
      />
      
      <FormField
        label="Account Name"
        type="text"
        placeholder="Enter account name"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="User Name"
          type="text"
          placeholder="Enter username"
        />
        
        <FormField
          label="Password"
          type="password"
          placeholder="Enter password"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save changes
        </button>
      </div>
    </form>
  );
};

export default GPSForm;