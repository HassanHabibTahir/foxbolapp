import React from 'react';
import { Truck } from './types';

interface TrucksListProps {
  trucks: Truck[];
}

const TrucksList = ({ trucks }: TrucksListProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duty</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Odometer Reading</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {trucks.map((truck) => (
            <tr key={truck.id} className="hover:bg-gray-50 cursor-pointer">
              <td className="px-6 py-4 text-sm text-gray-900">{truck.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{truck.type}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${truck.duty === 'Light' ? 'bg-green-100 text-green-800' : 
                    truck.duty === 'Medium' ? 'bg-blue-100 text-blue-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {truck.duty}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{truck.plate}</div>
                {truck.plateExpired && (
                  <div className="text-xs text-red-600">Expired: {truck.plateExpired}</div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{truck.lastOdometer || '-'}</div>
                {truck.lastUpdated && (
                  <div className="text-xs text-gray-500">Last updated: {truck.lastUpdated}</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrucksList;