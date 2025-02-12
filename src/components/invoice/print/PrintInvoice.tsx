import React, { useRef } from 'react';
import { Printer, Download, Settings } from 'lucide-react';
import PrintPreview from './PrintPreview';
import PrintSettings from './PrintSettings';
import { usePrintSettings } from '../../../hooks/usePrintSettings';
import { generatePDF } from '../../../lib/services/pdfService';

interface PrintInvoiceProps {
  invoiceId: string;
}

const PrintInvoice: React.FC<PrintInvoiceProps> = ({ invoiceId }) => {
  const [showSettings, setShowSettings] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const { settings, updateSettings } = usePrintSettings();
  const [downloading, setDownloading] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const pdfBlob = await generatePDF(invoiceId, settings);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>

        <button
          onClick={() => setShowSettings(true)}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900"
        >
          <Settings className="w-4 h-4" />
          Print Settings
        </button>
      </div>

      {/* Print Preview */}
      <div ref={printRef} className="bg-white rounded-lg shadow-lg">
        <PrintPreview invoiceId={invoiceId} settings={settings} />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <PrintSettings
          settings={settings}
          onSave={(newSettings) => {
            updateSettings(newSettings);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default PrintInvoice;