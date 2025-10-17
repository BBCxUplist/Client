import { useState } from 'react';

interface MusicLibraryProps {
  embeds: {
    youtube?: string[];
    soundcloud?: string[];
    spotify?: string[];
    custom?: { title: string; url: string }[];
  };
  onRemoveEmbed: (platform: string, index: number) => void;
}

const MusicLibrary = ({ embeds, onRemoveEmbed }: MusicLibraryProps) => {
  const [activeLibraryTab, setActiveLibraryTab] = useState<
    'youtube' | 'soundcloud' | 'spotify' | 'custom'
  >('youtube');

  const totalTracks = Object.values(embeds).reduce((acc, embedArray) => {
    if (Array.isArray(embedArray)) {
      return acc + embedArray.length;
    }
    return acc;
  }, 0);

  const libraryTabs = [
    {
      value: 'youtube',
      label: 'YouTube',
      icon: '/icons/embeds/youtube.png',
      count: embeds.youtube?.length || 0,
    },
    {
      value: 'spotify',
      label: 'Spotify',
      icon: '/icons/embeds/spotify.png',
      count: embeds.spotify?.length || 0,
    },
    {
      value: 'soundcloud',
      label: 'SoundCloud',
      icon: '/icons/embeds/soundcloud.png',
      count: embeds.soundcloud?.length || 0,
    },
    {
      value: 'custom',
      label: 'Your Own',
      icon: null,
      count: embeds.custom?.length || 0,
    },
  ];

  const currentTabEmbeds =
    embeds[activeLibraryTab as keyof typeof embeds] || [];

  const getPlatformIcon = (platform: string) => {
    if (platform === 'custom') {
      return (
        <svg
          className='w-6 h-6 text-orange-400'
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
    return (
      <img
        src={`/icons/embeds/${platform}.png`}
        alt={platform}
        className='w-6 h-6'
      />
    );
  };

  // Helper function to get track display info
  const getTrackDisplayInfo = (item: any, platform: string) => {
    if (platform === 'custom') {
      if (typeof item === 'object' && item !== null) {
        return {
          title: item.title || '',
          url: item.url || '',
          hasTitle: true,
        };
      } else {
        // Fallback for old string format
        return {
          title: '',
          url: item || '',
          hasTitle: false,
        };
      }
    } else {
      // Other platforms use string URLs
      return {
        title: '',
        url: item || '',
        hasTitle: false,
      };
    }
  };

  return (
    <div className='bg-white/5 border border-white/10 p-6 hover:bg-white/[0.07] transition-colors'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-semibold text-white font-mondwest'>
          Music Library
        </h3>
        <span className='text-white/60 text-sm'>
          {totalTracks} {totalTracks === 1 ? 'track' : 'tracks'}
        </span>
      </div>

      {/* Library Tabs */}
      <div className='flex gap-2 mb-6 border-b border-white/10 overflow-x-auto'>
        {libraryTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveLibraryTab(tab.value as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
              activeLibraryTab === tab.value
                ? 'text-orange-400 border-orange-500'
                : 'text-white/60 border-transparent hover:text-white/80'
            }`}
          >
            {tab.icon ? (
              <img src={tab.icon} alt={tab.label} className='w-4 h-4' />
            ) : (
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
            )}
            {tab.label}
            {tab.count > 0 && (
              <span className='bg-white/10 text-white/70 text-xs px-2 py-0.5 rounded-full'>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className='space-y-3'>
        {currentTabEmbeds.length === 0 ? (
          <div className='text-center py-12'>
            <div className='w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4'>
              {getPlatformIcon(activeLibraryTab)}
            </div>
            <p className='text-white/60 text-lg mb-1'>
              No {libraryTabs.find(t => t.value === activeLibraryTab)?.label}{' '}
              tracks yet
            </p>
            <p className='text-white/40 text-sm'>
              Add your first track from the section above
            </p>
          </div>
        ) : (
          currentTabEmbeds.map((item, index) => {
            const trackInfo = getTrackDisplayInfo(item, activeLibraryTab);

            return (
              <div
                key={index}
                className='group relative flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all rounded'
              >
                {/* Icon */}
                <div className='w-10 h-10 bg-orange-500/20 flex items-center justify-center rounded flex-shrink-0'>
                  {getPlatformIcon(activeLibraryTab)}
                </div>

                {/* Content */}
                <div className='flex-1 min-w-0'>
                  {trackInfo.hasTitle && trackInfo.title && (
                    <p className='text-white font-medium text-sm mb-1'>
                      {trackInfo.title}
                    </p>
                  )}
                  <p className='text-white/70 text-xs truncate'>
                    {trackInfo.url}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveEmbed(activeLibraryTab, index)}
                  className='text-white/40 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all'
                  title='Remove track'
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MusicLibrary;
