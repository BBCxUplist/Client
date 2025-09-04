import { formatPrice } from '@/helper';
import type { Artist } from '@/types';

interface ProfileTabProps {
  artist: Artist;
  formData: {
    name: string;
    bio: string;
    price: number;
    genres: string[];
    isBookable: boolean;
  };
  handleInputChange: (
    field: string,
    value: string | number | boolean | string[]
  ) => void;
  handleGenreChange: (tag: string, action: 'add' | 'remove') => void;
}

const ProfileTab = ({
  artist,
  formData,
  handleInputChange,
  handleGenreChange,
}: ProfileTabProps) => {
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
              Artist Name
            </label>
            <input
              type='text'
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              className='w-full bg-white/10 border border-white/20 text-white p-3 focus:outline-none focus:border-orange-500 transition-colors hover:bg-white/[0.12]'
              placeholder='Enter artist name'
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
            <p className='text-white/50 text-xs mt-1'>
              Current: {formatPrice(artist.basePrice)}
            </p>
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
    </div>
  );
};

export default ProfileTab;
