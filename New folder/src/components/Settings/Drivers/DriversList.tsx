import React from 'react';
import { Driver } from './types';
import { UserCircle } from 'lucide-react';

interface DriversListProps {
  drivers: Driver[];
}

const DriversList = ({ drivers }: DriversListProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/4">Driver</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Created</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {drivers.map((driver) => (
            <tr key={driver.id} className="hover:bg-gray-50 cursor-pointer">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <UserCircle className="h-8 w-8 text-gray-400" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{driver.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriversList;