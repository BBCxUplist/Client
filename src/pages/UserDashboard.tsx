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
import { useImageUpload } from '@/hooks/useImageUpload';
import {
  type UserDashboardTab,
  userTabDisplayMap,
  userValidationRules,
} from '@/constants/userDashboard';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import AuthenticationCheck from '@/components/ui/AuthenticationCheck';

const UserDashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    logout,
    userDashboardTab,
    setUserDashboardTab,
  } = useStore();

  const [activeTab, setActiveTab] = useState<UserDashboardTab>(
    (userDashboardTab as UserDashboardTab) || 'overview'
  );

  const handleTabChange = (tab: UserDashboardTab) => {
    setActiveTab(tab);
    setUserDashboardTab(tab);
  };

  // Fetch user profile data
  const { data: userResponse, isLoading, error } = useGetUserProfile();

  // Get user data from API response
  const userData = userResponse?.data;

  // Get saved artists from user data
  const savedArtists = userData?.savedArtists || [];

  // Check profile completion
  const isProfileIncomplete =
    !userData?.username ||
    !userData?.displayName ||
    !userData?.bio ||
    !userData?.phone ||
    !userData?.location ||
    !userData?.avatar;

  const missingFields = [];
  if (!userData?.username) missingFields.push('Username');
  if (!userData?.displayName) missingFields.push('Display Name');
  if (!userData?.bio) missingFields.push('Bio');
  if (!userData?.phone) missingFields.push('Phone');
  if (!userData?.location) missingFields.push('Location');
  if (!userData?.avatar) missingFields.push('Profile Picture');

  // Get bookings from user data
  const bookings = userData?.bookings || [];

  // Process booking data for dashboard
  const now = new Date();
  const upcomingEvents = bookings.filter(booking => {
    const eventDate = new Date(booking.eventDate);
    return eventDate > now && booking.status !== 'cancelled';
  });

  const completedEvents = bookings.filter(
    booking => booking.status === 'completed'
  );

  // Calculate total spent from completed bookings
  const totalSpent = completedEvents.reduce((sum, booking) => {
    const budget = parseInt(booking.budgetRange) || 0;
    return sum + budget;
  }, 0);

  // Create dashboard data from real API data
  const dashboardData = {
    recentBookings: bookings.slice(0, 5), // Show 5 most recent bookings
    upcomingEvents: upcomingEvents,
    stats: {
      totalBookings: bookings.length,
      totalSpent: totalSpent,
      averageRating: 0, // Not available in current API
      savedArtists: savedArtists.length,
      upcomingEvents: upcomingEvents.length,
      completedEvents: completedEvents.length,
    },
  };

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
    return userValidationRules.username.test(username);
  };

  const validatePhone = (phone: string) => {
    return userValidationRules.phone.test(phone);
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

  const handleNotificationUpdate = async (notificationSettings: any) => {
    try {
      await updateProfileMutation.mutateAsync({
        notificationSettings: notificationSettings,
      });
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to home after successful logout
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state and redirect
      navigate('/');
    }
  };

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return (
      <AuthenticationCheck isAuthenticated={isAuthenticated} user={user}>
        {/* This will never render because AuthenticationCheck handles the redirect */}
        <div />
      </AuthenticationCheck>
    );
  }

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error || !userResponse?.success) {
    const errorMessage = error?.message || 'Failed to fetch user data';
    const isAuthError =
      errorMessage.includes('not authenticated') ||
      errorMessage.includes('401');

    if (isAuthError) {
      return (
        <ErrorState
          title='Authentication Error'
          message={errorMessage}
          actionText='Go to Login'
          actionPath='/auth'
          type='auth'
        />
      );
    }

    return (
      <ErrorState
        title='Unable to Load Dashboard'
        message={errorMessage}
        actionText='Try Again'
        onAction={() => window.location.reload()}
        type='error'
      />
    );
  }

  // No user data
  if (!userData) {
    return (
      <ErrorState
        title='User Not Found'
        message='Unable to load dashboard data.'
        actionText='Go Home'
        actionPath='/'
        type='not-found'
      />
    );
  }

  return (
    <div className='min-h-screen bg-neutral-950 texture-bg'>
      <Navbar />

      <div className='w-full p-4 md:p-6 lg:p-8'>
        {/* Dashboard Header */}
        <DashboardHeader
          userData={userData}
          onLogout={handleLogout}
          onEditProfile={() => handleTabChange('settings')}
        />

        {/* Quick Stats Grid */}
        <StatsGrid
          dashboardData={dashboardData}
          savedArtistsCount={savedArtists.length}
        />

        {/* Tab Navigation */}
        <div className='flex flex-wrap gap-4 mb-8 border-b border-dashed border-white pb-4'>
          {userTabDisplayMap.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as UserDashboardTab)}
              className={`px-4 py-2 text-sm md:text-base font-semibold transition-all duration-300 border ${
                activeTab === tab.id
                  ? 'bg-white text-black border-white'
                  : 'text-white border-white/30 hover:border-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='min-h-[400px]'>
          {activeTab === 'overview' && (
            <OverviewTab
              dashboardData={dashboardData}
              savedArtists={savedArtists}
              onTabChange={(tab: string) =>
                handleTabChange(tab as UserDashboardTab)
              }
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
              isProfileIncomplete={isProfileIncomplete}
              missingFields={missingFields}
              handleNotificationUpdate={handleNotificationUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
