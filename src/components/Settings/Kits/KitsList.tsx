import React from 'react';
import { Kit } from './types';

interface KitsListProps {
  kits: Kit[];
  onEdit: (kit: Kit) => void;
  onDelete: (id: string) => void;
}

const KitsList: React.FC<KitsListProps> = ({ kits, onEdit, onDelete }) => {
  if (kits.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No kits found. Add a new kit to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {kits.map((kit) => (
          <li key={kit.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <p className="text-lg font-medium text-indigo-600 truncate">{kit.kit}</p>
                  <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {kit.transaction}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">CUS:</span> {kit.cus}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Class:</span> {kit.class}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Item Group:</span> {kit.itemGroup}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Quantity:</span> {kit.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Price:</span> ${kit.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Reason:</span> {kit.reason}
                  </p>
                </div>
                {kit.description && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{kit.description}</p>
                )}
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => onEdit(kit)}
                  className="mr-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-1 px-3 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => kit.id && onDelete(kit.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1 px-3 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KitsList;
