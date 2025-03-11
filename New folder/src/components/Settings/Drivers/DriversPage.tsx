import React, { useState } from 'react';
import { Driver } from './types';
import DriversFilters from './DriversFilters';
import DriversList from './DriversList';

const initialDrivers: Driver[] = [
  { id: '1', name: 'Alcides Hernandez', created: '3/8/2022' },
  { id: '2', name: 'Carlos_Godinez', created: '7/14/2023' },
  { id: '3', name: 'Darrell Wells', created: '3/8/2022' },
  { id: '4', name: 'Darrell Wells', created: '6/13/2022' },
  { id: '5', name: 'David Primavera', created: '6/30/2023' },
  { id: '6', name: 'Harrison Wells', created: '3/8/2022' },
  { id: '7', name: 'Humberto Benavidez', created: '2/23/2023' },
  { id: '8', name: 'Jaime Ipapo', created: '3/8/2022' },
  { id: '9', name: 'Kane Wheeler', created: '9/7/2022' },
  { id: '10', name: 'Mike Tallent', created: '3/2/2023' }
];

const DriversPage = () => {
  const [drivers] = useState<Driver[]>(initialDrivers);
  const [showInactive, setShowInactive] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-2">Manage Drivers</h1>
        <p className="text-gray-600">
          To modify an existing driver, just click on their name in the list below. To add a new one, click the green button.
        </p>
      </div>

      <DriversFilters
        showInactive={showInactive}
        showDeleted={showDeleted}
        onShowInactiveToggle={() => setShowInactive(!showInactive)}
        onShowDeletedToggle={() => setShowDeleted(!showDeleted)}
      />

      <DriversList drivers={drivers} />
    </div>
  );
};

export default DriversPage;