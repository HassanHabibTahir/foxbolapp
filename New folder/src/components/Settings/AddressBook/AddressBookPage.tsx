import React, { useState } from 'react';
import { AddressEntry } from './types';
import AddressBookList from './AddressBookList';

const AddressBookPage = () => {
  const [entries] = useState<AddressEntry[]>([]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-2">Manage Address Book</h1>
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-semibold">Hey!</span> It looks like you haven't created any entries in your Address Book yet. Click the green button to get started.
          </p>
          <p className="text-gray-600">
            Save any addresses that you use regularly. This will help you quickly use them when creating calls!
          </p>
        </div>
      </div>

      <div className="mb-6">
        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          Add your First Address
        </button>
      </div>

      <AddressBookList entries={entries} />
    </div>
  );
};

export default AddressBookPage;