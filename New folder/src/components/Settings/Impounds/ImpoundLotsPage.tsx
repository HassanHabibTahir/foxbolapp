import React, { useState } from 'react';
import { ImpoundLot } from './types';
import ImpoundLotsList from './ImpoundLotsList';

const initialLots: ImpoundLot[] = [
  { id: '1', name: 'Certified Towing Lot 1', location: '2777 Giant Rd.' },
  { id: '2', name: 'Certified Towing Lot2', location: '2777 Giant Rd.' },
  { id: '3', name: 'Certified Towing Evidence Barn', location: '2777 Giant Rd.' }
];

const ImpoundLotsPage = () => {
  const [lots] = useState<ImpoundLot[]>(initialLots);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-2">Impound Lots</h1>
        <p className="text-gray-600 mb-4">
          Manage the list of impound lots that your company owns.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <p className="text-sm text-blue-700">
            Impound lots represent physical locations where you hold vehicles for accident impounds, 
            police impounds, vehicle storage, etc. If needing to setup impound lots owned by other 
            companies where you store vehicles, use our Storage Facility account type instead!
          </p>
        </div>
      </div>

      <div className="mb-6">
        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          Add a New Impound Lot
        </button>
      </div>

      <ImpoundLotsList lots={lots} />
    </div>
  );
};

export default ImpoundLotsPage;