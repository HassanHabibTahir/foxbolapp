import React from 'react';
import { User } from './types';
import { UserCircle } from 'lucide-react';

interface UsersListProps {
  users: User[];
}

const UsersList = ({ users }: UsersListProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login (Web)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login (Android)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login (iPhone)</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 cursor-pointer">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <UserCircle className="h-8 w-8 text-gray-400" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.username}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{user.lastLoginWeb || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{user.lastLoginAndroid || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{user.lastLoginIPhone || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;