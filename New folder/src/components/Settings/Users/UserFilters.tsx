import React from 'react';
import { UserGroup } from './types';

interface UserFiltersProps {
  groups: UserGroup[];
  showInactives: boolean;
  showDeleted: boolean;
  onGroupToggle: (groupId: string) => void;
  onShowInactivesToggle: () => void;
  onShowDeletedToggle: () => void;
}

const UserFilters = ({
  groups,
  showInactives,
  showDeleted,
  onGroupToggle,
  onShowInactivesToggle,
  onShowDeletedToggle
}: UserFiltersProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <p className="text-sm text-gray-600 mb-3">
        Narrow down the list of users by checking or unchecking the user groups below.
      </p>
      <div className="flex items-center gap-6">
        {groups.map((group) => (
          <label key={group.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={group.checked}
              onChange={() => onGroupToggle(group.id)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{group.name}</span>
          </label>
        ))}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showInactives}
            onChange={onShowInactivesToggle}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Show Inactives</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={onShowDeletedToggle}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Show Deleted</span>
        </label>
      </div>
    </div>
  );
};

export default UserFilters;