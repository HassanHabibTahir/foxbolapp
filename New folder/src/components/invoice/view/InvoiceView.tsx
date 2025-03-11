import React from 'react';
import { useInvoiceData } from '../../../hooks/useInvoiceData';
import InvoiceHeader from './InvoiceHeader';
import InvoiceDetails from './InvoiceDetails';
import InvoiceCharges from './InvoiceCharges';
import InvoicePhotos from './InvoicePhotos';
import InvoiceFiles from './InvoiceFiles';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorMessage from '../../common/ErrorMessage';

interface InvoiceViewProps {
  invoiceId: string;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ invoiceId }) => {
  const { data: invoice, loading, error } = useInvoiceData(invoiceId);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !invoice) {
    return <ErrorMessage message={error || 'Invoice not found'} />;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <InvoiceHeader 
        invoiceNumber={invoice.invoice_number}
        createdAt={invoice.created_at}
      />
      
      <div className="divide-y divide-gray-200">
        <InvoiceDetails 
          dispatch={invoice.dispatch}
          customer={invoice.customer}
        />
        <InvoiceCharges 
          items={invoice.items || []}
          subtotal={invoice.subtotal}
          taxAmount={invoice.tax_amount}
          total={invoice.total_amount}
        />
        <InvoicePhotos dispatchId={invoice.dispatch_id} />
        <InvoiceFiles dispatchId={invoice.dispatch_id} />
      </div>
    </div>
  );
};

export default InvoiceView;