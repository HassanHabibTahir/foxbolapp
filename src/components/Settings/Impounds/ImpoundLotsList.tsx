import React from 'react';
import { ImpoundLot } from './types';

interface ImpoundLotsListProps {
  lots: ImpoundLot[];
}

const ImpoundLotsList = ({ lots }: ImpoundLotsListProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lots.map((lot) => (
            <tr key={lot.id} className="hover:bg-gray-50 cursor-pointer">
              <td className="px-6 py-4 text-sm text-gray-900">{lot.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{lot.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImpoundLotsList;