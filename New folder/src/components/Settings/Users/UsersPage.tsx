import React, { useState } from 'react';
import { User, UserGroup } from './types';
import UserFilters from './UserFilters';
import UsersList from './UsersList';

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Darrell Wells',
    username: 'certified6669',
    lastLoginWeb: '12/24/2024 @ 12:03 PM',
    lastLoginIPhone: '12/4/2024 @ 11:31 AM'
  },
  {
    id: '2',
    name: 'Harrison Wells',
    username: 'harry2777',
    lastLoginWeb: '11/17/2022 @ 2:54 PM',
    lastLoginAndroid: '12/30/2024 @ 10:31 PM',
    lastLoginIPhone: '4/9/2023 @ 7:55 PM'
  },
  // Add more users as needed
];

const initialGroups: UserGroup[] = [
  { id: 'managers', name: 'Managers', checked: true },
  { id: 'dispatchers', name: 'Dispatchers', checked: true },
  { id: 'drivers', name: 'Drivers', checked: true },
  { id: 'accountants', name: 'Accountants', checked: true }
];

const UsersPage = () => {
  const [users] = useState<User[]>(initialUsers);
  const [groups, setGroups] = useState<UserGroup[]>(initialGroups);
  const [showInactives, setShowInactives] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  const handleGroupToggle = (groupId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, checked: !group.checked } : group
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold mb-2">Manage Users</h1>
          <p className="text-gray-600">
            To change a user's password or disable an account, simply click on the user in the list below. 
            To add a new user, click the green button.
          </p>
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          Add a New User
        </button>
      </div>

      <UserFilters
        groups={groups}
        showInactives={showInactives}
        showDeleted={showDeleted}
        onGroupToggle={handleGroupToggle}
        onShowInactivesToggle={() => setShowInactives(!showInactives)}
        onShowDeletedToggle={() => setShowDeleted(!showDeleted)}
      />

      <UsersList users={users} />
    </div>
  );
};

export default UsersPage;