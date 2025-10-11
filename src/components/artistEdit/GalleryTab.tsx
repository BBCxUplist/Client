import { useState } from 'react';
import type { Artist } from '@/types';
import { useImageUpload } from '@/hooks/useImageUpload';
import {
  useAddGalleryPhotos,
  useDeleteGalleryPhoto,
} from '@/hooks/artist/useGalleryOperations';

interface GalleryTabProps {
  artist: Artist;
  formData?: {
    photos?: string[];
  };
  handleInputChange?: (field: string, value: any) => void;
  onGalleryChange?: (photos: string[]) => void;
}

const GalleryTab = ({
  artist,
  formData,
  handleInputChange,
  onGalleryChange,
}: GalleryTabProps) => {
  const { uploading, error, handleFileUpload } = useImageUpload();
  const [dragOver, setDragOver] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Gallery API hooks
  const addGalleryPhotosMutation = useAddGalleryPhotos();
  const deleteGalleryPhotoMutation = useDeleteGalleryPhoto();

  const currentPhotos = formData?.photos || artist.photos || [];

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');

    const uploadPromises = Array.from(files).map(async file => {
      const result = await handleFileUpload(file, 'artist', 'gallery');
      return result.success ? result.url : null;
    });

    const uploadedUrls = (await Promise.all(uploadPromises)).filter(
      Boolean
    ) as string[];

    if (uploadedUrls.length > 0) {
      try {
        // Call the gallery API to add photos
        const result = await addGalleryPhotosMutation.mutateAsync({
          photoUrls: uploadedUrls,
        });

        if (result.success) {
          setSuccessMessage(
            `Successfully added ${uploadedUrls.length} photo(s) to gallery!`
          );
          // Update local state
          if (handleInputChange) {
            handleInputChange('photos', [...currentPhotos, ...uploadedUrls]);
          }
          if (onGalleryChange) {
            onGalleryChange([...currentPhotos, ...uploadedUrls]);
          }
        } else {
          setErrorMessage(result.message || 'Failed to add photos to gallery');
        }
      } catch (error: any) {
        console.error('Error adding photos to gallery:', error);
        setErrorMessage(error.message || 'Failed to add photos to gallery');
      }
    }
  };

  const handleRemovePhoto = async (index: number) => {
    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Call the gallery API to delete photo by index
      const result = await deleteGalleryPhotoMutation.mutateAsync(index);

      if (result.success) {
        setSuccessMessage('Photo removed from gallery successfully!');
        // Update local state
        const updatedPhotos = currentPhotos.filter((_, i) => i !== index);
        if (handleInputChange) {
          handleInputChange('photos', updatedPhotos);
        }
        if (onGalleryChange) {
          onGalleryChange(updatedPhotos);
        }
      } else {
        setErrorMessage(
          result.message || 'Failed to remove photo from gallery'
        );
      }
    } catch (error: any) {
      console.error('Error removing photo from gallery:', error);
      setErrorMessage(error.message || 'Failed to remove photo from gallery');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };
  return (
    <div className='space-y-8'>
      {/* Success/Error Messages */}
      {successMessage && (
        <div className='bg-green-500/10 border border-green-500/30 rounded-lg p-4'>
          <div className='flex items-center gap-3'>
            <div className='text-green-400 text-xl'>✅</div>
            <p className='text-green-400'>{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-4'>
          <div className='flex items-center gap-3'>
            <div className='text-red-400 text-xl'>❌</div>
            <p className='text-red-400'>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Current Photos */}
      {currentPhotos.length > 0 && (
        <div className='bg-white/5 border border-white/10 p-6'>
          <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
            Current Photos ({currentPhotos.length})
          </h3>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {currentPhotos.map((photo, index) => (
              <div key={index} className='relative group'>
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className='w-full aspect-square object-cover rounded border border-white/20'
                  onError={e => {
                    e.currentTarget.src = '/images/artistNotFound.jpeg';
                  }}
                />
                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className='bg-red-500/80 text-white px-3 py-1 rounded text-sm hover:bg-red-500'
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Upload */}
      <div className='bg-white/5 border border-white/10 p-6'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Upload New Photos
        </h3>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-orange-500 bg-orange-500/10'
              : 'border-white/20 hover:border-white/40'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className='text-white/60 mb-4'>
            <svg
              className='w-12 h-12 mx-auto mb-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
              />
            </svg>
            <p className='text-lg font-semibold'>Drag & Drop Photos Here</p>
            <p className='text-sm'>or click to browse</p>
          </div>
          <input
            type='file'
            accept='image/*'
            multiple
            onChange={e => handleFileSelect(e.target.files)}
            disabled={uploading}
            className='hidden'
            id='gallery-upload'
          />
          <label
            htmlFor='gallery-upload'
            className='bg-orange-500 text-black px-6 py-3 rounded font-semibold hover:bg-orange-600 transition-colors cursor-pointer inline-block'
          >
            {uploading ? 'Uploading...' : 'Choose Files'}
          </label>
          <p className='text-white/50 text-xs mt-2'>JPG, PNG up to 5MB each</p>

          {error && <div className='text-red-400 text-sm mt-2'>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default GalleryTab;
