import { useState, useEffect } from 'react';
import { getInvoiceDetails, InvoiceDetails } from '../lib/services/invoiceService';

export const useInvoiceDetails = (invoiceId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<InvoiceDetails | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const details = await getInvoiceDetails(invoiceId);
        setData(details);
      } catch (err) {
        setError('Failed to load invoice details');
        console.error('Invoice details error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchDetails();
    }
  }, [invoiceId]);

  return { data, loading, error };
};