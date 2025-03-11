import React from 'react';
import InvoiceForm from '../../InvoiceForm';

interface ModifyInvoiceProps {
  invoiceId: string;
}

const ModifyInvoice: React.FC<ModifyInvoiceProps> = ({ invoiceId }) => {
  return <InvoiceForm invoiceId={invoiceId} />;
};

export default ModifyInvoice;