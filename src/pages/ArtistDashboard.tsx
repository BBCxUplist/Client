// pages/ArtistDashboard.tsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { artists } from '@/constants/artists';
import { formatPrice } from '@/helper';
import { dummyDashboardData } from '@/constants/dashboardData';
import BookingModal from '@/components/ui/BookingModal';
import OverviewTab from '@/components/artistDashboard/OverviewTab';
import BookingsTab from '@/components/artistDashboard/BookingsTab';
import AnalyticsTab from '@/components/artistDashboard/AnalyticsTab';
import SettingsTab from '@/components/artistDashboard/SettingsTab';
import { DashboardTab } from '@/types';

const ArtistDashboard = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState<DashboardTab>(
    DashboardTab.OVERVIEW
  );
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Settings states
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [acceptBookings, setAcceptBookings] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Find artist data (in real app, verify this matches logged-in user)
  const artist = artists.find(a => a.slug === username);
  const dashboardData = dummyDashboardData;

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
      {/* Dashboard Header */}
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8'>
        <div>
          <h1 className='font-mondwest text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2'>
            YOUR DASHBOARD
          </h1>
          <p className='text-white/70 text-lg'>Welcome back, {artist.name}</p>
        </div>
        <div className='flex flex-wrap gap-3 mt-4 lg:mt-0'>
          <Link to={`/artist/${username}`}>
            <button className='bg-white/10 border border-white/30 text-white px-4 py-2 font-semibold hover:bg-white/20 transition-colors'>
              VIEW PUBLIC PROFILE
            </button>
          </Link>
          <Link to={`/artist/${username}/edit`}>
            <button className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'>
              EDIT PROFILE
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
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
