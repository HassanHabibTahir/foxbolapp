import React from 'react';
import { SecurityTableRow } from './SecurityTableRow';
import { useSecurityRights } from './useSecurityRights';

const SecurityTable = () => {
  const rights = useSecurityRights();

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Rights</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Keyname</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Level</th>
              </tr>
            </thead>
            <tbody>
              {rights.map((right, index) => (
                <SecurityTableRow key={index} right={right} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecurityTable;