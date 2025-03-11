import React from 'react';

interface AccountBasicInfoProps {
  accountType: string;
  accountName: string;
  onAccountTypeChange: (value: string) => void;
  onAccountNameChange: (value: string) => void;
}

export function AccountBasicInfo({ 
  accountType, 
  accountName, 
  onAccountTypeChange, 
  onAccountNameChange 
}: AccountBasicInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select 
          value={accountType}
          onChange={(e) => onAccountTypeChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Police Department">Police Department</option>
          <option value="Business">Business</option>
          <option value="Individual">Individual</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Account Name</label>
        <input
          type="text"
          value={accountName}
          onChange={(e) => onAccountNameChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}