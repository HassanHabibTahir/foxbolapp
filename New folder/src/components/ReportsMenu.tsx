import React from 'react';
import { Menu } from 'lucide-react';

interface ReportsMenuProps {
  currentReport: string;
  onSelectReport: (report: string) => void;
}

export default function ReportsMenu({ currentReport, onSelectReport }: ReportsMenuProps) {
  const reports = [
    { id: 'invoice', name: 'Invoice Register Report' },
    { id: 'driver', name: 'Driver Commission Report' },
    { id: 'item', name: 'Item Report' },
    { id: 'customer', name: 'Customer Report' },
    { id: 'autoclub', name: 'Auto Club Commission Report' },
  ];

  return (
    <div className="bg-emerald-900 text-white p-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <Menu className="h-6 w-6" />
        <h1 className="text-xl font-semibold">Reports</h1>
        <div className="flex gap-4 ml-8">
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => onSelectReport(report.id)}
              className={`px-4 py-2 rounded transition-colors ${
                currentReport === report.id
                  ? 'bg-emerald-700 text-white'
                  : 'hover:bg-emerald-800'
              }`}
            >
              {report.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}