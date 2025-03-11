import React from 'react';
import InvoiceDetails from '../view/InvoiceDetails';
import InvoiceCharges from '../view/InvoiceCharges';
import InvoicePhotos from '../view/InvoicePhotos';
import InvoiceFiles from '../view/InvoiceFiles';

interface ViewInvoiceProps {
  invoiceId: string;
}

const ViewInvoice: React.FC<ViewInvoiceProps> = ({ invoiceId }) => {
  return (
    <div className="space-y-6">
      <InvoiceDetails invoiceId={invoiceId} />
      <InvoiceCharges invoiceId={invoiceId} />
      <InvoicePhotos invoiceId={invoiceId} />
      <InvoiceFiles invoiceId={invoiceId} />
    </div>
  );
};

export default ViewInvoice;