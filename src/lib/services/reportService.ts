import { supabase } from '../supabase';
import type { InvoiceDetails } from './invoiceService';

interface ReportData {
  invoiceDetails: InvoiceDetails;
  charges: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
}

export const generateInvoiceReport = async (invoiceNum: string): Promise<ReportData | null> => {
  try {
    // Get invoice details
    const { data: invData, error: invError } = await supabase
      .from('towinv')
      .select(`
        *,
        towmast:dispnum(*),
        towdrive:dispnum(*)
      `)
      .eq('invoicenum', invoiceNum)
      .single();

    if (invError) throw invError;
    if (!invData) return null;

    // Get transaction details
    const { data: transData, error: transError } = await supabase
      .from('towtrans')
      .select('*')
      .eq('dispnumtrs', invData.dispnum)
      .order('id');

    if (transError) throw transError;

    // Format charges data
    const charges = (transData || []).map(trans => ({
      description: trans.descriptio || '',
      quantity: trans.quantity || 0,
      rate: trans.price || 0,
      amount: trans.quantity * trans.price || 0
    }));

    return {
      invoiceDetails: invData,
      charges
    };
  } catch (error) {
    console.error('Error generating report data:', error);
    return null;
  }
};