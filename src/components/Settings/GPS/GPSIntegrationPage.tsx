import React from 'react';
import GPSForm from './GPSForm';

const GPSIntegrationPage = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-semibold mb-2">GPS Integration</h1>
      <p className="text-gray-600 mb-6">Setup & configure the GPS Provider.</p>
      
      <div className="grid grid-cols-2 gap-8">
        <GPSForm />
        <div className="flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1581091870598-36ce9bad5c77?auto=format&fit=crop&q=80&w=500"
            alt="GPS Integration"
            className="rounded-lg shadow-lg w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default GPSIntegrationPage;