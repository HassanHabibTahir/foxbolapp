import React from 'react';
import { FileText } from 'lucide-react';
import ReportCombobox from './ReportCombobox';

interface HeaderProps {
  currentReport: string;
  onSelectReport: (report: string) => void;
}

export default function Header({ currentReport, onSelectReport }: HeaderProps) {
  return (
    <div className=" p-4">
      <div className=" mx-auto flex items-center justify-center gap-4">
        <FileText className="h-6 w-6" />
        <h1 className="text-xl font-semibold">Reports</h1>
        <div className="ml-8">
          <ReportCombobox 
            value={currentReport}
            onChange={onSelectReport}
          />
        </div>
      </div>
    </div>
  );
}