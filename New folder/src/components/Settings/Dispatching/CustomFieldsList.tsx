import React from 'react';
import { CustomField } from './types';

interface CustomFieldsListProps {
  fields: CustomField[];
}

const CustomFieldsList = ({ fields }: CustomFieldsListProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {fields.map((field) => (
            <tr key={field.id} className="hover:bg-gray-50 cursor-pointer">
              <td className="px-6 py-4 text-sm text-gray-900">{field.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{field.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomFieldsList;