import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { Music } from 'lucide-react';
import EmbedPlayer from './EmbedPlayer';
import CustomTrack from './CustomTrack';
import PlaylistCard from './PlaylistCard';

interface MusicTabProps {
  artist: {
    embeds?: {
      spotify?: string[];
      youtube?: string[];
      soundcloud?: string[];
      custom?: { title: string; url: string }[];
    };
    playlists?: Array<{
      id: string;
      artistId: string;
      isActive: boolean;
      thumbnailUrl?: string;
      title: string;
      description?: string;
      saves: number;
      listens: number;
      embeds: {
        youtube?: string[];
        spotify?: string[];
        soundcloud?: string[];
        custom?: { title: string; url: string }[];
      };
      createdAt: string;
      updatedAt: string;
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

  const getPlatformIcon = (platform: string, isSelected: boolean = false) => {
    const iconColor = isSelected ? 'text-black' : 'text-white';

    if (platform === 'playlist' || platform === 'custom') {
      return <Music className={`w-4 h-4 ${iconColor}`} />;
    }
    return `/icons/embeds/${platform}.png`;
  };

  const getPlatformIconSrc = (platform: string) => {
    if (platform === 'playlist' || platform === 'custom') {
      return null; // These use SVG elements, not images
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
    if (selectedPlatform === 'playlist') {
      return musicData.playlists;
    }
    const tracks = musicData[selectedPlatform as keyof typeof musicData];

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
              className={`px-4 py-2 text-sm font-semibold transition-all duration-300 border flex ${
                selectedPlatform === platform
                  ? 'bg-white text-black '
                  : 'text-white border-white/30 hover:border-white/60'
              }`}
            >
              {platform === 'playlist' || platform === 'custom' ? (
                <div className='w-4 h-4 mr-2 flex items-center justify-center'>
                  {getPlatformIcon(platform, selectedPlatform === platform)}
                </div>
              ) : (
                <img
                  src={getPlatformIconSrc(platform) || ''}
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
      <div
        className={`grid grid-cols-1 gap-4 ${selectedPlatform === 'playlist' ? 'md:grid-cols-1' : 'md:grid-cols-2'}`}
      >
        {selectedPlatform === 'playlist' ? (
          // Playlist Display
          musicData.playlists.length > 0 ? (
            musicData.playlists.map((playlist, playlistIndex) => (
              <PlaylistCard
                key={`playlist-${playlistIndex}`}
                playlist={playlist}
                playlistIndex={playlistIndex}
                getPlatformIconSrc={getPlatformIconSrc}
              />
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
          currentPlatformTracks.map((track, index) => {
            // Handle both string and object formats for custom tracks
            const isCustomTrack =
              selectedPlatform === 'custom' && typeof track === 'object';
            const trackUrl = isCustomTrack
              ? (track as { title: string; url: string }).url
              : (track as string);
            const trackTitle = isCustomTrack
              ? (track as { title: string; url: string }).title
              : `Track ${index + 1}`;

            return (
              <div key={`${selectedPlatform}-${index}`}>
                {isCustomTrack ? (
                  <CustomTrack
                    trackUrl={trackUrl}
                    trackTitle={trackTitle}
                    index={index}
                  />
                ) : (
                  <div
                    className={
                      selectedPlatform === 'youtube' ? 'max-w-2xl' : 'w-full'
                    }
                  >
                    <EmbedPlayer
                      url={trackUrl}
                      platform={
                        selectedPlatform as 'spotify' | 'soundcloud' | 'youtube'
                      }
                    />
                  </div>
                )}
              </div>
            );
          })
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
