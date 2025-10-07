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

          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Profile Picture
            </label>
            <div className='space-y-4'>
              {/* Current/Uploaded Image Preview */}
              {(uploadedUrl || formData.avatar) && (
                <div className='relative inline-block'>
                  <img
                    src={uploadedUrl || formData.avatar}
                    alt='Profile preview'
                    className='w-32 h-32 object-cover rounded-lg border border-white/20'
                  />
                  <button
                    type='button'
                    onClick={() => {
                      reset();
                      handleInputChange('avatar', '');
                    }}
                    className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors'
                  >
                    ×
                  </button>
                </div>
              )}

              {/* File Input */}
              <input
                type='file'
                accept='image/*'
                onChange={async e => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const result = await handleFileUpload(
                    file,
                    'artist',
                    'images'
                  );
                  if (result.success && result.url) {
                    handleInputChange('avatar', result.url);
                  }
                }}
                disabled={uploading}
                className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              />

              {/* Error Message */}
              {error && <div className='text-red-400 text-sm'>{error}</div>}

              {/* Upload Status */}
              {uploading && (
                <div className='text-white/70 text-sm'>Uploading image...</div>
              )}

              {/* File Requirements */}
              <div className='text-white/50 text-xs'>
                <p>Supported formats: JPG, PNG, GIF</p>
                <p>Max file size: 5MB</p>
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
                'Pop',
                'Rock',
                'Hip Hop',
                'Jazz',
                'Classical',
                'Folk',
                'Metal',
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

      {/* Social Media */}
      <div className='bg-white/5 border border-white/10 p-6 hover:bg-white/[0.07] transition-colors'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Social Media
        </h3>
        <p className='text-white/60 text-sm mb-4'>
          Add only your usernames (without @ symbol or full URLs)
        </p>

        <div className='space-y-4'>
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

          <div>
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
