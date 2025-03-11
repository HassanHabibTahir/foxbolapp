import React from 'react';
import { Clock, ScanLine, Camera } from 'lucide-react';
import PhotoGallery from '../photos/PhotoGallery';
import DocumentScanner from '../scanner/DocumentScanner';

interface HeaderProps {
  dispatchNumber: string;
}

const Header: React.FC<HeaderProps> = ({ dispatchNumber }) => {
  const [showPhotoGallery, setShowPhotoGallery] = React.useState(false);
  const [showScanner, setShowScanner] = React.useState(false);

  return (
    <header className="flex flex-wrap justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold flex flex-wrap items-center gap-2">
          Dispatch # 
          {dispatchNumber}
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