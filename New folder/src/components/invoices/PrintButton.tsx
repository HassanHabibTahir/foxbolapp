import React from 'react';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  onPrint: () => void;
}

const PrintButton: React.FC<PrintButtonProps> = ({ onPrint }) => {
  return (
    <button
      onClick={onPrint}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <Printer className="w-5 h-5 mr-2" />
      Print Invoice
    </button>
  );
};

export default PrintButton;