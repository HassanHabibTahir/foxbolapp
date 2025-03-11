import React from 'react';
import { AddressEntry } from './types';

interface AddressBookListProps {
  entries: AddressEntry[];
}

const AddressBookList = ({ entries }: AddressBookListProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                No addresses found. Click "Add your First Address" to get started.
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 text-sm text-gray-900">{entry.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{entry.address}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{entry.phone || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{entry.email || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AddressBookList;