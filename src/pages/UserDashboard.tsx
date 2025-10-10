// pages/UserDashboard.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import { formatPrice } from '@/helper';
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
      const result = await handleFileUpload(file, 'artist', 'avatars');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
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
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8'>
          <div className='flex items-center gap-6 mb-6 lg:mb-0'>
            {/* User Avatar */}
            <div className='relative'>
              <img
                src={
                  userData.avatar ||
                  'https://i.pinimg.com/1200x/09/e4/0a/09e40a3f556058ae2f57ba22bce36f12.jpg'
                }
                alt={userData.displayName || userData.username}
                className='w-20 h-20 lg:w-24 lg:h-24 object-cover'
                onError={e => {
                  e.currentTarget.src = '/images/userNotFound.jpeg';
                }}
              />
              <div className='absolute -bottom-2 -right-2 bg-orange-500 text-black px-2 py-1 text-xs font-semibold'>
                USER
              </div>
            </div>

            <div>
              <h1 className='font-mondwest text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2'>
                {userData.displayName || userData.username}
              </h1>
              <p className='text-white/70 text-lg'>
                {userData.location || 'Location not set'}
              </p>
              <p className='text-white/50 text-sm'>
                Member since{' '}
                {userData.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString()
                  : 'Unknown'}
              </p>
            </div>
          </div>

          <div className='flex flex-wrap gap-3'>
            <Link to='/explore'>
              <button className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'>
                EXPLORE ARTISTS
              </button>
            </Link>
            <button
              onClick={() => setActiveTab('settings')}
              className='bg-white/10 border border-white/30 text-white px-4 py-2 font-semibold hover:bg-white/20 transition-colors'
            >
              EDIT PROFILE
            </button>
            <button
              onClick={handleLogout}
              className='bg-white/10 border border-white/30 text-white px-4 py-2 font-semibold hover:bg-white/20 transition-colors'
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 mb-8'>
          <div className='bg-white/5 border border-white/10 p-4 md:p-6'>
            <h3 className='text-white/70 text-xs md:text-sm mb-2'>
              Total Bookings
            </h3>
            <p className='text-xl md:text-2xl lg:text-3xl font-bold text-orange-500 font-mondwest'>
              {dashboardData.stats.totalBookings}
            </p>
          </div>
          <div className='bg-white/5 border border-white/10 p-4 md:p-6'>
            <h3 className='text-white/70 text-xs md:text-sm mb-2'>
              Total Spent
            </h3>
            <p className='text-xl md:text-2xl lg:text-3xl font-bold text-orange-500 font-mondwest'>
              {formatPrice(dashboardData.stats.totalSpent)}
            </p>
          </div>
          <div className='bg-white/5 border border-white/10 p-4 md:p-6'>
            <h3 className='text-white/70 text-xs md:text-sm mb-2'>
              Avg Rating Given
            </h3>
            <p className='text-xl md:text-2xl lg:text-3xl font-bold text-orange-500 font-mondwest'>
              ⭐ {dashboardData.stats.averageRating}
            </p>
          </div>
          <div className='bg-white/5 border border-white/10 p-4 md:p-6'>
            <h3 className='text-white/70 text-xs md:text-sm mb-2'>
              Saved Artists
            </h3>
            <p className='text-xl md:text-2xl lg:text-3xl font-bold text-orange-500 font-mondwest'>
              {dashboardData.stats.savedArtists}
            </p>
          </div>
          <div className='bg-white/5 border border-white/10 p-4 md:p-6'>
            <h3 className='text-white/70 text-xs md:text-sm mb-2'>Upcoming</h3>
            <p className='text-xl md:text-2xl lg:text-3xl font-bold text-orange-500 font-mondwest'>
              {dashboardData.stats.upcomingEvents}
            </p>
          </div>
          <div className='bg-white/5 border border-white/10 p-4 md:p-6'>
            <h3 className='text-white/70 text-xs md:text-sm mb-2'>Completed</h3>
            <p className='text-xl md:text-2xl lg:text-3xl font-bold text-orange-500 font-mondwest'>
              {dashboardData.stats.completedEvents}
            </p>
          </div>
        </div>

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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='space-y-8'
            >
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Upcoming Events */}
                <div className='lg:col-span-2'>
                  <div className='bg-white/5 border border-white/10 p-6 mb-8'>
                    <div className='flex items-center justify-between mb-6'>
                      <h3 className='text-xl font-semibold text-white font-mondwest'>
                        Upcoming Events
                      </h3>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className='text-orange-500 hover:text-orange-400 text-sm'
                      >
                        View All →
                      </button>
                    </div>
                    {dashboardData.upcomingEvents.length > 0 ? (
                      <div className='space-y-4'>
                        {dashboardData.upcomingEvents.map((event: any) => (
                          <div
                            key={event.id}
                            className='flex items-center justify-between p-4 bg-white/5 border border-white/10'
                          >
                            <div>
                              <p className='text-white font-semibold'>
                                {event.eventType}
                              </p>
                              <p className='text-white/60 text-sm'>
                                {event.artistName} • {event.date}
                              </p>
                              <p className='text-white/50 text-xs'>
                                {event.location}
                              </p>
                            </div>
                            <div className='text-right'>
                              <p className='text-orange-500 font-bold font-mondwest'>
                                {formatPrice(event.amount)}
                              </p>
                              <span
                                className={`px-2 py-1 text-xs font-semibold border ${getStatusColor(
                                  event.status
                                )}`}
                              >
                                {event.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className='text-center py-8'>
                        <p className='text-white/60 mb-4'>No upcoming events</p>
                        <Link to='/explore'>
                          <button className='bg-orange-500 text-black px-4 py-2 font-semibold'>
                            BOOK AN ARTIST
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Recent Bookings */}
                  <div className='bg-white/5 border border-white/10 p-6'>
                    <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
                      Recent Activity
                    </h3>
                    <div className='space-y-4'>
                      {dashboardData.recentBookings
                        .slice(0, 3)
                        .map((booking: any) => (
                          <div
                            key={booking.id}
                            className='flex items-center gap-4 p-4 bg-white/5 border border-white/10'
                          >
                            <img
                              src={booking.artistAvatar}
                              alt={booking.artistName}
                              className='w-12 h-12 object-cover'
                              onError={e => {
                                e.currentTarget.src =
                                  '/images/artistNotFound.jpeg';
                              }}
                            />
                            <div className='flex-1'>
                              <p className='text-white font-semibold'>
                                {booking.eventType}
                              </p>
                              <p className='text-white/60 text-sm'>
                                {booking.artistName} • {booking.date}
                              </p>
                            </div>
                            <div className='text-right'>
                              <span
                                className={`px-2 py-1 text-xs font-semibold border ${getStatusColor(
                                  booking.status
                                )}`}
                              >
                                {booking.status.toUpperCase()}
                              </span>
                              {booking.status === 'completed' &&
                                !booking.rating && (
                                  <button className='block mt-1 text-orange-500 hover:text-orange-400 text-xs'>
                                    Rate Artist
                                  </button>
                                )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className='space-y-6'>
                  {/* Recommendations */}
                  <div className='bg-white/5 border border-white/10 p-6'>
                    <h3 className='text-lg font-semibold text-white mb-4 font-mondwest'>
                      Recommended Artists
                    </h3>
                    <div className='space-y-4'>
                      {dashboardData.recommendations.map((artist: any) => (
                        <Link
                          key={artist.id}
                          to={`/artist/${artist.slug}`}
                          className='block'
                        >
                          <div className='flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
                            <img
                              src={artist.avatar}
                              alt={artist.name}
                              className='w-10 h-10 object-cover'
                              onError={e => {
                                e.currentTarget.src =
                                  '/images/artistNotFound.jpeg';
                              }}
                            />
                            <div className='flex-1'>
                              <p className='text-white text-sm font-semibold'>
                                {artist.name}
                              </p>
                              <p className='text-white/60 text-xs'>
                                ⭐ {artist.rating} • {formatPrice(artist.price)}
                              </p>
                              <p className='text-orange-400 text-xs'>
                                {artist.reason}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className='bg-white/5 border border-white/10 p-6'>
                    <h3 className='text-lg font-semibold text-white mb-4 font-mondwest'>
                      Quick Actions
                    </h3>
                    <div className='space-y-3'>
                      <Link to='/explore'>
                        <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
                          <span className='text-white text-sm'>
                            🔍 Explore Artists
                          </span>
                        </button>
                      </Link>
                      <button
                        onClick={() => setActiveTab('saved')}
                        className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'
                      >
                        <span className='text-white text-sm'>
                          ❤️ Saved Artists
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'
                      >
                        <span className='text-white text-sm'>
                          📅 My Bookings
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveTab('settings')}
                        className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'
                      >
                        <span className='text-white text-sm'>
                          ⚙️ Account Settings
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='space-y-6'
            >
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                <h3 className='text-2xl font-semibold text-white mb-4 sm:mb-0 font-mondwest'>
                  All Bookings
                </h3>
                <div className='flex gap-2'>
                  <select className='bg-white/5 border border-white/20 text-white p-2 text-sm'>
                    <option>All Status</option>
                    <option>Confirmed</option>
                    <option>Pending</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                  <select className='bg-white/5 border border-white/20 text-white p-2 text-sm'>
                    <option>All Time</option>
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>This Year</option>
                  </select>
                </div>
              </div>

              <div className='grid gap-6'>
                {dashboardData.recentBookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className='bg-white/5 border border-white/10 p-6'
                  >
                    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                      <div className='flex items-center gap-4'>
                        <Link to={`/artist/${booking.artistSlug}`}>
                          <img
                            src={booking.artistAvatar}
                            alt={booking.artistName}
                            className='w-16 h-16 object-cover hover:opacity-80 transition-opacity'
                            onError={e => {
                              e.currentTarget.src =
                                '/images/artistNotFound.jpeg';
                            }}
                          />
                        </Link>
                        <div>
                          <h4 className='text-white font-semibold text-lg'>
                            {booking.eventType}
                          </h4>
                          <Link
                            to={`/artist/${booking.artistSlug}`}
                            className='text-orange-500 hover:text-orange-400'
                          >
                            {booking.artistName}
                          </Link>
                          <p className='text-white/60 text-sm'>
                            {booking.date} • {booking.location}
                          </p>
                          <p className='text-orange-500 font-bold font-mondwest'>
                            {formatPrice(booking.amount)}
                          </p>
                        </div>
                      </div>
                      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                        <span
                          className={`px-3 py-1 text-xs font-semibold border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                        <div className='flex gap-2'>
                          {booking.status === 'completed' &&
                            !booking.rating && (
                              <button className='bg-orange-500 text-black px-3 py-1 text-xs font-semibold hover:bg-orange-600'>
                                RATE ARTIST
                              </button>
                            )}
                          {booking.status === 'pending' && (
                            <button className='bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 text-xs font-semibold hover:bg-red-500/30'>
                              CANCEL
                            </button>
                          )}
                          <button className='text-orange-500 hover:text-orange-400 text-xs underline'>
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Saved Artists Tab */}
          {activeTab === 'saved' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='space-y-6'
            >
              <h3 className='text-2xl font-semibold text-white font-mondwest'>
                Saved Artists
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {dashboardData.savedArtists.map((artist: any) => (
                  <div
                    key={artist.id}
                    className='bg-white/5 border border-white/10 p-4'
                  >
                    <Link to={`/artist/${artist.slug}`}>
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className='w-full aspect-square object-cover mb-4 hover:opacity-80 transition-opacity'
                        onError={e => {
                          e.currentTarget.src = '/images/artistNotFound.jpeg';
                        }}
                      />
                    </Link>
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex-1'>
                        <Link
                          to={`/artist/${artist.slug}`}
                          className='text-white font-semibold text-lg hover:text-orange-500'
                        >
                          {artist.name}
                        </Link>
                        <p className='text-white/60 text-sm'>
                          ⭐ {artist.rating}
                        </p>
                        <div className='flex flex-wrap gap-1 mt-2'>
                          {artist.categories.map(
                            (category: any, index: number) => (
                              <span
                                key={index}
                                className='bg-white/10 text-white text-xs px-2 py-1'
                              >
                                {category}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <button className='text-red-400 hover:text-red-300 ml-2'>
                        ❤️
                      </button>
                    </div>
                    <div className='flex items-center justify-between'>
                      <p className='text-orange-500 font-bold font-mondwest text-sm'>
                        {formatPrice(artist.price)}
                      </p>
                      {artist.isBookable ? (
                        <Link to={`/artist/${artist.slug}`}>
                          <button className='bg-orange-500 text-black px-3 py-1 text-xs font-semibold hover:bg-orange-600'>
                            BOOK NOW
                          </button>
                        </Link>
                      ) : (
                        <span className='text-white/50 text-xs'>
                          UNAVAILABLE
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='space-y-8'
            >
              <h3 className='text-2xl font-semibold text-white font-mondwest'>
                Account Settings
              </h3>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Profile Information */}
                <div className='bg-white/5 border border-white/10 p-6'>
                  <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
                    Profile Information
                  </h4>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-white/70 text-sm mb-2'>
                        Username
                      </label>
                      <input
                        type='text'
                        value={profileForm.username}
                        onChange={e => handleUsernameChange(e.target.value)}
                        className={`w-full bg-white/5 border text-white p-3 ${
                          profileForm.username &&
                          !validateUsername(profileForm.username)
                            ? 'border-red-500'
                            : 'border-white/20'
                        }`}
                        placeholder='username (lowercase, numbers, dots, underscores only)'
                      />
                      {profileForm.username &&
                        !validateUsername(profileForm.username) && (
                          <p className='text-red-400 text-xs mt-1'>
                            Username can only contain lowercase letters,
                            numbers, dots, and underscores
                          </p>
                        )}
                    </div>
                    <div>
                      <label className='block text-white/70 text-sm mb-2'>
                        Display Name
                      </label>
                      <input
                        type='text'
                        value={profileForm.displayName}
                        onChange={e =>
                          setProfileForm(prev => ({
                            ...prev,
                            displayName: e.target.value,
                          }))
                        }
                        className='w-full bg-white/5 border border-white/20 text-white p-3'
                      />
                    </div>
                    <div>
                      <label className='block text-white/70 text-sm mb-2'>
                        Email
                      </label>
                      <input
                        type='email'
                        value={userData.useremail}
                        className='w-full bg-white/5 border border-white/20 text-white p-3'
                        readOnly
                      />
                    </div>
                    <div>
                      <label className='block text-white/70 text-sm mb-2'>
                        Bio
                      </label>
                      <textarea
                        value={profileForm.bio}
                        onChange={e =>
                          setProfileForm(prev => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        className='w-full bg-white/5 border border-white/20 text-white p-3 h-20 resize-none'
                        placeholder='Tell us about yourself...'
                      />
                    </div>
                    <div>
                      <label className='block text-white/70 text-sm mb-2'>
                        Phone
                      </label>
                      <input
                        type='tel'
                        value={profileForm.phone}
                        onChange={e => handlePhoneChange(e.target.value)}
                        className={`w-full bg-white/5 border text-white p-3 ${
                          profileForm.phone && !validatePhone(profileForm.phone)
                            ? 'border-red-500'
                            : 'border-white/20'
                        }`}
                        placeholder='+1 (555) 123-4567'
                      />
                      {profileForm.phone &&
                        !validatePhone(profileForm.phone) && (
                          <p className='text-red-400 text-xs mt-1'>
                            Please enter a valid phone number
                          </p>
                        )}
                    </div>
                    <div>
                      <label className='block text-white/70 text-sm mb-2'>
                        Location
                      </label>
                      <input
                        type='text'
                        value={profileForm.location}
                        onChange={e =>
                          setProfileForm(prev => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        className='w-full bg-white/5 border border-white/20 text-white p-3'
                      />
                    </div>
                    <div>
                      <label className='block text-white/70 text-sm mb-2'>
                        Profile Picture
                      </label>
                      <div className='space-y-4'>
                        {/* Current/Uploaded Image Preview */}
                        {(uploadedUrl || profileForm.avatar) && (
                          <div className='relative inline-block'>
                            <img
                              src={uploadedUrl || profileForm.avatar}
                              alt='Profile preview'
                              className='w-32 h-32 object-cover rounded-lg border border-white/20'
                            />
                            <button
                              type='button'
                              onClick={() => {
                                reset();
                                setProfileForm(prev => ({
                                  ...prev,
                                  avatar: '',
                                }));
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
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleAvatarUpload(file);
                            }
                          }}
                          className='hidden'
                          id='avatar-upload'
                        />
                        <label
                          htmlFor='avatar-upload'
                          className='inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 text-white rounded cursor-pointer hover:bg-white/20 transition-colors'
                        >
                          {uploading ? (
                            <>
                              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                              Uploading...
                            </>
                          ) : (
                            <>📷 Choose Photo</>
                          )}
                        </label>

                        {uploadError && (
                          <p className='text-red-400 text-xs'>{uploadError}</p>
                        )}

                        <p className='text-white/50 text-xs'>
                          Upload a profile picture (JPG, PNG, max 5MB)
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleProfileUpdate}
                      disabled={
                        updateProfileMutation.isPending ||
                        uploading ||
                        (!!profileForm.username &&
                          !validateUsername(profileForm.username)) ||
                        (!!profileForm.phone &&
                          !validatePhone(profileForm.phone))
                      }
                      className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {updateProfileMutation.isPending
                        ? 'UPDATING...'
                        : 'UPDATE PROFILE'}
                    </button>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className='bg-white/5 border border-white/10 p-6'>
                  <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
                    Notifications
                  </h4>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-white'>Email Notifications</span>
                      <button className='w-12 h-6 bg-orange-500 relative border border-orange-500'>
                        <div className='absolute top-0.5 right-0.5 w-5 h-5 bg-white'></div>
                      </button>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-white'>SMS Notifications</span>
                      <button className='w-12 h-6 bg-orange-500 relative border border-orange-500'>
                        <div className='absolute top-0.5 right-0.5 w-5 h-5 bg-white'></div>
                      </button>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-white'>Booking Reminders</span>
                      <button className='w-12 h-6 bg-orange-500 relative border border-orange-500'>
                        <div className='absolute top-0.5 right-0.5 w-5 h-5 bg-white'></div>
                      </button>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-white'>Artist Recommendations</span>
                      <button className='w-12 h-6 bg-white/10 relative border border-white/30'>
                        <div className='absolute top-0.5 left-0.5 w-5 h-5 bg-white'></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Account Management */}
                <div className='bg-white/5 border border-white/10 p-6'>
                  <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
                    Account Management
                  </h4>
                  <div className='space-y-3'>
                    <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
                      <span className='text-white text-sm'>
                        🔐 Change Password
                      </span>
                    </button>
                    <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
                      <span className='text-white text-sm'>
                        💳 Payment Methods
                      </span>
                    </button>
                    <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
                      <span className='text-white text-sm'>
                        📄 Download Data
                      </span>
                    </button>
                    <button className='w-full text-left p-3 bg-red-500/20 hover:bg-red-500/30 transition-colors border border-red-500/40'>
                      <span className='text-red-400 text-sm'>
                        ⚠️ Delete Account
                      </span>
                    </button>
                  </div>
                </div>

                {/* Help & Support */}
                <div className='bg-white/5 border border-white/10 p-6'>
                  <h4 className='text-xl font-semibold text-white mb-4 font-mondwest'>
                    Help & Support
                  </h4>
                  <div className='space-y-3'>
                    <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
                      <span className='text-white text-sm'>📚 Help Center</span>
                    </button>
                    <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
                      <span className='text-white text-sm'>
                        💬 Contact Support
                      </span>
                    </button>
                    <button className='w-full text-left p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
                      <span className='text-white text-sm'>
                        ⭐ Rate the App
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
