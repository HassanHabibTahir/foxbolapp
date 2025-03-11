import React, { useState } from 'react';
import { Truck } from './types';
import TrucksFilters from './TrucksFilters';
import TrucksList from './TrucksList';

const initialTrucks: Truck[] = [
  {
    id: '1',
    name: '2013 Peterbilt 337',
    type: 'Wrecker',
    duty: 'Medium',
    plate: '23460P1',
    plateExpired: '2/27/2023'
  },
  {
    id: '2',
    name: '2013 Peterbilt Flatbed',
    type: 'Flat Bed',
    duty: 'Light',
    plate: '91942X2',
    plateExpired: '2/27/2023',
    lastOdometer: '91156',
    lastUpdated: '6/9/2022'
  },
  {
    id: '3',
    name: '2019 Ram 5500',
    type: 'Wrecker',
    duty: 'Light',
    plate: '137962Z',
    plateExpired: '8/30/2022',
    lastOdometer: '37486',
    lastUpdated: '6/9/2022'
  },
  {
    id: '4',
    name: '2021 International',
    type: 'Flat Bed',
    duty: 'Light',
    plate: '82660B3',
    plateExpired: '10/30/2022',
    lastOdometer: '39079',
    lastUpdated: '6/9/2022'
  },
  {
    id: '5',
    name: 'Ford F550 Wrecker',
    type: 'Wrecker',
    duty: 'Light',
    plate: ''
  }
];

const TrucksPage = () => {
  const [trucks] = useState<Truck[]>(initialTrucks);
  const [showInactive, setShowInactive] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-2">Manage Trucks</h1>
        <p className="text-gray-600">
          To modify one of your company's trucks or record information like odometer readings or expenses, 
          simply click on it in the list below.
        </p>
      </div>

      <TrucksFilters
        showInactive={showInactive}
        showDeleted={showDeleted}
        onShowInactiveToggle={() => setShowInactive(!showInactive)}
        onShowDeletedToggle={() => setShowDeleted(!showDeleted)}
      />

      <TrucksList trucks={trucks} />
    </div>
  );
};

export default TrucksPage;