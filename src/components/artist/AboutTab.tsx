import { motion } from 'framer-motion';
import type { AboutTabData } from '../../types/tabs';

interface AboutTabProps {
  artist: AboutTabData;
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
        {artist?.bio ? (
          <p className='text-white/80 leading-relaxed text-base md:text-lg max-w-4xl'>
            {artist.bio}
          </p>
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
    </motion.div>
  );
};

export default AboutTab;
