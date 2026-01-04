import { useState } from 'react';
import { motion } from 'framer-motion';
// import { useImageUpload } from '@/hooks/useImageUpload';

interface CreateArtistTabProps {
  onCreateArtist: (artistData: CreateArtistData) => void;
}

interface CreateArtistData {
  // Basic Info
  email: string;
  displayName: string;
  username: string;
  avatar: string;
  phone: string;
  location: string;
  bio: string;

  // Artist Details
  genres: string[];
  price: number;
  isBookable: boolean;
  isAvailable: boolean;

  // Social Links
  socials: {
    twitter: string;
    instagram: string;
    spotify: string;
    soundcloud: string;
    youtube: string;
  };
}

const CreateArtistTab = ({ onCreateArtist }: CreateArtistTabProps) => {
  // Social media URL bases
  const socialUrlBases = {
    twitter: 'https://twitter.com/',
    instagram: 'https://instagram.com/',
    spotify: 'https://open.spotify.com/artist/',
    soundcloud: 'https://soundcloud.com/',
    youtube: 'https://youtube.com/@',
  };

  const [formData, setFormData] = useState<CreateArtistData>({
    email: '',
    displayName: '',
    username: '',
    avatar: '',
    phone: '',
    location: '',
    bio: '',
    genres: [],
    price: 0,
    isBookable: true,
    isAvailable: true,
    socials: {
      twitter: '',
      instagram: '',
      spotify: '',
      soundcloud: '',
      youtube: '',
    },
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'artist' | 'social'>(
    'basic'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const { uploading, uploadedUrl, error, handleFileUpload, reset } = useImageUpload();

  const handleInputChange = (
    field: string,
    value: string | number | boolean | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socials: {
        ...prev.socials,
        [platform]: value,
      },
    }));
  };

  const handleGenreChange = (tag: string, action: 'add' | 'remove') => {
    setFormData(prev => ({
      ...prev,
      genres:
        action === 'add'
          ? [...prev.genres, tag]
          : prev.genres.filter(g => g !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Construct full URLs from usernames
      const socialsWithUrls = {
        twitter: formData.socials.twitter
          ? `${socialUrlBases.twitter}${formData.socials.twitter}`
          : '',
        instagram: formData.socials.instagram
          ? `${socialUrlBases.instagram}${formData.socials.instagram}`
          : '',
        spotify: formData.socials.spotify
          ? `${socialUrlBases.spotify}${formData.socials.spotify}`
          : '',
        soundcloud: formData.socials.soundcloud
          ? `${socialUrlBases.soundcloud}${formData.socials.soundcloud}`
          : '',
        youtube: formData.socials.youtube
          ? `${socialUrlBases.youtube}${formData.socials.youtube}`
          : '',
      };

      await onCreateArtist({
        ...formData,
        socials: socialsWithUrls,
      });
      // Reset form
      setFormData({
        email: '',
        displayName: '',
        username: '',
        avatar: '',
        phone: '',
        location: '',
        bio: '',
        genres: [],
        price: 0,
        isBookable: true,
        isAvailable: true,
        socials: {
          twitter: '',
          instagram: '',
          spotify: '',
          soundcloud: '',
          youtube: '',
        },
      });
      setActiveTab('basic');
    } catch (error) {
      console.error('Error creating artist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableGenres = [
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
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='space-y-6'
    >
      <div>
        <h2 className='text-2xl font-bold text-white mb-4 font-mondwest'>
          Create New Artist
        </h2>
        <p className='text-white/70'>
          Create a pre-configured artist profile. The artist can sign up with
          the provided email to claim their fully set up account.
        </p>
      </div>

      {/* Info Box */}
      <div className='bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg'>
        <div className='flex gap-3'>
          <div className='text-blue-400 text-xl'>ℹ️</div>
          <div>
            <h4 className='text-blue-300 font-semibold mb-1'>How it works</h4>
            <p className='text-blue-200/70 text-sm'>
              1. Fill in all the artist details below
              <br />
              2. Submit to create a pre-configured profile
              <br />
              3. Artist signs up with the email you provide
              <br />
              4. Their account is automatically set up with all the info you
              entered
            </p>
            <p className='text-blue-200/60 text-xs mt-2'>
              💡 No password needed - the artist will create their own during
              signup
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* Tab Navigation */}
        <div className='flex border-b border-white/10'>
          {[
            { id: 'basic', label: 'Basic Information' },
            { id: 'artist', label: 'Artist Details' },
            { id: 'social', label: 'Social Links' },
          ].map(tab => (
            <button
              key={tab.id}
              type='button'
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-orange-400 border-b-2 border-orange-400'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className='space-y-6'
          >
            <div className='bg-white/5 border border-white/10 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
                Basic Information
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Email Address *
                  </label>
                  <input
                    type='email'
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className='w-full bg-white/5 border border-white/20 text-white p-3 rounded focus:border-orange-500 focus:outline-none'
                    placeholder='artist@example.com'
                    required
                  />
                  <p className='text-white/50 text-xs mt-1'>
                    Artist will use this email to sign up and claim their
                    profile
                  </p>
                </div>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Username *
                  </label>
                  <input
                    type='text'
                    value={formData.username}
                    onChange={e =>
                      handleInputChange('username', e.target.value)
                    }
                    className='w-full bg-white/5 border border-white/20 text-white p-3 rounded focus:border-orange-500 focus:outline-none'
                    placeholder='username'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Display Name *
                  </label>
                  <input
                    type='text'
                    value={formData.displayName}
                    onChange={e =>
                      handleInputChange('displayName', e.target.value)
                    }
                    className='w-full bg-white/5 border border-white/20 text-white p-3 rounded focus:border-orange-500 focus:outline-none'
                    placeholder='Artist Name'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    className='w-full bg-white/5 border border-white/20 text-white p-3 rounded focus:border-orange-500 focus:outline-none'
                    placeholder='+1234567890'
                  />
                </div>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Location
                  </label>
                  <input
                    type='text'
                    value={formData.location}
                    onChange={e =>
                      handleInputChange('location', e.target.value)
                    }
                    className='w-full bg-white/5 border border-white/20 text-white p-3 rounded focus:border-orange-500 focus:outline-none'
                    placeholder='City, Country'
                  />
                </div>
              </div>

              <div className='mt-6'>
                <label className='block text-white/70 text-sm mb-2'>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={e => handleInputChange('bio', e.target.value)}
                  className='w-full bg-white/5 border border-white/20 text-white p-3 rounded focus:border-orange-500 focus:outline-none h-24 resize-none'
                  placeholder='Tell us about the artist...'
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Artist Details Tab */}
        {activeTab === 'artist' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className='space-y-6'
          >
            <div className='bg-white/5 border border-white/10 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
                Artist Details
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Base Price (£)
                  </label>
                  <input
                    type='number'
                    value={formData.price}
                    onChange={e =>
                      handleInputChange('price', Number(e.target.value))
                    }
                    className='w-full bg-white/5 border border-white/20 text-white p-3 rounded focus:border-orange-500 focus:outline-none'
                    placeholder='50000'
                    min='0'
                  />
                </div>
                <div className='flex items-center gap-6'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={formData.isBookable}
                      onChange={e =>
                        handleInputChange('isBookable', e.target.checked)
                      }
                      className='w-4 h-4 text-orange-500 bg-transparent border-orange-500 rounded focus:ring-orange-500'
                    />
                    <span className='text-white/70 text-sm'>Bookable</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={formData.isAvailable}
                      onChange={e =>
                        handleInputChange('isAvailable', e.target.checked)
                      }
                      className='w-4 h-4 text-orange-500 bg-transparent border-orange-500 rounded focus:ring-orange-500'
                    />
                    <span className='text-white/70 text-sm'>Available</span>
                  </label>
                </div>
              </div>

              <div className='mt-6'>
                <label className='block text-white/70 text-sm mb-2'>
                  Genres
                </label>
                <div className='flex flex-wrap gap-2 mb-3'>
                  {formData.genres.map((genre, index) => (
                    <span
                      key={index}
                      className='px-3 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-sm rounded flex items-center gap-2'
                    >
                      {genre}
                      <button
                        type='button'
                        onClick={() => handleGenreChange(genre, 'remove')}
                        className='text-orange-400 hover:text-orange-300'
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className='flex flex-wrap gap-2'>
                  {availableGenres
                    .filter(genre => !formData.genres.includes(genre))
                    .map(genre => (
                      <button
                        key={genre}
                        type='button'
                        onClick={() => handleGenreChange(genre, 'add')}
                        className='px-3 py-1 bg-white/10 border border-white/20 text-white/70 text-sm rounded hover:bg-white/20 transition-colors'
                      >
                        {genre}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Social Links Tab */}
        {activeTab === 'social' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className='space-y-6'
          >
            <div className='bg-white/5 border border-white/10 p-6 rounded-lg'>
              <h3 className='text-xl font-semibold text-white mb-2 font-mondwest'>
                Social Links
              </h3>
              <p className='text-white/50 text-sm mb-6'>
                Enter only the username/handle - URLs will be generated
                automatically
              </p>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Twitter
                  </label>
                  <div className='flex'>
                    <span className='bg-white/10 border border-white/20 border-r-0 text-white/50 px-3 py-3 rounded-l text-sm'>
                      twitter.com/
                    </span>
                    <input
                      type='text'
                      value={formData.socials.twitter}
                      onChange={e =>
                        handleSocialChange(
                          'twitter',
                          e.target.value.replace(/^@/, '')
                        )
                      }
                      className='w-full bg-white/5 border border-white/20 text-white p-3 rounded-r focus:border-orange-500 focus:outline-none'
                      placeholder='username'
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Instagram
                  </label>
                  <div className='flex'>
                    <span className='bg-white/10 border border-white/20 border-r-0 text-white/50 px-3 py-3 rounded-l text-sm'>
                      instagram.com/
                    </span>
                    <input
                      type='text'
                      value={formData.socials.instagram}
                      onChange={e =>
                        handleSocialChange(
                          'instagram',
                          e.target.value.replace(/^@/, '')
                        )
                      }
                      className='w-full bg-white/5 border border-white/20 text-white p-3 rounded-r focus:border-orange-500 focus:outline-none'
                      placeholder='username'
                    />
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    Spotify Artist ID
                  </label>
                  <div className='flex'>
                    <span className='bg-white/10 border border-white/20 border-r-0 text-white/50 px-3 py-3 rounded-l text-sm whitespace-nowrap'>
                      open.spotify.com/artist/
                    </span>
                    <input
                      type='text'
                      value={formData.socials.spotify}
                      onChange={e =>
                        handleSocialChange('spotify', e.target.value)
                      }
                      className='w-full bg-white/5 border border-white/20 text-white p-3 rounded-r focus:border-orange-500 focus:outline-none'
                      placeholder='artist_id'
                    />
                  </div>
                  <p className='text-white/40 text-xs mt-1'>
                    Find this in the Spotify artist URL
                  </p>
                </div>
                <div>
                  <label className='block text-white/70 text-sm mb-2'>
                    SoundCloud
                  </label>
                  <div className='flex'>
                    <span className='bg-white/10 border border-white/20 border-r-0 text-white/50 px-3 py-3 rounded-l text-sm'>
                      soundcloud.com/
                    </span>
                    <input
                      type='text'
                      value={formData.socials.soundcloud}
                      onChange={e =>
                        handleSocialChange('soundcloud', e.target.value)
                      }
                      className='w-full bg-white/5 border border-white/20 text-white p-3 rounded-r focus:border-orange-500 focus:outline-none'
                      placeholder='username'
                    />
                  </div>
                </div>
              </div>

              <div className='mt-6'>
                <label className='block text-white/70 text-sm mb-2'>
                  YouTube
                </label>
                <div className='flex'>
                  <span className='bg-white/10 border border-white/20 border-r-0 text-white/50 px-3 py-3 rounded-l text-sm'>
                    youtube.com/@
                  </span>
                  <input
                    type='text'
                    value={formData.socials.youtube}
                    onChange={e =>
                      handleSocialChange(
                        'youtube',
                        e.target.value.replace(/^@/, '')
                      )
                    }
                    className='w-full bg-white/5 border border-white/20 text-white p-3 rounded-r focus:border-orange-500 focus:outline-none'
                    placeholder='channel_handle'
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form Actions */}
        <div className='flex items-center justify-between pt-6 border-t border-white/10'>
          <div className='text-white/60 text-sm'>
            Artist will sign up using their email to claim this profile
          </div>
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={() => {
                setFormData({
                  email: '',
                  displayName: '',
                  username: '',
                  avatar: '',
                  phone: '',
                  location: '',
                  bio: '',
                  genres: [],
                  price: 0,
                  isBookable: true,
                  isAvailable: true,
                  socials: {
                    twitter: '',
                    instagram: '',
                    spotify: '',
                    soundcloud: '',
                    youtube: '',
                  },
                });
                setActiveTab('basic');
              }}
              className='px-6 py-2 border border-white/20 text-white/70 rounded hover:bg-white/10 transition-colors'
            >
              Reset Form
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-6 py-2 bg-orange-500 text-black rounded hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? 'Creating...' : 'Create Artist'}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateArtistTab;
