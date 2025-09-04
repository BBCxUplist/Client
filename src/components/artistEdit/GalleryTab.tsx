import type { Artist } from '@/types';

interface GalleryTabProps {
  artist: Artist;
}

const GalleryTab = ({ artist }: GalleryTabProps) => {
  return (
    <div className='space-y-8'>
      {/* Current Photos */}
      <div className='bg-white/5 border border-white/10 p-6'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Current Photos
        </h3>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {artist.photos?.slice(0, 8).map((photo, index) => (
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
                <button className='bg-red-500/80 text-white px-3 py-1 rounded text-sm hover:bg-red-500'>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Upload */}
      <div className='bg-white/5 border border-white/10 p-6'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Upload New Photos
        </h3>

        <div className='border-2 border-dashed border-white/20 rounded-lg p-8 text-center'>
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
          <button className='bg-orange-500 text-black px-6 py-3 rounded font-semibold hover:bg-orange-600 transition-colors'>
            Choose Files
          </button>
          <p className='text-white/50 text-xs mt-2'>JPG, PNG up to 10MB each</p>
        </div>
      </div>
    </div>
  );
};

export default GalleryTab;
