import React from 'react';

interface CreditOptionsProps {
  openingBalance: string;
  creditHold: boolean;
  onOpeningBalanceChange: (value: string) => void;
  onCreditHoldChange: (value: boolean) => void;
}

export function CreditOptions({
  openingBalance,
  creditHold,
  onOpeningBalanceChange,
  onCreditHoldChange
}: CreditOptionsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Opening Balance</h3>
        <input
          type="number"
          step="0.01"
          value={openingBalance}
          onChange={(e) => onOpeningBalanceChange(e.target.value)}
          className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Credit Options</h3>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={creditHold}
            onChange={(e) => onCreditHoldChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Credit Hold - Prevent new calls from being charged to this account
          </label>
        </div>
      </div>
    </div>
  );
}