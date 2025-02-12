import React from 'react';

interface DriversFiltersProps {
  showInactive: boolean;
  showDeleted: boolean;
  onShowInactiveToggle: () => void;
  onShowDeletedToggle: () => void;
}

const DriversFilters = ({
  showInactive,
  showDeleted,
  onShowInactiveToggle,
  onShowDeletedToggle
}: DriversFiltersProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
        Add a New Driver
      </button>
      
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={showInactive}
          onChange={onShowInactiveToggle}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">Show Inactive Drivers</span>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={showDeleted}
          onChange={onShowDeletedToggle}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">Show Deleted Drivers</span>
      </label>
    </div>
  );
};

export default DriversFilters;