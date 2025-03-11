import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { InvoiceData } from '../types/invoice';

export const useInvoiceData = (invoiceId: string) => {
  const [data, setData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: invoice, error: invoiceError } = await supabase
          .from('invoices')
          .select(`
            *,
            dispatch:dispatch_id(*),
            customer:customer_id(*),
            items:invoice_items(*)
          `)
          .eq('id', invoiceId)
          .single();

        if (invoiceError) throw invoiceError;
        setData(invoice);
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError('Failed to load invoice data');
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  return { data, loading, error };
};