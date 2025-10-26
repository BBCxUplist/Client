import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useGetFeaturedArtist } from '@/hooks/generic/useGetFeaturedArtist';
import type { Artist } from '@/types/api';

const FeaturedArtist = () => {
  const { data, isLoading, error } = useGetFeaturedArtist();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  if (isLoading) {
    return (
      <div
        id='featured-artists'
        className='w-full p-6 md:p-8 lg:p-10 border-t border-dashed border-white'
      >
        <div className='max-w-7xl mx-auto'>
          <h2 className='font-bold text-white text-4xl md:text-5xl lg:text-7xl mb-8 md:mb-12'>
            Featured Artists
          </h2>

          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8'>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className='relative group'>
                <div className='relative mb-4 overflow-hidden'>
                  <div className='w-full aspect-[9/16] bg-neutral-700/50 animate-pulse rounded'></div>
                </div>

                <div className='p-4 absolute bottom-4 left-0 right-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent'>
                  <div className='h-8 bg-neutral-600 animate-pulse rounded mb-2'></div>

                  <div className='flex flex-wrap gap-2'>
                    <div className='h-6 w-16 bg-neutral-600 animate-pulse rounded'></div>
                    <div className='h-6 w-20 bg-neutral-600 animate-pulse rounded'></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        id='featured-artists'
        className='w-full p-6 md:p-8 lg:p-10 border-t border-dashed border-white'
      >
        <div className='max-w-7xl mx-auto'>
          <h2 className='font-bold text-white text-4xl md:text-5xl lg:text-7xl mb-8 md:mb-12'>
            Featured Artists
          </h2>
          <div className='text-red-400 text-center'>
            Error loading featured artists
          </div>
        </div>
      </div>
    );
  }

  const artists = data?.data.artists || [];

  // Pagination calculations
  const totalPages = Math.ceil(artists.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArtists = artists.slice(startIndex, endIndex);
  const showPagination = artists.length > ITEMS_PER_PAGE;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to featured artists section
    document
      .getElementById('featured-artists')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      id='featured-artists'
      className='w-full p-6 md:p-8 lg:p-10 border-t border-dashed border-white'
    >
      <div className='max-w-7xl mx-auto'>
        <h2 className='font-bold text-white text-4xl md:text-5xl lg:text-7xl mb-8 md:mb-12'>
          Featured Artists
        </h2>

        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8'>
          {currentArtists.map((artist: Artist) => (
            <Link
              key={artist.id}
              to={`/artist/${artist.username}`}
              className='relative group'
            >
              <div className='relative mb-4 overflow-hidden'>
                <img
                  src={artist.avatar || '/images/artistNotFound.jpeg'}
                  alt={artist.displayName || 'Artist'}
                  draggable={false}
                  onError={e => {
                    e.currentTarget.src = '/images/artistNotFound.jpeg';
                  }}
                  className='w-full aspect-[9/16] object-cover group-hover:scale-105 transition-transform duration-300'
                />
              </div>

              <div className='p-4 absolute bottom-4 left-0 right-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent'>
                <h3 className='text-3xl font-semibold text-white mb-2 truncate font-mondwest'>
                  {artist.displayName}
                </h3>

                <div className='flex flex-wrap gap-2'>
                  {artist.genres
                    .slice(0, 2)
                    .map((genre: string, index: number) => (
                      <span
                        key={index}
                        className='bg-white/20 text-white px-3 py-1 text-sm'
                      >
                        {genre}
                      </span>
                    ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {showPagination && (
          <div className='flex justify-center items-center gap-2 mt-8 md:mt-12'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='px-4 py-2 bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              Previous
            </button>

            <div className='flex gap-2'>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 transition-colors ${
                    currentPage === page
                      ? 'bg-white text-black font-bold'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='px-4 py-2 bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedArtist;
