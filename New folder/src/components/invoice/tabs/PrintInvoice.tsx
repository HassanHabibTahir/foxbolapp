import React from 'react';
import PrintInvoiceView from '../print/PrintInvoice';

interface PrintInvoiceTabProps {
  invoiceId: string;
}

const PrintInvoiceTab: React.FC<PrintInvoiceTabProps> = ({ invoiceId }) => {
  return <PrintInvoiceView invoiceId={invoiceId} />;
};

export default PrintInvoiceTab;