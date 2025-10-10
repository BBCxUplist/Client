// pages/ArtistEdit.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/stores/store';
import { useUpdateArtistProfile } from '@/hooks/artist/useUpdateArtistProfile';
import { useGetArtistProfile } from '@/hooks/artist/useGetArtistProfile';
import Navbar from '@/components/landing/Navbar';
import ProfileTab from '@/components/artistEdit/ProfileTab';
import MusicTab from '@/components/artistEdit/MusicTab';
import GalleryTab from '@/components/artistEdit/GalleryTab';
import SettingsTab from '@/components/artistEdit/SettingsTab';
import ConfirmModal from '@/components/ui/ConfirmModal';

enum ArtistEditTab {
  PROFILE = 'profile',
  MUSIC = 'music',
  GALLERY = 'gallery',
  SETTINGS = 'settings',
}

const ArtistEdit = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useStore();
  const [activeTab, setActiveTab] = useState<ArtistEditTab>(
    ArtistEditTab.PROFILE
  );

  // Redirect if not authenticated or not an artist
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'artist') {
      navigate('/auth');
    }
  }, [isAuthenticated, user?.role, navigate]);

  // Fetch artist profile data
  const {
    data: artistResponse,
    isLoading: isArtistLoading,
    error: artistError,
  } = useGetArtistProfile();

  // Get artist data from API response or fallback to store user data
  const artist = artistResponse?.data || user;

  // Form state
  const [formData, setFormData] = useState({
    bio: '',
    displayName: '',
    username: '',
    avatar: '',
    phone: '',
    location: '',
    socials: {
      twitter: '',
      instagram: '',
      spotify: '',
      soundcloud: '',
      youtube: '',
    },
    genres: [] as string[],
    price: 0,
    embeds: {
      youtube: [] as string[],
      soundcloud: [] as string[],
      spotify: [] as string[],
    },
    photos: [] as string[],
  });

  // Original data to track changes
  const [originalData, setOriginalData] = useState({
    bio: '',
    displayName: '',
    username: '',
    avatar: '',
    phone: '',
    location: '',
    socials: {
      twitter: '',
      instagram: '',
      spotify: '',
      soundcloud: '',
      youtube: '',
    },
    genres: [] as string[],
    price: 0,
    embeds: {
      youtube: [] as string[],
      soundcloud: [] as string[],
      spotify: [] as string[],
    },
    photos: [] as string[],
  });

  // Update profile mutation
  const updateProfileMutation = useUpdateArtistProfile();

  // Message states
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Modal state
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Initialize form data when artist is found
  useEffect(() => {
    if (artist && artist.id) {
      const initialData = {
        bio: artist.bio || '',
        displayName: artist.displayName || '',
        username: artist.username || '',
        avatar: artist.avatar || '',
        phone: artist.phone || '',
        location: artist.location || '',
        socials: artist.socials || {
          twitter: '',
          instagram: '',
          spotify: '',
          soundcloud: '',
          youtube: '',
        },
        genres: (artist as any).genres || [],
        price: (artist as any).basePrice || 0,
        embeds: {
          youtube: (artist as any).embeds?.youtube || [],
          soundcloud: (artist as any).embeds?.soundcloud || [],
          spotify: (artist as any).embeds?.spotify || [],
        },
        photos: (artist as any).photos || [],
      };

      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [artist?.id, artist?.username, artist?.displayName, artist]); // Include artist to satisfy ESLint

  const handleInputChange = (
    field: string,
    value: string | number | boolean | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (socialPlatform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socials: {
        ...prev.socials,
        [socialPlatform]: value,
      },
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

  // Function to get only changed fields
  const getChangedFields = () => {
    const changes: any = {};

    // Check simple fields
    const simpleFields = [
      'bio',
      'displayName',
      'username',
      'avatar',
      'phone',
      'location',
      'price',
    ];
    simpleFields.forEach(field => {
      if (
        formData[field as keyof typeof formData] !==
        originalData[field as keyof typeof originalData]
      ) {
        changes[field] = formData[field as keyof typeof formData];
      }
    });

    // Check genres array
    if (
      JSON.stringify(formData.genres.sort()) !==
      JSON.stringify(originalData.genres.sort())
    ) {
      changes.genres = formData.genres;
    }

    // Check socials object
    const socialsChanged = Object.keys(formData.socials).some(
      key =>
        formData.socials[key as keyof typeof formData.socials] !==
        originalData.socials[key as keyof typeof originalData.socials]
    );

    if (socialsChanged) {
      changes.socials = formData.socials;
    }

    // Check embeds object
    const embedsChanged = Object.keys(formData.embeds).some(
      key =>
        JSON.stringify(formData.embeds[key as keyof typeof formData.embeds]) !==
        JSON.stringify(
          originalData.embeds[key as keyof typeof originalData.embeds]
        )
    );

    if (embedsChanged) {
      changes.embeds = formData.embeds;
    }

    // Check photos array
    if (
      JSON.stringify(formData.photos.sort()) !==
      JSON.stringify(originalData.photos.sort())
    ) {
      changes.photos = formData.photos;
    }

    return changes;
  };

  const handleSave = async () => {
    // Clear previous messages
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Get only changed fields
      const changedFields = getChangedFields();

      // Check if there are any changes
      if (Object.keys(changedFields).length === 0) {
        setSuccessMessage('No changes detected. Profile is up to date.');
        return;
      }

      console.log('Sending only changed fields:', changedFields);

      // Call the API with only changed fields
      const result = await updateProfileMutation.mutateAsync(changedFields);

      if (result.success) {
        setSuccessMessage('Profile updated successfully!');
        // Update original data to reflect the changes
        setOriginalData(formData);
        // Navigate back to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setErrorMessage(
          result.message || 'Failed to update profile. Please try again.'
        );
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setErrorMessage(
        error.message ||
          'An error occurred while updating your profile. Please try again.'
      );
    }
  };

  const handleCancel = () => {
    // Check if there are any unsaved changes
    const changedFields = getChangedFields();
    const hasChanges = Object.keys(changedFields).length > 0;

    if (hasChanges) {
      setShowCancelModal(true);
    } else {
      navigate('/dashboard');
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    navigate('/dashboard');
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
  };

  // Loading state
  if (isArtistLoading) {
    return (
      <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center texture-bg'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4'></div>
          <h1 className='text-2xl font-bold mb-2'>Loading Profile Data</h1>
          <p className='text-white/60'>
            Please wait while we load your artist profile...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (artistError) {
    return (
      <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center texture-bg'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-2'>Error Loading Profile</h1>
          <p className='text-white/60 mb-4'>
            {artistError.message || 'Failed to load your artist profile.'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // No artist data - redirect to dashboard to fetch data
  if (!artist) {
    return (
      <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center texture-bg'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-2'>No Profile Data</h1>
          <p className='text-white/60 mb-4'>
            Unable to load your artist profile. Please try again.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-neutral-950 texture-bg  '>
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
              disabled={updateProfileMutation.isPending}
              className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {updateProfileMutation.isPending ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className='bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6'>
            <div className='flex items-center gap-3'>
              <div className='text-green-400 text-xl'>✅</div>
              <p className='text-green-400'>{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6'>
            <div className='flex items-center gap-3'>
              <div className='text-red-400 text-xl'>❌</div>
              <p className='text-red-400'>{errorMessage}</p>
            </div>
          </div>
        )}

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
              artist={artist as any}
              formData={formData}
              handleInputChange={handleInputChange}
              handleGenreChange={handleGenreChange}
              handleSocialChange={handleSocialChange}
            />
          )}

          {/* Music Tab */}
          {activeTab === ArtistEditTab.MUSIC && (
            <MusicTab
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {/* Gallery Tab */}
          {activeTab === ArtistEditTab.GALLERY && (
            <GalleryTab
              artist={artist as any}
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {/* Settings Tab */}
          {activeTab === ArtistEditTab.SETTINGS && (
            <SettingsTab artist={artist as any} />
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
        title='Unsaved Changes'
        message='You have unsaved changes. Are you sure you want to leave? Your changes will be lost.'
        confirmText='Leave'
        cancelText='Stay'
        confirmButtonColor='red'
      />
    </div>
  );
};

export default ArtistEdit;
