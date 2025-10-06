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
              onChange={e => handleInputChange('username', e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='Enter username (e.g., artistname)'
            />
            <p className='text-white/50 text-xs mt-1'>
              This will be your unique identifier and profile URL
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
              type='number'
              value={formData.price}
              onChange={e =>
                handleInputChange('price', parseInt(e.target.value) || 0)
              }
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
                  No genres added yet
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
            <input
              type='text'
              placeholder='Add new genre'
              onKeyPress={e => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  handleGenreChange(e.currentTarget.value.trim(), 'add');
                  e.currentTarget.value = '';
                }
              }}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className='bg-white/5 border border-white/10 p-6 hover:bg-white/[0.07] transition-colors'>
        <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
          Social Media
        </h3>

        <div className='space-y-4'>
          <div>
            <label className='block text-white/70 text-sm mb-2'>Twitter</label>
            <input
              type='text'
              value={formData.socials.twitter}
              onChange={e => handleSocialChange?.('twitter', e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='@username'
            />
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Instagram
            </label>
            <input
              type='text'
              value={formData.socials.instagram}
              onChange={e => handleSocialChange?.('instagram', e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='@username'
            />
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>Spotify</label>
            <input
              type='text'
              value={formData.socials.spotify}
              onChange={e => handleSocialChange?.('spotify', e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='Artist name or profile link'
            />
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>
              SoundCloud
            </label>
            <input
              type='text'
              value={formData.socials.soundcloud}
              onChange={e => handleSocialChange?.('soundcloud', e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='Artist name or profile link'
            />
          </div>

          <div>
            <label className='block text-white/70 text-sm mb-2'>YouTube</label>
            <input
              type='text'
              value={formData.socials.youtube}
              onChange={e => handleSocialChange?.('youtube', e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='Channel name or link'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
