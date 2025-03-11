import React from 'react';
import { serviceItems } from './data';

const ServiceItems = () => {
  return (
    <div className="border rounded-lg">
      <div className="bg-blue-900 text-white p-3 rounded-t-lg">
        <h2 className="font-medium">Items</h2>
      </div>
      <div className="divide-y">
        {serviceItems.map((item, index) => (
          <button
            key={index}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceItems;