import React from 'react';

interface PaymentsConfigProps {
  location: string;
  onLocationChange: (location: string) => void;
}

const PaymentsConfig = ({ location, onLocationChange }: PaymentsConfigProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4">Payments Configuration</h2>
      <p className="text-sm text-gray-600 mb-4">
        Select a Square Location to be used for payments processing through Payment web links, Android and iOS devices.
      </p>
      <div className="w-64">
        <select
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="off-site">Off-site sales</option>
          <option value="store">Store</option>
        </select>
      </div>
    </div>
  );
};

export default PaymentsConfig;