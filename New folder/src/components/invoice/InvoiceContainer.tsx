import React, { useState } from 'react';
import { FileText, Edit2, Printer, DollarSign } from 'lucide-react';
import ViewInvoice from './tabs/ViewInvoice';
import ModifyInvoice from './tabs/ModifyInvoice';
import PrintInvoice from './tabs/PrintInvoice';
import ReceivePayment from './tabs/ReceivePayment';

type TabType = 'view' | 'modify' | 'print' | 'payment';

interface Tab {
  id: TabType;
  label: string;
  icon: typeof FileText;
  component: React.FC<{ invoiceId: string }>;
}

const InvoiceContainer = () => {
  const [activeTab, setActiveTab] = useState<TabType>('view');
  const invoiceId = '123456'; // For demo purposes

  const tabs: Tab[] = [
    { id: 'view', label: 'View Invoice', icon: FileText, component: ViewInvoice },
    { id: 'modify', label: 'Modify Invoice', icon: Edit2, component: ModifyInvoice },
    { id: 'print', label: 'Print Invoice', icon: Printer, component: PrintInvoice },
    { id: 'payment', label: 'Receive Payment', icon: DollarSign, component: ReceivePayment }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {tabs.map(tab => (
          activeTab === tab.id && (
            <tab.component key={tab.id} invoiceId={invoiceId} />
          )
        ))}
      </div>
    </div>
  );
};

export default InvoiceContainer;