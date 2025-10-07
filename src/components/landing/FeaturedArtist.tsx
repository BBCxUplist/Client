import { Link } from 'react-router-dom';
import { useGetFeaturedArtist } from '@/hooks/generic/useGetFeaturedArtist';
import type { Artist } from '@/types/api';

const FeaturedArtist = () => {
  const { data, isLoading, error } = useGetFeaturedArtist();

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

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8'>
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

  return (
    <div
      id='featured-artists'
      className='w-full p-6 md:p-8 lg:p-10 border-t border-dashed border-white'
    >
      <div className='max-w-7xl mx-auto'>
        <h2 className='font-bold text-white text-4xl md:text-5xl lg:text-7xl mb-8 md:mb-12'>
          Featured Artists
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8'>
          {artists.map((artist: Artist) => (
            <Link
              key={artist.id}
              to={`/artist/${artist.username}`}
              className='relative group'
            >
              <div className='relative mb-4 overflow-hidden'>
                <img
                  src={artist.avatar}
                  alt={artist.displayName}
                  draggable={false}
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
      </div>
    </div>
  );
};

export default FeaturedArtist;
