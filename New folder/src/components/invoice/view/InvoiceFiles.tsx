import React from 'react';
import { FileText, Download } from 'lucide-react';

interface InvoiceFilesProps {
  invoiceId: string;
}

const InvoiceFiles: React.FC<InvoiceFilesProps> = ({ invoiceId }) => {
  return (
    <div className="px-6 py-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Files</h3>
      
      <div className="space-y-2">
        {/* Example files - replace with actual data */}
        {['Release Form.pdf', 'Property Report.pdf'].map((fileName, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-900">{fileName}</span>
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Download className="w-5 h-5" />
            </button>
          </div>
        ))}
        
        {/* Empty state */}
        {false && (
          <div className="text-sm text-gray-500 italic">
            No files have been uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceFiles;