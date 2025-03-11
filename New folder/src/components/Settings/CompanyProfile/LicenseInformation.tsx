import React from 'react';

const LicenseInformation = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">License Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="ca" className="block text-sm font-medium text-gray-700">CA#</label>
          <input
            type="text"
            id="ca"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="usdot" className="block text-sm font-medium text-gray-700">USDOT</label>
          <input
            type="text"
            id="usdot"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default LicenseInformation;