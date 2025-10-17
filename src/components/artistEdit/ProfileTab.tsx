import type { Artist } from '@/types';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ProfileTabProps {
  artist: Artist;
  formData: {
    bio: string;
    displayName: string;
    username: string;
    avatar: string;
    phone: string;
    location: string;
    socials: {
      twitter: string;
      instagram: string;
      spotify: string;
      soundcloud: string;
      youtube: string;
    };
    genres: string[];
    price: number;
  };
  handleInputChange: (
    field: string,
    value: string | number | boolean | string[]
  ) => void;
  handleGenreChange: (tag: string, action: 'add' | 'remove') => void;
  handleSocialChange?: (platform: string, value: string) => void;
}

const ProfileTab = ({
  formData,
  handleInputChange,
  handleGenreChange,
  handleSocialChange,
}: ProfileTabProps) => {
  const { uploading, uploadedUrl, error, handleFileUpload, reset } =
    useImageUpload();

  return (
    <div className='space-y-8'>
      {/* Basic Information */}
      <div className='bg-white/5 border border-white/10 p-6 hover:bg-white/[0.07] transition-colors'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Basic Information
        </h3>

        <div className='space-y-4'>
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Username *
            </label>
            <input
              type='text'
              value={formData.username}
              onChange={e => {
                const value = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9._]/g, '');
                handleInputChange('username', value);
              }}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='Enter username (e.g., artistname)'
            />
            <p className='text-white/50 text-xs mt-1'>
              Username must be lowercase, no spaces, only letters, numbers, dots
              (.) and underscores (_)
            </p>
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Display Name
            </label>
            <input
              type='text'
              value={formData.displayName}
              onChange={e => handleInputChange('displayName', e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='Enter display name'
            />
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>Bio</label>
            <textarea
              value={formData.bio}
              onChange={e => handleInputChange('bio', e.target.value)}
              rows={4}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12] resize-none'
              placeholder='Tell us about yourself...'
            />
          </div>

          {/* Enhanced Profile Picture Upload */}
          <div>
            <label className='block text-white/70 text-sm mb-3'>
              Profile Picture
            </label>
            <div className='flex flex-col md:flex-row gap-6 items-start'>
              {/* Preview Section */}
              <div className='flex-shrink-0'>
                <div className='relative group'>
                  {uploadedUrl || formData.avatar ? (
                    <>
                      <div className='w-32 h-32 rounded-lg overflow-hidden border-2 border-white/20 group-hover:border-orange-500/50 transition-all'>
                        <img
                          src={uploadedUrl || formData.avatar}
                          alt='Profile preview'
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <button
                        type='button'
                        onClick={() => {
                          reset();
                          handleInputChange('avatar', '');
                        }}
                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-lg hover:bg-red-600 transition-all hover:scale-110 shadow-lg'
                        title='Remove image'
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div className='w-32 h-32 rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center bg-white/5'>
                      <svg
                        className='w-12 h-12 text-white/40'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1.5}
                          d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Section */}
              <div className='flex-1 space-y-3'>
                <div className='relative'>
                  <input
                    type='file'
                    id='profile-upload'
                    accept='image/*'
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const result = await handleFileUpload(file, 'artist');
                      if (result.success && result.url) {
                        handleInputChange('avatar', result.url);
                      }
                    }}
                    disabled={uploading}
                    className='hidden'
                  />
                  <label
                    htmlFor='profile-upload'
                    className={`block w-full bg-white/10 border-2 border-dashed border-white/30 hover:border-orange-500/50 p-8 text-center cursor-pointer transition-all hover:bg-white/[0.12] group ${
                      uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
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
                          {uploading
                            ? 'Uploading...'
                            : 'Click to upload or drag and drop'}
                        </p>
                        <p className='text-white/50 text-xs'>
                          JPG, PNG or GIF (max. 5MB)
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Error Message */}
                {error && (
                  <div className='flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded'>
                    <svg
                      className='w-4 h-4 flex-shrink-0'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Upload Progress */}
                {uploading && (
                  <div className='flex items-center gap-3 text-white/70 text-sm bg-white/5 border border-white/10 p-3 rounded'>
                    <svg
                      className='animate-spin h-4 w-4 text-orange-400'
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
                    Uploading your profile picture...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Phone Number
            </label>
            <input
              type='tel'
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='+1234567890'
            />
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>Location</label>
            <input
              type='text'
              value={formData.location}
              onChange={e => handleInputChange('location', e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='City, Country'
            />
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Booking Price (₹)
            </label>
            <input
              type='text'
              value={formData.price || ''}
              onChange={e => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                handleInputChange('price', parseInt(value) || 0);
              }}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='Enter booking price'
            />
          </div>
        </div>
      </div>

      {/* Genres */}
      <div className='bg-white/5 border border-white/10 p-6 hover:bg-white/[0.07] transition-colors'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Genres
        </h3>

        <div className='space-y-6'>
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Genres ({formData.genres.length})
            </label>
            <div className='flex flex-wrap gap-2 mb-3 min-h-[32px]'>
              {formData.genres.length === 0 ? (
                <span className='text-white/40 text-sm italic'>
                  No genres selected yet
                </span>
              ) : (
                formData.genres.map((genre, index) => (
                  <span
                    key={index}
                    className='bg-orange-500/20 border border-orange-500/40 text-orange-400 px-3 py-1 text-sm flex items-center gap-2 hover:bg-orange-500/30 transition-colors'
                  >
                    {genre}
                    <button
                      onClick={() => handleGenreChange(genre, 'remove')}
                      className='text-orange-400 hover:text-orange-300 ml-1 hover:scale-110 transition-transform'
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
            <div className='flex flex-wrap gap-2'>
              {[
                'Afrobeats',
                'Afrotech',
                'Drill',
                'DnB',
                'Garage',
                'Grime',
                'Hip Hop',
                'House',
                'Producer',
                'Rap',
                'Traditional',
                'UKG',
                'Jungle',
                'MC',
              ].map(genre => (
                <button
                  key={genre}
                  onClick={() => {
                    const action = formData.genres.includes(genre)
                      ? 'remove'
                      : 'add';
                    handleGenreChange(genre, action);
                  }}
                  className={`px-3 py-2 text-sm border transition-all duration-300 ${
                    formData.genres.includes(genre)
                      ? 'bg-orange-500 text-black border-orange-500'
                      : 'bg-white/10 text-white border-white/30 hover:border-white/60'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Social Media - Grid Layout */}
      <div className='bg-white/5 border border-white/10 p-6 hover:bg-white/[0.07] transition-colors'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Social Media
        </h3>
        <p className='text-white/60 text-sm mb-6'>
          Add only your usernames (without @ symbol or full URLs)
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='flex items-center gap-2 text-white/70 text-sm mb-2'>
              <img
                src='/icons/embeds/twitter.png'
                alt='Twitter'
                className='w-4 h-4'
              />
              Twitter
            </label>
            <input
              type='text'
              value={formData.socials.twitter}
              onChange={e => handleSocialChange?.('twitter', e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='username'
            />
          </div>

          <div>
            <label className='flex items-center gap-2 text-white/70 text-sm mb-2'>
              <img
                src='/icons/embeds/instagram.png'
                alt='Instagram'
                className='w-4 h-4'
              />
              Instagram
            </label>
            <input
              type='text'
              value={formData.socials.instagram}
              onChange={e => handleSocialChange?.('instagram', e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='username'
            />
          </div>

          <div>
            <label className='flex items-center gap-2 text-white/70 text-sm mb-2'>
              <img
                src='/icons/embeds/spotify.png'
                alt='Spotify'
                className='w-4 h-4'
              />
              Spotify
            </label>
            <input
              type='text'
              value={formData.socials.spotify}
              onChange={e => handleSocialChange?.('spotify', e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='username'
            />
          </div>

          <div>
            <label className='flex items-center gap-2 text-white/70 text-sm mb-2'>
              <img
                src='/icons/embeds/soundcloud.png'
                alt='SoundCloud'
                className='w-4 h-4'
              />
              SoundCloud
            </label>
            <input
              type='text'
              value={formData.socials.soundcloud}
              onChange={e => handleSocialChange?.('soundcloud', e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='username'
            />
          </div>

          <div className='md:col-span-2'>
            <label className='flex items-center gap-2 text-white/70 text-sm mb-2'>
              <img
                src='/icons/embeds/youtube.png'
                alt='YouTube'
                className='w-4 h-4'
              />
              YouTube
            </label>
            <input
              type='text'
              value={formData.socials.youtube}
              onChange={e => handleSocialChange?.('youtube', e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='username'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
