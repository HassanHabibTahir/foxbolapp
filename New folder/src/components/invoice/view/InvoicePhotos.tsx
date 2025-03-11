import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface InvoicePhotosProps {
  invoiceId: string;
}

const InvoicePhotos: React.FC<InvoicePhotosProps> = ({ invoiceId }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  return (
    <div className="px-6 py-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Photographs</h3>
      
      <div className="grid grid-cols-4 gap-4">
        {/* Example photos - replace with actual data */}
        {[1, 2, 3, 4, 5].map((index) => (
          <div 
            key={index}
            className="relative aspect-square cursor-pointer group"
            onClick={() => setSelectedPhoto(index)}
          >
            <img
              src={`https://source.unsplash.com/random/400x400?car&sig=${index}`}
              alt={`Vehicle photo ${index}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg" />
          </div>
        ))}
      </div>

      {/* Fullscreen viewer */}
      {selectedPhoto !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => setSelectedPhoto(Math.max(1, selectedPhoto - 1))}
            className="absolute left-4 text-white p-2 hover:bg-white/10 rounded-full"
            disabled={selectedPhoto === 1}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <img
            src={`https://source.unsplash.com/random/800x800?car&sig=${selectedPhoto}`}
            alt={`Vehicle photo ${selectedPhoto}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          
          <button
            onClick={() => setSelectedPhoto(Math.min(5, selectedPhoto + 1))}
            className="absolute right-4 text-white p-2 hover:bg-white/10 rounded-full"
            disabled={selectedPhoto === 5}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoicePhotos;