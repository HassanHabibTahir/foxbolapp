import React from 'react';
import { Clock, ScanLine, Camera, FileText } from 'lucide-react';
import { startScanner } from '../../lib/scannerService';
import { ScannerError } from '../../lib/types';
import { searchByVin } from '../../lib/vinHandlers';
import PhotoGallery from '../photos/PhotoGallery';
import DocumentScanner from '../scanner/DocumentScanner';

interface HeaderProps {
  dispatchNumber: string;
  onDispatchNumberChange: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ dispatchNumber, onDispatchNumberChange }) => {
  const [showPhotoGallery, setShowPhotoGallery] = React.useState(false);
  const [showScanner, setShowScanner] = React.useState(false);

  return (
    <header className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Dispatch # 
          <input 
            type="text" 
            className="border rounded px-2 py-1 w-28 text-center"
            placeholder="123456"
            value={dispatchNumber}
            onChange={(e) => onDispatchNumberChange(e.target.value)}
          />
        </h1>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
        <button 
          onClick={() => setShowPhotoGallery(true)}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Take Photos"
        >
          <Camera className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setShowScanner(true)}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Scan Documents"
        >
          <ScanLine className="w-5 h-5" />
        </button>
      </div>

      {showPhotoGallery && (
        <PhotoGallery
          dispatchId={dispatchNumber}
          photos={[]}
          onPhotosChange={() => {}}
        />
      )}

      {showScanner && (
        <DocumentScanner
          dispatchId={dispatchNumber}
          onClose={() => setShowScanner(false)}
          onDocumentAdded={() => {}}
        />
      )}
    </header>
  );
};

export default Header;