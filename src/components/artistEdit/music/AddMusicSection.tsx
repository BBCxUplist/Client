import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useImageUpload } from '@/hooks/useImageUpload';

interface AddMusicSectionProps {
  onAddEmbed: (platform: string, url: string) => void;
  onAddCustomTrack: (title: string, url: string) => void;
}

const AddMusicSection = ({
  onAddEmbed,
  onAddCustomTrack,
}: AddMusicSectionProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<
    'youtube' | 'soundcloud' | 'spotify' | 'custom'
  >('youtube');
  const [embedUrl, setEmbedUrl] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioTitle, setAudioTitle] = useState('');
  const [urlError, setUrlError] = useState('');

  const {
    uploading,
    error: uploadError,
    handleFileUpload,
    reset,
  } = useImageUpload();

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
    if (!embedUrl.trim()) return;

    // Validate URL
    if (!validateUrl(embedUrl.trim(), selectedPlatform)) {
      setUrlError(
        `Please enter a valid ${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} URL`
      );
      return;
    }

    setUrlError('');
    onAddEmbed(selectedPlatform, embedUrl.trim());
    setEmbedUrl('');
  };

  const handleAudioUpload = async () => {
    if (!audioFile || !audioTitle.trim()) return;

    try {
      console.log('Uploading audio file:', audioFile);

      // Upload the audio file using the hook
      const result = await handleFileUpload(audioFile, 'artist');

      if (result.success && result.url) {
        onAddCustomTrack(audioTitle.trim(), result.url);
        setAudioFile(null);
        setAudioTitle('');
        reset();
        console.log('Upload complete:', result.url);
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handlePlatformChange = (value: any) => {
    setSelectedPlatform(value);
    setEmbedUrl('');
    setAudioFile(null);
    setAudioTitle('');
    setUrlError('');
  };

  return (
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
          <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
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
              <label className='block text-white/70 text-sm mb-2'>
                Track Title *
              </label>
              <input
                type='text'
                value={audioTitle}
                onChange={e => setAudioTitle(e.target.value)}
                placeholder='Enter track title...'
                className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              />
            </div>
            <div>
              <label className='block text-white/70 text-sm mb-3'>
                Upload Audio File *
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
                      <p className='text-white font-medium'>{audioFile.name}</p>
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
                        if (file) {
                          setAudioFile(file);
                          reset();
                        }
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

                {/* Upload Error */}
                {uploadError && (
                  <div className='text-red-400 text-sm flex items-center gap-2'>
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
                    {uploadError}
                  </div>
                )}

                {/* Upload Button */}
                {audioFile && (
                  <div className='flex justify-end'>
                    <button
                      onClick={handleAudioUpload}
                      disabled={uploading || !audioTitle.trim()}
                      className='bg-orange-500 text-black px-6 py-3 font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                    >
                      {uploading && (
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
                      {uploading ? 'Uploading...' : 'Add Track'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMusicSection;
