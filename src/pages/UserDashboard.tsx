// pages/UserDashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import DashboardHeader from '@/components/userDashboard/DashboardHeader';
import StatsGrid from '@/components/userDashboard/StatsGrid';
import OverviewTab from '@/components/userDashboard/OverviewTab';
import BookingsTab from '@/components/userDashboard/BookingsTab';
import SavedArtistsTab from '@/components/userDashboard/SavedArtistsTab';
import SettingsTab from '@/components/userDashboard/SettingsTab';
import { useStore } from '@/stores/store';
import { useGetUserProfile, useUpdateUserProfile } from '@/hooks/user';
import { logout } from '@/lib/apiClient';
import { dummyUserDashboardData } from '@/constants/userDashboardData';
import { useImageUpload } from '@/hooks/useImageUpload';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useStore();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'bookings' | 'saved' | 'settings'
  >('overview');

  // Fetch user profile data
  const { data: userResponse, isLoading, error } = useGetUserProfile();

  // Get user data from API response
  const userData = userResponse?.data;
  const dashboardData = dummyUserDashboardData;

  // Get saved artists from user data
  const savedArtists = userData?.savedArtists || [];

  // Profile update mutation
  const updateProfileMutation = useUpdateUserProfile();

  // Image upload hook
  const {
    uploading,
    error: uploadError,
    handleFileUpload,
    uploadedUrl,
    reset,
  } = useImageUpload();

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: userData?.username || '',
    displayName: userData?.displayName || '',
    bio: userData?.bio || '',
    phone: userData?.phone || '',
    location: userData?.location || '',
    avatar: userData?.avatar || '',
  });

  // Validation functions
  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-z0-9._]+$/;
    return usernameRegex.test(username);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[0-9\s\-()]+$/;
    return phoneRegex.test(phone);
  };

  const handleUsernameChange = (value: string) => {
    // Convert to lowercase and remove invalid characters
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9._]/g, '');
    setProfileForm(prev => ({ ...prev, username: cleanValue }));
  };

  const handlePhoneChange = (value: string) => {
    // Only allow numbers, spaces, hyphens, parentheses, and plus sign
    const cleanValue = value.replace(/[^0-9\s\-()+]/g, '');
    setProfileForm(prev => ({ ...prev, phone: cleanValue }));
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const result = await handleFileUpload(file, 'artist');
      if (result.success && result.url) {
        setProfileForm(prev => ({ ...prev, avatar: result.url! }));
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
    }
  };

  // Update form when userData changes
  useEffect(() => {
    if (userData) {
      setProfileForm({
        username: userData.username || '',
        displayName: userData.displayName || '',
        bio: userData.bio || '',
        phone: userData.phone || '',
        location: userData.location || '',
        avatar: userData.avatar || '',
      });
    }
  }, [userData]);

  const handleProfileUpdate = async () => {
    try {
      await updateProfileMutation.mutateAsync(profileForm);
      // Success feedback could be added here
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, redirect to auth page
      navigate('/auth');
    }
  };

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-2'>Authentication Required</h1>
          <p className='text-white/60 mb-4'>
            Please log in to access your dashboard.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4'></div>
          <p className='text-white/60'>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !userResponse?.success) {
    const errorMessage = error?.message || 'Failed to fetch user data';
    const isAuthError =
      errorMessage.includes('not authenticated') ||
      errorMessage.includes('401');

    return (
      <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-2'>
            {isAuthError ? 'Authentication Error' : 'Unable to Load Dashboard'}
          </h1>
          <p className='text-white/60 mb-4'>{errorMessage}</p>
          {isAuthError ? (
            <button
              onClick={() => navigate('/auth')}
              className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'
            >
              Go to Login
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // No user data
  if (!userData) {
    return (
      <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-2'>User Not Found</h1>
          <p className='text-white/60'>Unable to load dashboard data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-neutral-950'>
      <Navbar />

      <div className='w-full p-4 md:p-6 lg:p-8'>
        {/* Dashboard Header */}
        <DashboardHeader
          userData={userData}
          onLogout={handleLogout}
          onEditProfile={() => setActiveTab('settings')}
        />

        {/* Quick Stats Grid */}
        <StatsGrid
          dashboardData={dashboardData}
          savedArtistsCount={savedArtists.length}
        />

        {/* Tab Navigation */}
        <div className='flex flex-wrap gap-4 mb-8 border-b border-dashed border-white pb-4'>
          {['overview', 'bookings', 'saved', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
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

        {/* Tab Content */}
        <div className='min-h-[400px]'>
          {activeTab === 'overview' && (
            <OverviewTab
              dashboardData={dashboardData}
              savedArtists={savedArtists}
              onTabChange={(tab: string) => setActiveTab(tab as any)}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsTab dashboardData={dashboardData} />
          )}

          {activeTab === 'saved' && (
            <SavedArtistsTab savedArtists={savedArtists} />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              userData={userData}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              handleUsernameChange={handleUsernameChange}
              handlePhoneChange={handlePhoneChange}
              handleAvatarUpload={handleAvatarUpload}
              handleProfileUpdate={handleProfileUpdate}
              updateProfileMutation={updateProfileMutation}
              uploading={uploading}
              uploadError={uploadError}
              uploadedUrl={uploadedUrl}
              reset={reset}
              validateUsername={validateUsername}
              validatePhone={validatePhone}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
