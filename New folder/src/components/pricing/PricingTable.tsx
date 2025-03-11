import React from 'react';
import type { PricingRate, VehicleType } from './types';

interface PricingTableProps {
  rates: PricingRate[];
  vehicleTypes: VehicleType[];
  onRateClick: (rateId: string, vehicleType: string) => void;
}

export function PricingTable({ rates, vehicleTypes, onRateClick }: PricingTableProps) {
  return (
    <div className="mt-4">
      <div className="text-sm text-gray-700 mb-4">
        Specify special pricing for this account here. When dispatch calls are entered for this customer or vehicles are impounded for this account, they will automatically use these rates instead of your standard company rates. To specify a custom rate, click on the item.
      </div>
      
      <div className="mb-4">
        <h3 className="text-base font-medium text-gray-900">Service Rates - Setup custom rates for this account</h3>
        <p className="text-sm text-gray-500">Set them up below.</p>
        
        <div className="flex space-x-4 mt-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            Show all rates (regardless of whether they've been adjusted for this account)
          </button>
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            Show only rates that've been adjusted for this account
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-sm font-medium text-gray-900">
                Rate Name/Description
              </th>
              {vehicleTypes.map((type) => (
                <th key={type.id} className="px-3 py-2 text-left text-sm font-medium text-gray-900">
                  {type.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rates.map((rate) => (
              <tr key={rate.id}>
                <td className="px-3 py-2 text-sm text-gray-900">{rate.name}</td>
                {vehicleTypes.map((type) => {
                  const rateValue = rate.rates[type.id];
                  return (
                    <td
                      key={`${rate.id}-${type.id}`}
                      onClick={() => onRateClick(rate.id, type.id)}
                      className={`px-3 py-2 text-sm cursor-pointer ${
                        rateValue.isCustom ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      ${rateValue.amount.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-900">Legend:</h4>
        <ul className="mt-2 space-y-1">
          <li className="text-sm">
            <span className="text-blue-600">• Prices displayed in Blue</span> have been adjusted for this specific account.
          </li>
          <li className="text-sm">
            <span className="text-gray-500">• Prices displayed in Gray</span> have not been adjusted, and are using the standard rates that apply to everyone.
          </li>
        </ul>
      </div>
    </div>
  );
}