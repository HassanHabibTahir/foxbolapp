import React from 'react';
import ServiceItems from './ServiceItems';
import PricingGroups from './PricingGroups';

const PricingPage = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-semibold mb-2">Price Information</h1>
      <p className="text-gray-600 mb-6">
        To modify an existing rate, click on the service in the list below. To add a new service, simply click the green Add a new Service Rate button.
      </p>
      
      <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mb-8">
        Add a new Service Rate
      </button>

      <div className="grid grid-cols-3 gap-8">
        <div>
          <ServiceItems />
        </div>
        <div className="col-span-2">
          <PricingGroups />
        </div>
      </div>
    </div>
  );
};

export default PricingPage;