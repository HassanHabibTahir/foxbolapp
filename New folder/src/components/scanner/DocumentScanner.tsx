import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { startScanner } from '../../lib/scannerService';
import { uploadDocument } from '../../lib/documentHandlers';

interface DocumentScannerProps {
  dispatchId: string;
  onClose: () => void;
  onDocumentAdded: (doc: { id: string; url: string; name: string }) => void;
}

const DocumentScanner: React.FC<DocumentScannerProps> = ({
  dispatchId,
  onClose,
  onDocumentAdded
}) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    try {
      setScanning(true);
      setError(null);
      
      const file = await startScanner();
      if (!file) return;

      const result = await uploadDocument(dispatchId, file);
      if (result.success && result.document) {
        onDocumentAdded(result.document);
        onClose();
      } else {
        setError('Failed to upload document');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to get document');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Document</h3>
          <button onClick={onClose} className="p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleScan}
            disabled={scanning}
            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Upload className={`w-5 h-5 ${scanning ? 'animate-pulse' : ''}`} />
            {scanning ? 'Processing...' : 'Select Document'}
          </button>

          <p className="text-sm text-gray-500 text-center">
            Select a document from your computer to upload
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentScanner;