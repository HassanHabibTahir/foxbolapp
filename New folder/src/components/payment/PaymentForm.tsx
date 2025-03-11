import React, { useState } from 'react';
import { PaymentType } from '../../types/payment';

interface PaymentFormProps {
  invoiceId: string;
  balanceDue: number;
  onSubmit: (payment: PaymentFormData) => Promise<void>;
  loading: boolean;
}

export interface PaymentFormData {
  amount: number;
  paymentType: PaymentType;
  referenceNumber: string;
  paymentDate: string;
  paymentTime: string;
  whoPaid: string;
  notes: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  invoiceId,
  balanceDue,
  onSubmit,
  loading
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: balanceDue,
    paymentType: 'CASH',
    referenceNumber: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    whoPaid: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
      <h3 className="text-lg font-medium">Record Payment</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={e => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
              className="pl-7 block w-full rounded-md border-gray-300"
              max={balanceDue}
            />
          </div>
        </div>

        {/* Payment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Type</label>
          <select
            value={formData.paymentType}
            onChange={e => setFormData(prev => ({ ...prev, paymentType: e.target.value as PaymentType }))}
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            <option value="CASH">Cash</option>
            <option value="CHECK">Check</option>
            <option value="CREDIT">Credit Card</option>
            <option value="DEBIT">Debit Card</option>
          </select>
        </div>

        {/* Reference Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Reference Number</label>
          <input
            type="text"
            value={formData.referenceNumber}
            onChange={e => setFormData(prev => ({ ...prev, referenceNumber: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>

        {/* Who Paid */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Who Paid</label>
          <input
            type="text"
            value={formData.whoPaid}
            onChange={e => setFormData(prev => ({ ...prev, whoPaid: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>

        {/* Notes */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={formData.notes}
            onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || formData.amount <= 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Recording...' : 'Record Payment'}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;