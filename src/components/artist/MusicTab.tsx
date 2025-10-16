import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import EmbedPlayer from './EmbedPlayer';

interface MusicTabProps {
  artist: {
    embeds?: {
      spotify?: string[];
      youtube?: string[];
      soundcloud?: string[];
      custom?: string[];
    };
    playlists?: Array<{
      id: string;
      title: string;
      items: Array<{
        id: string;
        title: string;
        platform: string;
        url: string;
      }>;
    }>;
  };
}

const MusicTab = ({ artist }: MusicTabProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<
    'spotify' | 'soundcloud' | 'youtube' | 'custom' | 'playlist'
  >('spotify');

  // Use real artist data from API - always ensure arrays
  const musicData = useMemo(
    () => ({
      spotify: artist.embeds?.spotify || [],
      soundcloud: artist.embeds?.soundcloud || [],
      youtube: artist.embeds?.youtube || [],
      custom: artist.embeds?.custom || [],
      playlists: artist.playlists || [],
    }),
    [artist.embeds, artist.playlists]
  );

  const getPlatformIcon = (platform: string) => {
    if (platform === 'playlist') {
      return (
        <svg
          className='w-4 h-4 text-orange-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
          />
        </svg>
      );
    }
    return `/icons/embeds/${platform}.png`;
  };

  const getAvailablePlatforms = () => {
    const platforms: Array<
      'spotify' | 'soundcloud' | 'youtube' | 'custom' | 'playlist'
    > = [];
    if (musicData.spotify.length > 0) platforms.push('spotify');
    if (musicData.soundcloud.length > 0) platforms.push('soundcloud');
    if (musicData.youtube.length > 0) platforms.push('youtube');
    if (musicData.custom.length > 0) platforms.push('custom');
    if (musicData.playlists.length > 0) platforms.push('playlist');
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
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <img
            src='/icons/empty/music.svg'
            alt='No music available'
            className='w-24 h-24 mb-4 opacity-50'
          />
          <p className='text-white/60 text-lg'>No music data available</p>
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
              {platform === 'playlist' ? (
                <div className='w-4 h-4 mr-2 flex items-center justify-center'>
                  {getPlatformIcon(platform)}
                </div>
              ) : (
                <img
                  src={getPlatformIcon(platform)}
                  alt={platform}
                  className='w-4 h-4 mr-2'
                />
              )}
              {platform.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* All Tracks as Embedded Players */}
      <div className='space-y-6'>
        {selectedPlatform === 'playlist' ? (
          // Playlist Display
          musicData.playlists.length > 0 ? (
            musicData.playlists.map((playlist, playlistIndex) => (
              <div
                key={`playlist-${playlistIndex}`}
                className='bg-white/5 p-4 border border-white/10'
              >
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-6 h-6 flex items-center justify-center'>
                    {getPlatformIcon('playlist')}
                  </div>
                  <h4 className='text-white font-semibold text-lg'>
                    {playlist.title}
                  </h4>
                  <span className='text-white/60 text-sm'>
                    ({playlist.items.length} tracks)
                  </span>
                </div>
                <div className='space-y-4'>
                  {playlist.items.map((item, itemIndex) => (
                    <div
                      key={`${playlistIndex}-${itemIndex}`}
                      className='bg-white/5 p-3 border border-white/10'
                    >
                      <div className='flex items-center gap-3 mb-2'>
                        <img
                          src={getPlatformIcon(item.platform)}
                          alt={item.platform}
                          className='w-4 h-4'
                        />
                        <span className='text-white/80 text-sm font-medium'>
                          Track {itemIndex + 1}
                        </span>
                      </div>
                      <div
                        className={
                          item.platform === 'youtube'
                            ? 'max-w-2xl'
                            : 'max-w-4xl'
                        }
                      >
                        <EmbedPlayer
                          url={item.url}
                          platform={
                            item.platform as
                              | 'spotify'
                              | 'soundcloud'
                              | 'youtube'
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <img
                src='/icons/empty/music.svg'
                alt='No playlists available'
                className='w-24 h-24 mb-4 opacity-50'
              />
              <p className='text-white/60 text-lg'>No playlists available</p>
            </div>
          )
        ) : Array.isArray(currentPlatformTracks) &&
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
                  Track {index + 1}
                </h4>
              </div>
              <div
                className={
                  selectedPlatform === 'youtube' ? 'max-w-2xl' : 'max-w-4xl'
                }
              >
                <EmbedPlayer url={embedUrl} platform={selectedPlatform} />
              </div>
            </div>
          ))
        ) : availablePlatforms.length > 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <img
              src='/icons/empty/music.svg'
              alt='No tracks available'
              className='w-24 h-24 mb-4 opacity-50'
            />
            <p className='text-white/60 text-lg'>
              No tracks available on {selectedPlatform}
            </p>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <img
              src='/icons/empty/music.svg'
              alt='No tracks available'
              className='w-24 h-24 mb-4 opacity-50'
            />
            <p className='text-white/60 text-lg'>No tracks available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MusicTab;
