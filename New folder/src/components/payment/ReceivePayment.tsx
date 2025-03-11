import React, { useState } from 'react';
import { useInvoiceDetails } from '../../hooks/useInvoiceDetails';
import { supabase } from '../../lib/supabase';

interface ReceivePaymentProps {
  invoiceId: string;
}

const ReceivePayment: React.FC<ReceivePaymentProps> = ({ invoiceId }) => {
  const { data: invoice } = useInvoiceDetails(invoiceId);
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('CASH');
  const [reference, setReference] = useState('');
  const [whoPaid, setWhoPaid] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !paymentType) return;

    setLoading(true);
    try {
      // Record payment in received table
      const { error: paymentError } = await supabase
        .from('received')
        .insert({
          invoicenum: invoiceId,
          amount: parseFloat(amount),
          paytype: paymentType,
          referencenum: reference,
          datepaid: new Date().toISOString(),
          whopayed: whoPaid,
          enterbywho: 'SYSTEM'
        });

      if (paymentError) throw paymentError;

      // Update invoice totals
      const { error: invoiceError } = await supabase
        .from('towinv')
        .update({
          totalpaid: (invoice?.totalpaid || 0) + parseFloat(amount),
          curbalance: (invoice?.curbalance || 0) - parseFloat(amount)
        })
        .eq('invoicenum', invoiceId);

      if (invoiceError) throw invoiceError;

      // Reset form
      setAmount('');
      setReference('');
      setWhoPaid('');
      alert('Payment recorded successfully');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-6">Receive Payment</h2>

      {/* Payment Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="text-sm text-gray-500">Invoice Total</div>
          <div className="text-lg font-medium">${invoice?.total?.toFixed(2) || '0.00'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Amount Paid</div>
          <div className="text-lg font-medium text-green-600">${invoice?.totalpaid?.toFixed(2) || '0.00'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Balance Due</div>
          <div className="text-lg font-medium text-red-600">${invoice?.curbalance?.toFixed(2) || '0.00'}</div>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-7 pr-12 border-gray-300 rounded-md"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md"
              required
            >
              <option value="CASH">Cash</option>
              <option value="CHECK">Check</option>
              <option value="CREDIT">Credit Card</option>
              <option value="DEBIT">Debit Card</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reference #</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md"
              placeholder="Check/Card number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Who Paid</label>
            <input
              type="text"
              value={whoPaid}
              onChange={(e) => setWhoPaid(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md"
              placeholder="Name"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !amount}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Recording...' : 'Record Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReceivePayment;