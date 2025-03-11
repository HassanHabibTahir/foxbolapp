import React from 'react';
import { pricingGroups } from './data';

const PricingGroups = () => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Current Prices - Groups A-Z</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border px-4 py-2 text-left">Group</th>
              <th className="border px-4 py-2 text-left">Price</th>
              <th className="border px-4 py-2 text-left">Comm %</th>
              <th className="border px-4 py-2 text-left">Flat $</th>
              <th className="border px-4 py-2 text-left">GL Account</th>
              <th className="border px-4 py-2 text-left">Group Name</th>
              <th className="border px-4 py-2 text-center">P</th>
            </tr>
          </thead>
          <tbody>
            {pricingGroups.map((group, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{group.group}</td>
                <td className="border px-4 py-2">{group.price}</td>
                <td className="border px-4 py-2">{group.comm}</td>
                <td className="border px-4 py-2">{group.flat}</td>
                <td className="border px-4 py-2">{group.glAccount}</td>
                <td className="border px-4 py-2">{group.groupName}</td>
                <td className="border px-4 py-2 text-center">{group.p}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingGroups;