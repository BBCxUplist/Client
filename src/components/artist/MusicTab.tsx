import { motion } from 'framer-motion';
import { useState, useMemo, useEffect, useRef } from 'react';
import EmbedPlayer from './EmbedPlayer';

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
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    if (platform === 'custom') {
      return (
        <svg
          className='w-4 h-4 text-white'
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

  const getPlatformIconSrc = (platform: string) => {
    if (platform === 'playlist' || platform === 'custom') {
      return null; // These use SVG elements, not images
    }
    return `/icons/embeds/${platform}.png`;
  };

  const handlePlayCustomTrack = (trackUrl: string, _trackTitle: string) => {
    if (playingTrack === trackUrl && isPlaying) {
      // Pause current track
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setPlayingTrack(null);
      }
    } else {
      // Play new track
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(trackUrl);
      audioRef.current = audio;

      audio.addEventListener('loadstart', () => {
        setIsPlaying(true);
        setPlayingTrack(trackUrl);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setPlayingTrack(null);
      });

      audio.addEventListener('error', () => {
        console.error('Error playing audio:', trackUrl);
        setIsPlaying(false);
        setPlayingTrack(null);
      });

      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        setPlayingTrack(null);
      });
    }
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

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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
              className={`px-4 py-2 text-sm font-semibold transition-all duration-300 border flex rounded ${
                selectedPlatform === platform
                  ? 'bg-orange-500 text-black border-orange-500'
                  : 'text-white border-white/30 hover:border-white/60'
              }`}
            >
              {platform === 'playlist' || platform === 'custom' ? (
                <div className='w-4 h-4 mr-2 flex items-center justify-center'>
                  {getPlatformIcon(platform)}
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
      <div className='space-y-6'>
        {selectedPlatform === 'playlist' ? (
          // Playlist Display
          musicData.playlists.length > 0 ? (
            musicData.playlists.map((playlist, playlistIndex) => (
              <div
                key={`playlist-${playlistIndex}`}
                className='bg-white/5 p-4 border border-white/10'
              >
                <div className='flex items-start gap-4 mb-4'>
                  {/* Playlist Thumbnail */}
                  {playlist.thumbnailUrl && (
                    <img
                      src={playlist.thumbnailUrl}
                      alt={playlist.title}
                      className='w-16 h-16 object-cover rounded border border-white/20 flex-shrink-0'
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}

                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <div className='w-6 h-6 flex items-center justify-center'>
                        {getPlatformIcon('playlist')}
                      </div>
                      <h4 className='text-white font-semibold text-lg'>
                        {playlist.title}
                      </h4>
                    </div>

                    {playlist.description && (
                      <p className='text-white/60 text-sm mb-2 line-clamp-2'>
                        {playlist.description}
                      </p>
                    )}

                    <div className='flex items-center gap-4 text-xs text-white/50'>
                      <span>
                        {(() => {
                          const totalTracks =
                            (playlist.embeds.youtube?.length || 0) +
                            (playlist.embeds.soundcloud?.length || 0) +
                            (playlist.embeds.spotify?.length || 0) +
                            (playlist.embeds.custom?.length || 0);
                          return `${totalTracks} ${totalTracks === 1 ? 'track' : 'tracks'}`;
                        })()}
                      </span>
                      <span>{playlist.saves} saves</span>
                      <span>{playlist.listens} listens</span>
                    </div>
                  </div>
                </div>
                <div className='space-y-4'>
                  {(() => {
                    // Convert API playlist structure to display format
                    const allTracks: {
                      platform: string;
                      title: string;
                      url: string;
                    }[] = [];

                    // Add YouTube tracks
                    playlist.embeds.youtube?.forEach(url => {
                      allTracks.push({ platform: 'youtube', title: url, url });
                    });

                    // Add SoundCloud tracks
                    playlist.embeds.soundcloud?.forEach(url => {
                      allTracks.push({
                        platform: 'soundcloud',
                        title: url,
                        url,
                      });
                    });

                    // Add Spotify tracks
                    playlist.embeds.spotify?.forEach(url => {
                      allTracks.push({ platform: 'spotify', title: url, url });
                    });

                    // Add custom tracks
                    playlist.embeds.custom?.forEach(track => {
                      allTracks.push({
                        platform: 'custom',
                        title: track.title,
                        url: track.url,
                      });
                    });

                    return allTracks.map((track, itemIndex) => (
                      <div
                        key={`${playlistIndex}-${itemIndex}`}
                        className='bg-white/5 p-3 border border-white/10'
                      >
                        <div className='flex items-center gap-3 mb-2'>
                          {track.platform === 'custom' ? (
                            <div className='w-4 h-4 flex items-center justify-center'>
                              {getPlatformIcon(track.platform)}
                            </div>
                          ) : (
                            <img
                              src={getPlatformIconSrc(track.platform) || ''}
                              alt={track.platform}
                              className='w-4 h-4'
                            />
                          )}
                          <span className='text-white/80 text-sm font-medium'>
                            {track.title}
                          </span>
                        </div>
                        <div
                          className={
                            track.platform === 'youtube'
                              ? 'max-w-2xl'
                              : 'max-w-4xl'
                          }
                        >
                          <EmbedPlayer
                            url={track.url}
                            platform={
                              track.platform === 'custom'
                                ? 'youtube'
                                : (track.platform as
                                    | 'spotify'
                                    | 'soundcloud'
                                    | 'youtube')
                            }
                          />
                        </div>
                      </div>
                    ));
                  })()}
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
              <div
                key={`${selectedPlatform}-${index}`}
                className={`bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 ${
                  isCustomTrack ? 'p-6 rounded-xl' : 'p-4'
                }`}
              >
                <div className='flex items-center gap-4 mb-4'>
                  {selectedPlatform === 'custom' ? (
                    <div className='w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center'>
                      {getPlatformIcon(selectedPlatform)}
                    </div>
                  ) : (
                    <img
                      src={getPlatformIconSrc(selectedPlatform) || ''}
                      alt={selectedPlatform}
                      className='w-6 h-6'
                    />
                  )}
                  <div className='flex-1'>
                    <h4 className='text-white font-semibold text-lg'>
                      {trackTitle}
                    </h4>
                    {isCustomTrack && (
                      <p className='text-white/60 text-sm mt-1'>
                        Custom Upload
                      </p>
                    )}
                  </div>
                  {isCustomTrack && (
                    <div className='flex items-center gap-2 text-orange-400 text-sm'>
                      <svg
                        className='w-4 h-4'
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
                      <span className='font-medium'>Audio Track</span>
                    </div>
                  )}
                </div>
                <div
                  className={
                    selectedPlatform === 'youtube' ? 'max-w-2xl' : 'max-w-4xl'
                  }
                >
                  {isCustomTrack ? (
                    <div className='flex items-center justify-center py-8'>
                      <button
                        onClick={() =>
                          handlePlayCustomTrack(trackUrl, trackTitle)
                        }
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                          playingTrack === trackUrl && isPlaying
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-orange-500 hover:bg-orange-600'
                        }`}
                      >
                        {playingTrack === trackUrl && isPlaying ? (
                          // Pause icon
                          <svg
                            className='w-8 h-8 text-black'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M6 4h4v16H6V4zm8 0h4v16h-4V4z' />
                          </svg>
                        ) : (
                          // Play icon
                          <svg
                            className='w-8 h-8 text-black ml-1'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path d='M8 5v14l11-7z' />
                          </svg>
                        )}
                      </button>
                    </div>
                  ) : (
                    <EmbedPlayer
                      url={trackUrl}
                      platform={
                        selectedPlatform === 'custom'
                          ? 'youtube'
                          : (selectedPlatform as
                              | 'spotify'
                              | 'soundcloud'
                              | 'youtube')
                      }
                    />
                  )}
                </div>
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
