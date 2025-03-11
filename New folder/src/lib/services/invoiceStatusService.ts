import { supabase } from '../supabase';

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'void';

interface StatusTransition {
  from: InvoiceStatus;
  to: InvoiceStatus;
  allowed: boolean;
  requiresAuth?: boolean;
}

const statusTransitions: StatusTransition[] = [
  { from: 'draft', to: 'pending', allowed: true },
  { from: 'pending', to: 'paid', allowed: true },
  { from: 'pending', to: 'void', allowed: true, requiresAuth: true },
  { from: 'draft', to: 'void', allowed: true }
];

export const invoiceStatusService = {
  async updateStatus(
    invoiceId: string,
    newStatus: InvoiceStatus
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: invoice, error: fetchError } = await supabase
        .from('invoices')
        .select('status')
        .eq('id', invoiceId)
        .single();

      if (fetchError) throw fetchError;

      const transition = statusTransitions.find(
        t => t.from === invoice.status && t.to === newStatus
      );

      if (!transition || !transition.allowed) {
        return {
          success: false,
          error: `Status transition from ${invoice.status} to ${newStatus} is not allowed`
        };
      }

      const { error: updateError } = await supabase
        .from('invoices')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', invoiceId);

      if (updateError) throw updateError;

      return { success: true };
    } catch (error) {
      console.error('Error updating invoice status:', error);
      return {
        success: false,
        error: 'Failed to update invoice status'
      };
    }
  }
};