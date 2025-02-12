import React from 'react';
import { FileText, Printer, Mail, Download } from 'lucide-react';

interface InvoiceHeaderProps {
  invoiceId: string;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoiceId }) => {
  return (
    <div className="px-6 py-4 bg-gray-50 rounded-t-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Invoice #{invoiceId}
        </h2>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border hover:bg-gray-50">
            <Printer className="w-4 h-4" />
            Print
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border hover:bg-gray-50">
            <Mail className="w-4 h-4" />
            Email
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;