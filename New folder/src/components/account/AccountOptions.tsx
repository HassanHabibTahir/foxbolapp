import React from 'react';

interface AccountOptionsProps {
  taxExempt: boolean;
  emailInvoices: boolean;
  disableAccount: boolean;
  addContactToCalls: boolean;
  requirePayment: boolean;
  onOptionChange: (option: string, value: boolean) => void;
}

export function AccountOptions({
  taxExempt,
  emailInvoices,
  disableAccount,
  addContactToCalls,
  requirePayment,
  onOptionChange
}: AccountOptionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={taxExempt}
          onChange={(e) => onOptionChange('taxExempt', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">Tax Exempt</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={emailInvoices}
          onChange={(e) => onOptionChange('emailInvoices', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">Email Invoices Automatically</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={disableAccount}
          onChange={(e) => onOptionChange('disableAccount', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">Disable Account</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={addContactToCalls}
          onChange={(e) => onOptionChange('addContactToCalls', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">Add contact to calls</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={requirePayment}
          onChange={(e) => onOptionChange('requirePayment', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">Require Payment (C.O.D Account)</label>
      </div>
    </div>
  );
}