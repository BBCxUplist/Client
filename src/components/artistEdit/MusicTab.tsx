import { useState } from 'react';

interface MusicTabProps {
  formData?: {
    embeds?: {
      youtube?: string[];
      soundcloud?: string[];
      spotify?: string[];
    };
  };
  handleInputChange?: (field: string, value: any) => void;
}

const MusicTab = ({ formData, handleInputChange }: MusicTabProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<
    'youtube' | 'soundcloud' | 'spotify'
  >('youtube');
  const [embedUrl, setEmbedUrl] = useState('');

  const platforms = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'soundcloud', label: 'SoundCloud' },
    { value: 'spotify', label: 'Spotify' },
  ];

  const currentEmbeds = formData?.embeds || {
    youtube: [],
    soundcloud: [],
    spotify: [],
  };

  const handleAddEmbed = () => {
    if (!embedUrl.trim() || !handleInputChange) return;

    const currentPlatformEmbeds = currentEmbeds[selectedPlatform] || [];
    const updatedEmbeds = [...currentPlatformEmbeds, embedUrl.trim()];

    handleInputChange('embeds', {
      ...currentEmbeds,
      [selectedPlatform]: updatedEmbeds,
    });

    setEmbedUrl('');
  };

  const handleRemoveEmbed = (platform: string, index: number) => {
    if (!handleInputChange) return;

    const currentPlatformEmbeds =
      currentEmbeds[platform as keyof typeof currentEmbeds] || [];
    const updatedEmbeds = currentPlatformEmbeds.filter((_, i) => i !== index);

    handleInputChange('embeds', {
      ...currentEmbeds,
      [platform]: updatedEmbeds,
    });
  };

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
            <button
              onClick={handleAddEmbed}
              disabled={!embedUrl.trim()}
              className='bg-orange-500 text-black px-6 py-3 font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
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
          {Object.entries(currentEmbeds).map(([platform, embeds]) => {
            if (!embeds || embeds.length === 0) return null;

            return embeds.map((url, index) => (
              <div
                key={`${platform}-${index}`}
                className='flex items-center justify-between p-4 bg-white/5 border border-white/10'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 bg-orange-500/20 flex items-center justify-center'>
                    <img
                      src={`/icons/embeds/${platform}.png`}
                      alt={platform}
                      className='w-6 h-6'
                    />
                  </div>
                  <div>
                    <p className='text-white font-semibold'>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}{' '}
                      Track {index + 1}
                    </p>
                    <p className='text-white/60 text-sm truncate max-w-xs'>
                      {url}
                    </p>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => handleRemoveEmbed(platform, index)}
                    className='text-red-400 hover:text-red-300 px-3 py-1 text-sm border border-red-500/40 hover:border-red-500/60 transition-colors'
                  >
                    Remove
                  </button>
                </div>
              </div>
            ));
          })}

          {Object.values(currentEmbeds).every(
            embeds => !embeds || embeds.length === 0
          ) && (
            <div className='text-center py-8 text-white/60'>
              <p>No music embeds added yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicTab;
