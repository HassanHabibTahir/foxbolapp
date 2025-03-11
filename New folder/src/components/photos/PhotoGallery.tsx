import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { startCamera } from '../../lib/cameraService';
import { uploadPhoto, deletePhoto } from '../../lib/photoHandlers';

interface Photo {
  id: string;
  photo_url?: string;
  thumbnail_url?: string;
}

interface PhotoGalleryProps {
  dispatchId: string;
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ dispatchId, photos, onPhotosChange }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [taking, setTaking] = useState(false);

  const handleTakePhoto = async () => {
    if (photos.length >= 16) {
      alert('Maximum 16 photos allowed');
      return;
    }

    try {
      setTaking(true);
      const photoBlob = await startCamera();
      const result = await uploadPhoto(dispatchId, photoBlob);
      
      if (result.success && result.photo) {
        onPhotosChange([...photos, result.photo]);
      }
    } catch (error) {
      console.error('Photo error:', error);
    } finally {
      setTaking(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (confirm('Delete this photo?')) {
      const result = await deletePhoto(photoId);
      if (result.success) {
        onPhotosChange(photos.filter(p => p.id !== photoId));
      }
    }
  };

  // Test photos for demonstration
  const testPhotos = [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537',
    'https://images.unsplash.com/photo-1554744512-d6c603f27c54',
    'https://images.unsplash.com/photo-1493238792000-8113da705763'
  ].map((url, index) => ({
    id: `test-${index}`,
    photo_url: url,
    thumbnail_url: `${url}?auto=format&fit=crop&w=200&h=200`
  }));

  const displayPhotos = photos.length ? photos : testPhotos;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Vehicle Photos</h3>
        <button
          onClick={handleTakePhoto}
          disabled={taking || photos.length >= 16}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Camera className="w-4 h-4" />
          {taking ? 'Taking...' : 'Take Photo'}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {displayPhotos.map((photo, index) => (
          <div key={photo.id} className="relative aspect-square group">
            <img
              src={photo.thumbnail_url || photo.photo_url}
              alt={`Vehicle photo ${index + 1}`}
              className="w-full h-full object-cover rounded-lg cursor-pointer"
              onClick={() => setSelectedPhoto(index)}
            />
            <button
              onClick={() => handleDelete(photo.id)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Fullscreen viewer */}
      {selectedPhoto !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => setSelectedPhoto(Math.max(0, selectedPhoto - 1))}
            disabled={selectedPhoto === 0}
            className="absolute left-4 text-white disabled:opacity-50"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <img
            src={displayPhotos[selectedPhoto].photo_url}
            alt={`Vehicle photo ${selectedPhoto + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          
          <button
            onClick={() => setSelectedPhoto(Math.min(displayPhotos.length - 1, selectedPhoto + 1))}
            disabled={selectedPhoto === displayPhotos.length - 1}
            className="absolute right-4 text-white disabled:opacity-50"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;