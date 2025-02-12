import React from 'react';
import { STATEMENT_DUE_DATES, BILLING_METHODS } from './constants';

interface BillingOptionsProps {
  preferredMethod: string;
  dueDate: string;
  onMethodChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
}

export function BillingOptions({
  preferredMethod,
  dueDate,
  onMethodChange,
  onDueDateChange
}: BillingOptionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Other Options</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700">Preferred Billing Method</label>
          <select
            value={preferredMethod}
            onChange={(e) => onMethodChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {BILLING_METHODS.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Initial statement due date</label>
          <select
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {STATEMENT_DUE_DATES.map((date) => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}