import React from 'react';

const VehicleLocator = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Vehicle Locator</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-8">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable Vehicle Locator</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Include Price</span>
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label htmlFor="hostname" className="block text-sm font-medium text-gray-700">Hostname</label>
            <input
              type="text"
              id="hostname"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <span className="mt-7 text-gray-500">.towbook.net</span>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            id="notes"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleLocator;