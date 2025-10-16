import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/helper';

interface SavedArtistsTabProps {
  savedArtists: any[];
}

const SavedArtistsTab = ({ savedArtists }: SavedArtistsTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-6'
    >
      <h3 className='text-2xl font-semibold text-white font-mondwest'>
        Saved Artists
      </h3>

      {savedArtists.length > 0 ? (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6'>
          {savedArtists.map((artist: any) => (
            <div
              key={artist.id}
              className='bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-all duration-300 group'
            >
              {/* Artist Image - Square */}
              <Link to={`/artist/${artist.username}`} className='block mb-4'>
                <div className='relative overflow-hidden'>
                  <img
                    src={artist.avatar || '/images/artistNotFound.jpeg'}
                    alt={artist.displayName}
                    className='w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300'
                    onError={e => {
                      e.currentTarget.src = '/images/artistNotFound.jpeg';
                    }}
                  />
                </div>
              </Link>

              {/* Artist Information */}
              <div className='space-y-2'>
                {/* Name */}
                <Link to={`/artist/${artist.username}`}>
                  <h3 className='text-white font-semibold text-lg truncate font-mondwest group-hover:text-orange-400 transition-colors'>
                    {artist.displayName}
                  </h3>
                </Link>

                {/* Username */}
                <div className='flex items-center gap-2'>
                  <p className='text-white/60 text-sm'>@{artist.username}</p>
                  <img
                    src='/icons/badge.svg'
                    alt='Approved Artist'
                    className='w-4 h-4'
                  />
                </div>

                {/* Base Price */}
                <p className='text-orange-500 font-bold font-mondwest text-lg'>
                  {formatPrice(artist.basePrice)}
                </p>

                {/* Action Button */}
                <div className='pt-2'>
                  {artist.isBookable ? (
                    <Link to={`/artist/${artist.username}`}>
                      <button className='w-full bg-orange-500 text-black py-2 text-sm font-semibold hover:bg-orange-600 transition-colors'>
                        BOOK NOW
                      </button>
                    </Link>
                  ) : (
                    <button className='w-full bg-gray-500 text-white py-2 text-sm font-semibold cursor-not-allowed opacity-50'>
                      UNAVAILABLE
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <h3 className='text-xl font-semibold text-white mb-2'>
            No Saved Artists Yet
          </h3>
          <p className='text-white/60 mb-6'>
            Start exploring and save your favorite artists!
          </p>
          <Link to='/explore'>
            <button className='bg-orange-500 text-black px-6 py-3 font-semibold hover:bg-orange-600 transition-colors'>
              EXPLORE ARTISTS
            </button>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default SavedArtistsTab;
