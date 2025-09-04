import { useState } from 'react';

const MusicTab = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<
    'youtube' | 'soundcloud' | 'spotify'
  >('youtube');
  const [embedUrl, setEmbedUrl] = useState('');

  const platforms = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'soundcloud', label: 'SoundCloud' },
    { value: 'spotify', label: 'Spotify' },
  ];

  return (
    <div className='space-y-8'>
      {/* Music Embeds */}
      <div className='bg-white/5 border border-white/10 p-6'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Music Embeds
        </h3>

        <div className='space-y-4'>
          {/* Platform Dropdown */}
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Select Platform
            </label>
            <select
              value={selectedPlatform}
              onChange={e =>
                setSelectedPlatform(
                  e.target.value as 'youtube' | 'soundcloud' | 'spotify'
                )
              }
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500'
            >
              {platforms.map(platform => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
          </div>

          {/* Link Input */}
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              {selectedPlatform === 'youtube' && 'YouTube Video URL'}
              {selectedPlatform === 'soundcloud' && 'SoundCloud Track URL'}
              {selectedPlatform === 'spotify' && 'Spotify Track URL'}
            </label>
            <input
              type='url'
              value={embedUrl}
              onChange={e => setEmbedUrl(e.target.value)}
              placeholder={
                selectedPlatform === 'youtube'
                  ? 'https://www.youtube.com/watch?v=...'
                  : selectedPlatform === 'soundcloud'
                    ? 'https://soundcloud.com/...'
                    : 'https://open.spotify.com/track/...'
              }
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500'
            />
            <p className='text-white/50 text-xs mt-1'>
              {selectedPlatform === 'youtube' &&
                'Add your best performance video'}
              {selectedPlatform === 'soundcloud' &&
                'Link to your SoundCloud track'}
              {selectedPlatform === 'spotify' && 'Link to your Spotify track'}
            </p>
          </div>

          {/* Add Button */}
          <div className='flex justify-end'>
            <button className='bg-orange-500 text-black px-6 py-3 font-semibold hover:bg-orange-600 transition-colors'>
              Add Embed
            </button>
          </div>
        </div>
      </div>

      {/* Current Embeds */}
      <div className='bg-white/5 border border-white/10 p-6'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Current Embeds
        </h3>

        <div className='space-y-4'>
          {/* Example embed items */}
          <div className='flex items-center justify-between p-4 bg-white/5 border border-white/10'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-orange-500/20 flex items-center justify-center'>
                <span className='text-orange-500 text-xl'>▶</span>
              </div>
              <div>
                <p className='text-white font-semibold'>Featured Track</p>
                <p className='text-white/60 text-sm'>YouTube • 2.1M views</p>
              </div>
            </div>
            <div className='flex gap-2'>
              <button className='text-red-400 hover:text-red-300 px-3 py-1 text-sm border border-red-500/40 hover:border-red-500/60 transition-colors'>
                Remove
              </button>
            </div>
          </div>

          <div className='flex items-center justify-between p-4 bg-white/5 border border-white/10'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-orange-500/20 flex items-center justify-center'>
                <span className='text-orange-500 text-xl'>♪</span>
              </div>
              <div>
                <p className='text-white font-semibold'>Latest Single</p>
                <p className='text-white/60 text-sm'>Spotify • 500K plays</p>
              </div>
            </div>
            <div className='flex gap-2'>
              <button className='text-red-400 hover:text-red-300 px-3 py-1 text-sm border border-red-500/40 hover:border-red-500/60 transition-colors'>
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicTab;
