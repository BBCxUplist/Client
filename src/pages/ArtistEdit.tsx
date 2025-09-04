// pages/ArtistEdit.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { artists } from '@/constants/artists';
import Navbar from '@/components/landing/Navbar';
import ProfileTab from '@/components/artistEdit/ProfileTab';
import MusicTab from '@/components/artistEdit/MusicTab';
import GalleryTab from '@/components/artistEdit/GalleryTab';
import SettingsTab from '@/components/artistEdit/SettingsTab';

enum ArtistEditTab {
  PROFILE = 'profile',
  MUSIC = 'music',
  GALLERY = 'gallery',
  SETTINGS = 'settings',
}

const ArtistEdit = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ArtistEditTab>(
    ArtistEditTab.PROFILE
  );

  // Find artist data from constants
  const artist = artists.find(a => a.slug === username);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    price: 0,
    genres: [] as string[],
    isBookable: true,
  });

  // Initialize form data when artist is found
  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name,
        bio: artist.bio || '',
        price: artist.basePrice,
        genres: artist.genres,
        isBookable: artist.isBookable,
      });
    }
  }, [artist]);

  const handleInputChange = (
    field: string,
    value: string | number | boolean | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenreChange = (tag: string, action: 'add' | 'remove') => {
    if (action === 'add' && !formData.genres.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, tag],
      }));
    } else if (action === 'remove') {
      setFormData(prev => ({
        ...prev,
        genres: prev.genres.filter(t => t !== tag),
      }));
    }
  };

  const handleSave = () => {
    // In a real app, this would save to an API
    console.log('Saving artist data:', formData);
    alert('Changes saved successfully!');
  };

  const handleCancel = () => {
    navigate(`/artist/${username}`);
  };

  if (!artist) {
    return (
      <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-2'>Artist Not Found</h1>
          <p className='text-white/60'>
            Unable to load artist data for "{username}".
          </p>
          <p className='text-white/60 mt-2'>Try: /artist/divine/edit</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-neutral-950'>
      <Navbar />

      <div className='w-full p-4 md:p-6 lg:p-8 pb-24 md:pb-4'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 border-b border-dashed border-white pb-8'>
          <div>
            <h1 className='font-mondwest text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2'>
              EDIT PROFILE
            </h1>
            <p className='text-white/70 text-lg'>
              Update your artist information
            </p>
          </div>
          <div className='flex flex-wrap gap-3 mt-4 lg:mt-0'>
            <button
              onClick={handleCancel}
              className='bg-white/10 border border-white/30 text-white px-4 py-2 font-semibold hover:bg-white/20 transition-colors'
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'
            >
              SAVE CHANGES
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='flex flex-wrap gap-4 mb-6 md:mb-8 border-b border-dashed border-white pb-4'>
          {[
            ArtistEditTab.PROFILE,
            ArtistEditTab.MUSIC,
            ArtistEditTab.GALLERY,
            ArtistEditTab.SETTINGS,
          ].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm md:text-base font-semibold transition-all duration-300 border ${
                activeTab === tab
                  ? 'bg-white text-black border-white'
                  : 'text-white border-white/30 hover:border-white/60'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className='min-h-[400px]'>
          {/* Profile Tab */}
          {activeTab === ArtistEditTab.PROFILE && (
            <ProfileTab
              artist={artist}
              formData={formData}
              handleInputChange={handleInputChange}
              handleGenreChange={handleGenreChange}
            />
          )}

          {/* Music Tab */}
          {activeTab === ArtistEditTab.MUSIC && <MusicTab />}

          {/* Gallery Tab */}
          {activeTab === ArtistEditTab.GALLERY && (
            <GalleryTab artist={artist} />
          )}

          {/* Booking Tab */}
          {/* {activeTab === ArtistEditTab.BOOKING && (
            <BookingTab formData={formData} handleInputChange={handleInputChange} />
          )} */}

          {/* Settings Tab */}
          {activeTab === ArtistEditTab.SETTINGS && (
            <SettingsTab artist={artist} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistEdit;
