import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ReportOption {
  id: string;
  name: string;
}

interface ReportComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ReportCombobox({ value, onChange }: ReportComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const reports: ReportOption[] = [
    { id: 'invoice', name: 'Invoice Register Report' },
    { id: 'driver', name: 'Driver Commission Report' },
    { id: 'item', name: 'Item Report' },
    { id: 'customer', name: 'Customer Report' },
    { id: 'autoclub', name: 'Auto Club Commission Report' },
    { id: 'lotinventory', name: 'Lot Inventory Report' },
    { id: 'arageing', name: 'A/R Ageing Report' },
    { id: 'payments', name: 'Payments Received Report' },
    { id: 'calllog', name: 'Call Log Report' }
  ];

  const selectedReport = reports.find(report => report.id === value);

  return (
    <div className="relative w-96">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-emerald-800 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
      >
        <span>{selectedReport?.name || 'Select a report'}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => {
                onChange(report.id);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-emerald-50 transition-colors
                ${report.id === value ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700'}`}
            >
              {report.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}