import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MusicTabProps {
  formData?: {
    embeds?: {
      youtube?: string[];
      soundcloud?: string[];
      spotify?: string[];
      custom?: string[];
    };
  };
  handleInputChange?: (field: string, value: any) => void;
}

const MusicTab = ({ formData, handleInputChange }: MusicTabProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<
    'youtube' | 'soundcloud' | 'spotify' | 'custom'
  >('youtube');
  const [embedUrl, setEmbedUrl] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [activeLibraryTab, setActiveLibraryTab] = useState<
    'youtube' | 'soundcloud' | 'spotify' | 'custom'
  >('youtube');

  const platforms = [
    { value: 'youtube', label: 'YouTube', icon: '/icons/embeds/youtube.png' },
    {
      value: 'soundcloud',
      label: 'SoundCloud',
      icon: '/icons/embeds/soundcloud.png',
    },
    { value: 'spotify', label: 'Spotify', icon: '/icons/embeds/spotify.png' },
    { value: 'custom', label: 'Upload Your Own', icon: null },
  ];

  const currentEmbeds = formData?.embeds || {
    youtube: [],
    soundcloud: [],
    spotify: [],
    custom: [],
  };

  // URL Validation Functions
  const validateYouTubeUrl = (url: string): boolean => {
    const patterns = [
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]+/,
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  const validateSpotifyUrl = (url: string): boolean => {
    const patterns = [
      /^(https?:\/\/)?open\.spotify\.com\/(track|album|playlist|artist)\/[\w]+/,
      /^spotify:(track|album|playlist|artist):[\w]+$/,
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  const validateSoundCloudUrl = (url: string): boolean => {
    const patterns = [
      /^(https?:\/\/)?(www\.)?(soundcloud\.com|snd\.sc)\/.+/,
      /^(https?:\/\/)?soundcloud\.com\/[\w-]+\/[\w-]+/,
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  const validateUrl = (url: string, platform: string): boolean => {
    switch (platform) {
      case 'youtube':
        return validateYouTubeUrl(url);
      case 'spotify':
        return validateSpotifyUrl(url);
      case 'soundcloud':
        return validateSoundCloudUrl(url);
      default:
        return false;
    }
  };

  const handleAddEmbed = () => {
    if (!embedUrl.trim() || !handleInputChange) return;

    // Validate URL
    if (!validateUrl(embedUrl.trim(), selectedPlatform)) {
      setUrlError(
        `Please enter a valid ${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} URL`
      );
      return;
    }

    setUrlError('');
    const currentPlatformEmbeds = currentEmbeds[selectedPlatform] || [];
    const updatedEmbeds = [...currentPlatformEmbeds, embedUrl.trim()];

    handleInputChange('embeds', {
      ...currentEmbeds,
      [selectedPlatform]: updatedEmbeds,
    });

    setEmbedUrl('');
  };

  const handleAudioUpload = async () => {
    if (!audioFile) return;

    setUploadProgress(true);
    console.log('Uploading audio file:', audioFile);

    // Simulate upload - replace with actual upload logic
    setTimeout(() => {
      const mockUploadedUrl = `uploaded/${audioFile.name}`;

      const currentCustomEmbeds = currentEmbeds.custom || [];
      const updatedEmbeds = [...currentCustomEmbeds, mockUploadedUrl];

      handleInputChange?.('embeds', {
        ...currentEmbeds,
        custom: updatedEmbeds,
      });

      setAudioFile(null);
      setUploadProgress(false);
      console.log('Upload complete:', mockUploadedUrl);
    }, 2000);
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

  const totalTracks = Object.values(currentEmbeds).reduce(
    (acc, embeds) => acc + (embeds?.length || 0),
    0
  );

  const libraryTabs = [
    {
      value: 'youtube',
      label: 'YouTube',
      icon: '/icons/embeds/youtube.png',
      count: currentEmbeds.youtube?.length || 0,
    },
    {
      value: 'spotify',
      label: 'Spotify',
      icon: '/icons/embeds/spotify.png',
      count: currentEmbeds.spotify?.length || 0,
    },
    {
      value: 'soundcloud',
      label: 'SoundCloud',
      icon: '/icons/embeds/soundcloud.png',
      count: currentEmbeds.soundcloud?.length || 0,
    },
    {
      value: 'custom',
      label: 'Your Own',
      icon: null,
      count: currentEmbeds.custom?.length || 0,
    },
  ];

  const currentTabEmbeds =
    currentEmbeds[activeLibraryTab as keyof typeof currentEmbeds] || [];

  // Check if currently adding to the active tab
  const isAddingToActiveTab =
    selectedPlatform === activeLibraryTab && (embedUrl.trim() || audioFile);

  return (
    <div className='space-y-8'>
      {/* Add Music Section */}
      <div className='bg-white/5 border border-white/10 p-6 hover:bg-white/[0.07] transition-colors'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Add Music
        </h3>

        <div className='space-y-6'>
          {/* Platform Selector */}
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Select Platform
            </label>
            <Select
              value={selectedPlatform}
              onValueChange={(value: any) => {
                setSelectedPlatform(value);
                setEmbedUrl('');
                setAudioFile(null);
                setUrlError('');
              }}
            >
              <SelectTrigger className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 hover:bg-white/[0.12]'>
                <SelectValue placeholder='Select a platform' />
              </SelectTrigger>
              <SelectContent className='bg-zinc-900 border-white/20'>
                {platforms.map(platform => (
                  <SelectItem
                    key={platform.value}
                    value={platform.value}
                    className='text-white hover:bg-white/10 focus:bg-white/10'
                  >
                    <div className='flex items-center gap-2'>
                      {platform.icon && (
                        <img
                          src={platform.icon}
                          alt={platform.label}
                          className='w-4 h-4'
                        />
                      )}
                      {!platform.icon && (
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
                            d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                          />
                        </svg>
                      )}
                      {platform.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* URL Input for Streaming Platforms */}
          {selectedPlatform !== 'custom' && (
            <div className='space-y-4'>
              <div>
                <label className='block text-white/70 text-sm mb-2'>
                  {selectedPlatform === 'youtube' && 'YouTube Video URL'}
                  {selectedPlatform === 'soundcloud' && 'SoundCloud Track URL'}
                  {selectedPlatform === 'spotify' && 'Spotify Track URL'}
                </label>
                <input
                  type='url'
                  value={embedUrl}
                  onChange={e => {
                    setEmbedUrl(e.target.value);
                    setUrlError('');
                  }}
                  placeholder={
                    selectedPlatform === 'youtube'
                      ? 'https://www.youtube.com/watch?v=...'
                      : selectedPlatform === 'soundcloud'
                        ? 'https://soundcloud.com/...'
                        : 'https://open.spotify.com/track/...'
                  }
                  className={`w-full bg-white/10 border ${urlError ? 'border-red-500' : 'border-white/20'} text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]`}
                />
                {urlError && (
                  <p className='text-red-400 text-xs mt-1 flex items-center gap-1'>
                    <svg
                      className='w-4 h-4'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {urlError}
                  </p>
                )}
                {!urlError && (
                  <p className='text-white/50 text-xs mt-1'>
                    {selectedPlatform === 'youtube' &&
                      'Paste the full YouTube URL (youtube.com or youtu.be)'}
                    {selectedPlatform === 'soundcloud' &&
                      'Paste the full SoundCloud track URL'}
                    {selectedPlatform === 'spotify' &&
                      'Paste the full Spotify track URL (open.spotify.com)'}
                  </p>
                )}
              </div>

              <div className='flex justify-end'>
                <button
                  onClick={handleAddEmbed}
                  disabled={!embedUrl.trim()}
                  className='bg-orange-500 text-black px-6 py-3 font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Add Track
                </button>
              </div>
            </div>
          )}

          {/* Audio File Upload for Custom */}
          {selectedPlatform === 'custom' && (
            <div className='space-y-4'>
              <div>
                <label className='block text-white/70 text-sm mb-3'>
                  Upload Audio File
                </label>
                <div className='space-y-4'>
                  {/* File Preview */}
                  {audioFile && (
                    <div className='flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded'>
                      <div className='w-12 h-12 bg-orange-500/20 flex items-center justify-center rounded'>
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
                      </div>
                      <div className='flex-1'>
                        <p className='text-white font-medium'>
                          {audioFile.name}
                        </p>
                        <p className='text-white/50 text-sm'>
                          {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setAudioFile(null)}
                        className='text-red-400 hover:text-red-300 p-2'
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
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Upload Area */}
                  {!audioFile && (
                    <div className='relative'>
                      <input
                        type='file'
                        id='audio-upload'
                        accept='audio/*,.mp3,.wav,.ogg,.m4a'
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) setAudioFile(file);
                        }}
                        className='hidden'
                      />
                      <label
                        htmlFor='audio-upload'
                        className='block w-full bg-white/10 border-2 border-dashed border-white/30 hover:border-orange-500/50 p-8 text-center cursor-pointer transition-all hover:bg-white/[0.12] group'
                      >
                        <div className='flex flex-col items-center gap-3'>
                          <div className='w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors'>
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
                                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                              />
                            </svg>
                          </div>
                          <div>
                            <p className='text-white font-medium mb-1'>
                              Click to upload or drag and drop
                            </p>
                            <p className='text-white/50 text-xs'>
                              MP3, WAV, OGG or M4A (max. 50MB)
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Upload Button */}
                  {audioFile && (
                    <div className='flex justify-end'>
                      <button
                        onClick={handleAudioUpload}
                        disabled={uploadProgress}
                        className='bg-orange-500 text-black px-6 py-3 font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                      >
                        {uploadProgress && (
                          <svg
                            className='animate-spin h-5 w-5'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                          >
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'
                            />
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            />
                          </svg>
                        )}
                        {uploadProgress ? 'Uploading...' : 'Add Track'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Music Library */}
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

        {/* New Song Being Added */}
        {isAddingToActiveTab && (
          <div className='mb-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-orange-500/20 flex items-center justify-center rounded'>
                {getPlatformIcon(activeLibraryTab)}
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-white/70 text-xs mb-1'>New Track</p>
                <p className='text-white text-sm truncate'>
                  {audioFile ? audioFile.name : embedUrl || 'Ready to add...'}
                </p>
              </div>
              <span className='text-orange-400 text-xs font-medium bg-orange-500/20 px-2 py-1 rounded'>
                Pending
              </span>
            </div>
          </div>
        )}

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
            currentTabEmbeds.map((url, index) => (
              <div
                key={index}
                className='group relative flex items-center gap-4 p-4 bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all rounded'
              >
                {/* Icon */}
                <div className='w-10 h-10 bg-orange-500/20 flex items-center justify-center rounded flex-shrink-0'>
                  {getPlatformIcon(activeLibraryTab)}
                </div>

                {/* URL */}
                <div className='flex-1 min-w-0'>
                  <p className='text-white/90 text-sm truncate'>{url}</p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveEmbed(activeLibraryTab, index)}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicTab;
