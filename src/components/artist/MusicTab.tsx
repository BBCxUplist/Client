import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import EmbedPlayer from './EmbedPlayer';

interface MusicTabProps {
  artist: {
    embeds?: {
      spotify?: string[];
      youtube?: string[];
      soundcloud?: string[];
    };
  };
}

const MusicTab = ({ artist }: MusicTabProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<
    'youtube' | 'soundcloud' | 'spotify'
  >('youtube');

  // Use real artist data from API - always ensure arrays
  const musicData = useMemo(
    () => ({
      youtube: artist.embeds?.youtube || [],
      spotify: artist.embeds?.spotify || [],
      soundcloud: artist.embeds?.soundcloud || [],
    }),
    [artist.embeds]
  );

  const getPlatformIcon = (platform: string) => {
    return `/icons/embeds/${platform}.png`;
  };

  const getAvailablePlatforms = () => {
    const platforms: Array<'youtube' | 'soundcloud' | 'spotify'> = [];
    if (musicData.youtube.length > 0) platforms.push('youtube');
    if (musicData.spotify.length > 0) platforms.push('spotify');
    if (musicData.soundcloud.length > 0) platforms.push('soundcloud');
    return platforms;
  };

  const availablePlatforms = getAvailablePlatforms();
  const currentPlatformTracks = useMemo(() => {
    const tracks = musicData[selectedPlatform];

    // Force it to be an array
    if (!Array.isArray(tracks)) {
      console.warn(
        'Tracks is not an array, converting to empty array:',
        tracks
      );
      return [];
    }
    return tracks;
  }, [selectedPlatform, musicData]);

  // Auto-select first available platform if current selection has no tracks
  useEffect(() => {
    if (currentPlatformTracks.length === 0 && availablePlatforms.length > 0) {
      setSelectedPlatform(availablePlatforms[0]);
    }
  }, [currentPlatformTracks.length, availablePlatforms]);

  // Error boundary for the component
  if (!artist || !artist.embeds) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='space-y-6 md:space-y-8'
      >
        <h3 className='text-2xl md:text-3xl font-semibold text-orange-500 mb-6 font-mondwest'>
          Music & Tracks
        </h3>
        <div className='text-center py-8 text-white/60'>
          <p>No music data available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-6 md:space-y-8'
    >
      <h3 className='text-2xl md:text-3xl font-semibold text-orange-500 mb-6 font-mondwest'>
        Music & Tracks
      </h3>

      {/* Platform Toggle */}
      {availablePlatforms.length > 0 && (
        <div className='flex flex-wrap gap-2 mb-6'>
          {availablePlatforms.map(platform => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`px-4 py-2 text-sm font-semibold transition-all duration-300 border flex  ${
                selectedPlatform === platform
                  ? 'bg-orange-500 text-black border-orange-500'
                  : 'text-white border-white/30 hover:border-white/60'
              }`}
            >
              <img
                src={getPlatformIcon(platform)}
                alt={platform}
                className='w-4 h-4 mr-2'
              />
              {platform.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* All Tracks as Embedded Players */}
      <div className='space-y-6'>
        {Array.isArray(currentPlatformTracks) &&
        currentPlatformTracks.length > 0 ? (
          currentPlatformTracks.map((embedUrl, index) => (
            <div
              key={`${selectedPlatform}-${index}`}
              className='bg-white/5 p-4 border border-white/10'
            >
              <div className='flex items-center gap-3 mb-4'>
                <img
                  src={getPlatformIcon(selectedPlatform)}
                  alt={selectedPlatform}
                  className='w-6 h-6'
                />
                <h4 className='text-white font-semibold text-lg'>
                  {selectedPlatform.charAt(0).toUpperCase() +
                    selectedPlatform.slice(1)}{' '}
                  Track {index + 1}
                </h4>
              </div>
              <div className='max-w-4xl'>
                <EmbedPlayer url={embedUrl} platform={selectedPlatform} />
              </div>
            </div>
          ))
        ) : availablePlatforms.length > 0 ? (
          <div className='text-center py-8 text-white/60'>
            <p>No tracks available on {selectedPlatform}</p>
          </div>
        ) : (
          <div className='text-center py-8 text-white/60'>
            <p>No tracks available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MusicTab;
