// pages/ArtistDashboard.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/stores/store';
import { useGetArtistProfile } from '@/hooks/artist/useGetArtistProfile';
import { formatPrice } from '@/helper';
import { dummyDashboardData } from '@/constants/dashboardData';
import BookingModal from '@/components/ui/BookingModal';
import OverviewTab from '@/components/artistDashboard/OverviewTab';
import BookingsTab from '@/components/artistDashboard/BookingsTab';
import AnalyticsTab from '@/components/artistDashboard/AnalyticsTab';
import SettingsTab from '@/components/artistDashboard/SettingsTab';
import { DashboardTab } from '@/types';

const ArtistDashboard = () => {
  const { user, setUser } = useStore();
  const [activeTab, setActiveTab] = useState<DashboardTab>(
    DashboardTab.OVERVIEW
  );
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch artist profile data
  const { data: artistResponse, isLoading, error } = useGetArtistProfile();

  // Settings states
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [acceptBookings, setAcceptBookings] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Get artist data from API response
  const artist = artistResponse?.data;
  const dashboardData = dummyDashboardData;

  // Store artist data in state when fetched
  useEffect(() => {
    if (artist && user && !user.username) {
      // Only update if we don't already have artist data to prevent infinite loops
      const updatedUser = {
        ...user,
        ...artist,
        role: (artist.role as 'user' | 'artist' | 'admin') || 'artist',
      };
      setUser(updatedUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist, setUser]); // Intentionally exclude 'user' to prevent infinite loop

  // Check if profile is incomplete and get missing fields
  const getMissingFields = () => {
    if (!artist) return [];
    const missing = [];
    if (!artist.displayName) missing.push('Display Name');
    if (!artist.avatar) missing.push('Profile Picture');
    if (!artist.bio) missing.push('Bio');
    if (!artist.phone) missing.push('Phone Number');
    if (!artist.location) missing.push('Location');
    if (!artist.socials) missing.push('Social Media Links');
    return missing;
  };

  const missingFields = getMissingFields();
  const isProfileIncomplete = missingFields.length > 0;

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
  if (error || !artistResponse?.success) {
    return (
      <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-2'>Unable to Load Dashboard</h1>
          <p className='text-white/60 mb-4'>
            {error?.message || 'Failed to fetch artist data'}
          </p>
          <Link
            to='/'
            className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'
          >
            Go to home
          </Link>
        </div>
      </div>
    );
  }

  // No artist data
  if (!artist) {
    return (
      <div className='min-h-screen bg-neutral-950 text-white flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-2'>Artist Not Found</h1>
          <p className='text-white/60'>Unable to load dashboard data.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  return (
    <div className='w-full p-4 md:p-6 lg:p-8'>
      {/* Profile Completion Warning */}
      {isProfileIncomplete && (
        <div className='bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6'>
          <div className='flex items-start gap-3'>
            <div className='text-yellow-400 text-xl'>⚠️</div>
            <div className='flex-1'>
              <h3 className='text-yellow-400 font-semibold mb-1'>
                Profile Incomplete
              </h3>
              <p className='text-white/70 text-sm mb-2'>
                Your profile is missing important information. Complete your
                profile to be more visible to potential clients.
              </p>
              <div className='text-white/60 text-xs mb-3'>
                <strong>Missing:</strong> {missingFields.join(', ')}
              </div>
              <Link to='/dashboard/edit'>
                <button className='bg-yellow-500 text-black px-4 py-2 text-sm font-semibold hover:bg-yellow-600 transition-colors'>
                  Complete Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Header */}
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8'>
        <div>
          <h1 className='font-mondwest text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2'>
            YOUR DASHBOARD
          </h1>
          <p className='text-white/70 text-lg'>
            Welcome back, {artist.displayName || artist.username || 'Artist'}
          </p>
        </div>
        <div className='flex flex-wrap gap-3 mt-4 lg:mt-0'>
          <Link to={`/artist/${artist.username}`}>
            <button className='bg-white/10 border border-white/30 text-white px-4 py-2 font-semibold hover:bg-white/20 transition-colors'>
              VIEW PUBLIC PROFILE
            </button>
          </Link>
          <Link to='/dashboard/edit'>
            <button className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'>
              EDIT PROFILE
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white/5 border border-white/10 p-6'>
          <h3 className='text-white/70 text-sm mb-2'>Profile Status</h3>
          <p
            className={`text-2xl font-bold font-mondwest ${isProfileIncomplete ? 'text-yellow-400' : 'text-green-400'}`}
          >
            {isProfileIncomplete ? 'Incomplete' : 'Complete'}
          </p>
          <p
            className={`text-xs mt-1 ${isProfileIncomplete ? 'text-yellow-400' : 'text-green-400'}`}
          >
            {isProfileIncomplete ? '⚠️ Missing info' : '✅ All set'}
          </p>
        </div>
        <div className='bg-white/5 border border-white/10 p-6'>
          <h3 className='text-white/70 text-sm mb-2'>Total Earnings</h3>
          <p className='text-3xl font-bold text-orange-500 font-mondwest'>
            {formatPrice(dashboardData.stats.totalEarnings)}
          </p>
          <p className='text-green-400 text-xs mt-1'>↗ +12% this month</p>
        </div>
        <div className='bg-white/5 border border-white/10 p-6'>
          <h3 className='text-white/70 text-sm mb-2'>Total Bookings</h3>
          <p className='text-3xl font-bold text-orange-500 font-mondwest'>
            {dashboardData.stats.totalBookings}
          </p>
          <p className='text-green-400 text-xs mt-1'>↗ +5 this month</p>
        </div>
        <div className='bg-white/5 border border-white/10 p-6'>
          <h3 className='text-white/70 text-sm mb-2'>Response Time</h3>
          <p className='text-3xl font-bold text-orange-500 font-mondwest'>
            {dashboardData.stats.responseTime}
          </p>
          <p className='text-yellow-400 text-xs mt-1'>→ Same as last month</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className='flex flex-wrap gap-4 mb-8 border-b border-dashed border-white pb-4'>
        {[
          DashboardTab.OVERVIEW,
          DashboardTab.BOOKINGS,
          DashboardTab.ANALYTICS,
          DashboardTab.SETTINGS,
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

      {/* Tab Content */}
      <div className='min-h-[400px]'>
        {/* Overview Tab */}
        {activeTab === DashboardTab.OVERVIEW && (
          <OverviewTab
            dashboardData={dashboardData}
            setActiveTab={setActiveTab}
            setSelectedBooking={setSelectedBooking}
            setIsModalOpen={setIsModalOpen}
          />
        )}

        {/* Bookings Tab */}
        {activeTab === DashboardTab.BOOKINGS && (
          <BookingsTab
            dashboardData={dashboardData}
            getStatusColor={getStatusColor}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === DashboardTab.ANALYTICS && (
          <AnalyticsTab dashboardData={dashboardData} />
        )}

        {/* Settings Tab */}
        {activeTab === DashboardTab.SETTINGS && (
          <SettingsTab
            profileVisibility={profileVisibility}
            setProfileVisibility={setProfileVisibility}
            acceptBookings={acceptBookings}
            setAcceptBookings={setAcceptBookings}
            showContact={showContact}
            setShowContact={setShowContact}
            emailNotifications={emailNotifications}
            setEmailNotifications={setEmailNotifications}
            smsNotifications={smsNotifications}
            setSmsNotifications={setSmsNotifications}
            pushNotifications={pushNotifications}
            setPushNotifications={setPushNotifications}
          />
        )}
      </div>

      {/* Booking Modal */}
      {selectedBooking && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default ArtistDashboard;
