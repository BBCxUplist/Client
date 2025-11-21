import { motion } from 'framer-motion';
import { ArtistSubscribeWidget } from '@/components/user/ArtistSubscribeForm';
import type { AboutTabData } from '../../types/tabs';

interface AboutTabProps {
  artist: AboutTabData & {
    location?: string;
  };
}

const AboutTab = ({ artist }: AboutTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-6 md:space-y-8'
    >
      <div>
        <h3 className='text-2xl md:text-3xl font-semibold text-orange-500 mb-4 font-mondwest'>
          About
        </h3>

        {/* Bio */}
        {artist?.bio ? (
          <div>
            <p className='text-white/80 leading-relaxed text-base md:text-lg max-w-4xl'>
              {artist.bio}
            </p>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <img
              src='/icons/empty/about.svg'
              alt='No about information'
              className='w-24 h-24 mb-4 opacity-50'
            />
            <p className='text-white/60 text-lg'>
              No biography available for this artist.
            </p>
          </div>
        )}
      </div>
      {/* Location */}
      {artist?.location && (
        <div className='mb-6'>
          <h3 className='text-2xl md:text-3xl font-semibold text-orange-500 mb-4 font-mondwest'>
            Location
          </h3>
          <p className='text-white/80 text-base md:text-lg'>
            {artist.location}
          </p>
        </div>
      )}

      {/* Newsletter Subscription */}
      {artist?.id && artist?.displayName && (
        <div className='mb-6'>
          <ArtistSubscribeWidget
            artistId={artist.id}
            artistName={artist.displayName}
            className='max-w-lg'
          />
        </div>
      )}
    </motion.div>
  );
};

export default AboutTab;
