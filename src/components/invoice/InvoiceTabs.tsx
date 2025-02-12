import React from 'react';
import { FileText, Edit2, Printer, DollarSign } from 'lucide-react';
import InvoiceView from './view/InvoiceView';
import InvoiceForm from '../InvoiceForm';
import PrintInvoice from './print/PrintInvoice';
import ReceivePayment from '../payment/ReceivePayment';

interface InvoiceTabsProps {
  invoiceId: string;
}

const InvoiceTabs: React.FC<InvoiceTabsProps> = ({ invoiceId }) => {
  const [activeTab, setActiveTab] = React.useState<'view' | 'modify' | 'print' | 'payment'>('view');

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <nav className="flex -mb-px" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('view')}
            className={`
              flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2
              ${activeTab === 'view'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <FileText className="w-4 h-4" />
            View Invoice
          </button>
          
          <button
            onClick={() => setActiveTab('modify')}
            className={`
              flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2
              ${activeTab === 'modify'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <Edit2 className="w-4 h-4" />
            Modify Invoice
          </button>

          <button
            onClick={() => setActiveTab('print')}
            className={`
              flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2
              ${activeTab === 'print'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`
              flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2
              ${activeTab === 'payment'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <DollarSign className="w-4 h-4" />
            Receive Payment
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'view' && <InvoiceView invoiceId={invoiceId} />}
        {activeTab === 'modify' && <InvoiceForm invoiceId={invoiceId} />}
        {activeTab === 'print' && <PrintInvoice invoiceId={invoiceId} />}
        {activeTab === 'payment' && <ReceivePayment invoiceId={invoiceId} />}
      </div>
    </div>
  );
};

export default InvoiceTabs;