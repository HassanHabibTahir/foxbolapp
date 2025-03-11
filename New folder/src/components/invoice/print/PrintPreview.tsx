import React from 'react';
import { useInvoiceDetails } from '../../../hooks/useInvoiceDetails';
import type { PrintSettings } from '../../../types/print';

interface PrintPreviewProps {
  invoiceId: string;
  settings: PrintSettings;
}

const PrintPreview: React.FC<PrintPreviewProps> = ({ invoiceId, settings }) => {
  const { data, loading, error } = useInvoiceDetails(invoiceId);

  if (loading) {
    return <div className="p-8 text-center">Loading preview...</div>;
  }

  if (error || !data) {
    return <div className="p-8 text-center text-red-600">Failed to load invoice</div>;
  }

  return (
    <div className="p-8 space-y-6 print:p-0">
      {/* Company Header */}
      {settings.showHeader && (
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">INVOICE</h1>
            <p className="text-gray-600">#{invoiceId}</p>
          </div>
          <div className="text-right">
            <h2 className="font-bold">{settings.companyName}</h2>
            <p className="text-sm text-gray-600">{settings.companyAddress}</p>
            <p className="text-sm text-gray-600">{settings.companyPhone}</p>
          </div>
        </div>
      )}

      {/* Vehicle Info */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Make/Model</p>
            <p>{data.yearcar} {data.makecar} {data.modelcar}</p>
          </div>
          <div>
            <p className="text-gray-600">Color</p>
            <p>{data.colorcar}</p>
          </div>
        </div>
      </div>

      {/* Billing Info */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
        <div>
          <p>{data.billtoname}</p>
          <p>{data.billtoaddr1}</p>
          <p>{data.billtocity}, {data.billtost} {data.billtozip}</p>
        </div>
      </div>

      {/* Charges */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Charges</h3>
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">Service Total</td>
              <td className="py-2 text-right">${data.total.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="py-2">Tax</td>
              <td className="py-2 text-right">${data.salestax.toFixed(2)}</td>
            </tr>
            <tr className="font-bold border-t">
              <td className="py-2">Total</td>
              <td className="py-2 text-right">
                ${(data.total + data.salestax).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {settings.showFooter && (
        <div className="border-t pt-6 text-sm text-gray-600">
          <p>{settings.footerText}</p>
        </div>
      )}
    </div>
  );
};

export default PrintPreview;