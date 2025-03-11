import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Payment, PaymentState } from '../types/payment';
import type { PaymentFormData } from '../components/payment/PaymentForm';

export const usePaymentState = (invoiceId: string) => {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    invoiceTotal: 0,
    amountPaid: 0,
    balanceDue: 0,
    payments: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial payment state
  useEffect(() => {
    const loadPaymentState = async () => {
      try {
        // Get invoice details
        const { data: invoice, error: invError } = await supabase
          .from('towinv')
          .select('total, totalpaid, curbalance')
          .eq('invoicenum', invoiceId)
          .single();

        if (invError) throw invError;

        // Get payment history
        const { data: payments, error: payError } = await supabase
          .from('received')
          .select('*')
          .eq('invoicenum', invoiceId)
          .order('datepaid', { ascending: false });

        if (payError) throw payError;

        setPaymentState({
          invoiceTotal: invoice.total || 0,
          amountPaid: invoice.totalpaid || 0,
          balanceDue: invoice.curbalance || 0,
          payments: payments || []
        });
      } catch (err) {
        console.error('Error loading payment state:', err);
        setError('Failed to load payment information');
      }
    };

    loadPaymentState();
  }, [invoiceId]);

  const recordPayment = async (formData: PaymentFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Start a Supabase transaction
      const { data: payment, error: payError } = await supabase
        .from('received')
        .insert({
          invoicenum: invoiceId,
          amount: formData.amount,
          paytype: formData.paymentType,
          referencenum: formData.referenceNumber,
          datepaid: formData.paymentDate,
          datetime: new Date().toISOString(),
          whopayed: formData.whoPaid,
          paynote: formData.notes,
          enterbywho: 'SYSTEM' // Replace with actual user
        })
        .select()
        .single();

      if (payError) throw payError;

      // Update invoice totals
      const { error: invError } = await supabase
        .from('towinv')
        .update({
          totalpaid: paymentState.amountPaid + formData.amount,
          curbalance: paymentState.balanceDue - formData.amount,
          total_dt: new Date().toISOString()
        })
        .eq('invoicenum', invoiceId);

      if (invError) throw invError;

      // Update local state
      setPaymentState(prev => ({
        ...prev,
        amountPaid: prev.amountPaid + formData.amount,
        balanceDue: prev.balanceDue - formData.amount,
        payments: [payment, ...prev.payments]
      }));
    } catch (err) {
      console.error('Error recording payment:', err);
      setError('Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const voidPayment = async (paymentId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get payment details
      const { data: payment, error: getError } = await supabase
        .from('received')
        .select('amount')
        .eq('id', paymentId)
        .single();

      if (getError) throw getError;

      // Update payment record
      const { error: voidError } = await supabase
        .from('received')
        .update({
          voided: true,
          voideddt: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (voidError) throw voidError;

      // Update invoice totals
      const { error: invError } = await supabase
        .from('towinv')
        .update({
          totalpaid: paymentState.amountPaid - payment.amount,
          curbalance: paymentState.balanceDue + payment.amount
        })
        .eq('invoicenum', invoiceId);

      if (invError) throw invError;

      // Update local state
      setPaymentState(prev => ({
        ...prev,
        amountPaid: prev.amountPaid - payment.amount,
        balanceDue: prev.balanceDue + payment.amount,
        payments: prev.payments.map(p => 
          p.id === paymentId ? { ...p, voided: true } : p
        )
      }));
    } catch (err) {
      console.error('Error voiding payment:', err);
      setError('Failed to void payment');
    } finally {
      setLoading(false);
    }
  };

  return {
    paymentState,
    recordPayment,
    voidPayment,
    loading,
    error
  };
};