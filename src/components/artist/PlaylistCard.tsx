import React, { useMemo } from 'react';
import EmbedPlayer from './EmbedPlayer';
import CustomTrack from './CustomTrack';

interface PlaylistCardProps {
  playlist: {
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
  };
  playlistIndex: number;
  getPlatformIconSrc: (platform: string) => string | null;
}

const PlaylistCard = React.memo(
  ({ playlist, playlistIndex }: PlaylistCardProps) => {
    // Memoize the tracks processing to avoid recalculation on every render
    const allTracks = useMemo(() => {
      const tracks: {
        platform: string;
        title: string;
        url: string;
      }[] = [];

      // Add YouTube tracks
      playlist.embeds.youtube?.forEach(url => {
        tracks.push({ platform: 'youtube', title: url, url });
      });

      // Add SoundCloud tracks
      playlist.embeds.soundcloud?.forEach(url => {
        tracks.push({
          platform: 'soundcloud',
          title: url,
          url,
        });
      });

      // Add Spotify tracks
      playlist.embeds.spotify?.forEach(url => {
        tracks.push({ platform: 'spotify', title: url, url });
      });

      // Add custom tracks
      playlist.embeds.custom?.forEach(track => {
        tracks.push({
          platform: 'custom',
          title: track.title,
          url: track.url,
        });
      });

      return tracks;
    }, [playlist.embeds]);

    // Memoize the total tracks count
    const totalTracks = useMemo(() => {
      return (
        (playlist.embeds.youtube?.length || 0) +
        (playlist.embeds.soundcloud?.length || 0) +
        (playlist.embeds.spotify?.length || 0) +
        (playlist.embeds.custom?.length || 0)
      );
    }, [playlist.embeds]);
    return (
      <div
        key={`playlist-${playlistIndex}`}
        className='bg-white/5 p-4 border border-white/10 rounded-lg'
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
              <h4 className='text-white font-medium text-lg'>
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
                {totalTracks} {totalTracks === 1 ? 'track' : 'tracks'}
              </span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {allTracks.map((track, itemIndex) => (
            <div
              key={`${playlistIndex}-${itemIndex}`}
              className='bg-white/5 p-3 border border-white/10 rounded-md'
            >
              <div>
                {track.platform === 'custom' ? (
                  <CustomTrack
                    trackUrl={track.url}
                    trackTitle={track.title}
                    index={itemIndex}
                  />
                ) : (
                  <EmbedPlayer
                    url={track.url}
                    platform={
                      track.platform as 'spotify' | 'soundcloud' | 'youtube'
                    }
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default PlaylistCard;
