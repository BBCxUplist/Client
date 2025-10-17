// pages/AdminDashboard.tsx
import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OverviewTab from '@/components/admin/OverviewTab';
import ArtistsTab from '@/components/admin/ArtistsTab';
import CreateArtistTab from '@/components/admin/CreateArtistTab';
// import ApprovedTab from '@/components/admin/ApprovedTab';
import UsersTab from '@/components/admin/UsersTab';
import ReportsTab from '@/components/admin/ReportsTab';
import RecentActivityTab from '@/components/admin/RecentActivityTab';
import SettingsTab from '@/components/admin/SettingsTab';
import { formatPrice } from '@/helper';
import { useGetAllUsers, useHealthCheck } from '@/hooks/admin';
import { useCreateArtist } from '@/hooks/admin/useCreateArtist';
import { useStore } from '@/stores/store';
import toast from 'react-hot-toast';

enum AdminTab {
  OVERVIEW = 'overview',
  ARTISTS = 'artists',
  CREATE_ARTIST = 'create-artist',
  // APPROVED = 'approved',
  USERS = 'users',
  REPORTS = 'reports',
  RECENT_ACTIVITY = 'recent-activity',
  SETTINGS = 'settings',
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.OVERVIEW);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch real data from APIs
  const { data: usersData, isLoading: usersLoading } = useGetAllUsers();
  const { data: healthData } = useHealthCheck();
  const createArtistMutation = useCreateArtist();

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Unauthorized access. Admin only.');
      navigate('/');
    }
  }, [user, navigate]);

  // Calculate dashboard statistics from users data (includes artists)
  const dashboardStats = useMemo(() => {
    const allUsers = usersData?.data?.users || [];

    // Filter only artists from users
    const artists = allUsers.filter((u: any) => u.isArtist === true);

    const totalArtists = artists.length;
    // Verified artists are those with isApproved === true
    const verifiedArtists = artists.filter(
      (a: any) => a.isApproved === true
    ).length;
    // Pending artists are those with isApproved === false or not approved
    const pendingArtists = artists.filter((a: any) => !a.isApproved).length;

    // Calculate revenue based on base prices (simplified calculation)
    const totalRevenue = artists.reduce(
      (sum: number, a: any) => sum + (a.basePrice || 0) * 10,
      0
    );

    const featuredArtists = artists.filter((a: any) => a.featured).length;

    return {
      totalArtists,
      verifiedArtists,
      pendingArtists,
      totalRevenue,
      featuredArtists,
    };
  }, [usersData]);

  // Get real artists data for filtering
  const adminArtists = useMemo(() => {
    const allUsers = usersData?.data?.users || [];

    // Filter only artists from users
    const artists = allUsers.filter((u: any) => u.isArtist === true);

    return artists.map((artist: any) => {
      // Determine status based on isApproved and banned flags
      let status: 'verified' | 'appeal' | 'rejected' | 'suspended' = 'appeal';
      if (artist.banned) {
        status = 'suspended';
      } else if (artist.isApproved) {
        status = 'verified';
      } else if (artist.appealStatus === 'rejected') {
        status = 'rejected';
      }

      return {
        id: artist.id,
        name: artist.displayName || artist.username,
        email: artist.useremail,
        status,
        joinDate: new Date(artist.createdAt).toISOString().split('T')[0],
        bookings: 0, // TODO: Add bookings count from API
        revenue: (artist.basePrice || 0) * 10, // Simplified calculation
        slug: artist.username,
        avatar: artist.avatar,
        bio: artist.bio,
        price: artist.basePrice,
        genres: artist.genres || [],
        isBookable: artist.isBookable,
        appealStatus: artist.appealStatus,
        isApproved: artist.isApproved,
        featured: artist.featured || false,
        createdAt: artist.createdAt,
      };
    });
  }, [usersData]);

  // Get real users data for filtering
  const allUsers = useMemo(() => {
    const apiUsers = usersData?.data?.users || [];
    return apiUsers.map((user: any) => ({
      id: user.id,
      name: user.displayName || user.username,
      email: user.useremail,
      status: (user.banned
        ? 'banned'
        : user.isActive
          ? 'active'
          : 'suspended') as 'active' | 'suspended' | 'banned',
      joinDate: new Date(user.createdAt).toISOString().split('T')[0],
      bookings: 0, // TODO: Add bookings count from API
      totalSpent: 0, // TODO: Add total spent from API
    }));
  }, [usersData]);

  // Filtering logic for artists
  const filteredArtists = useMemo(() => {
    return adminArtists.filter((artist: any) => {
      const matchesSearch =
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by status
      const matchesStatus =
        filterStatus === 'all' || artist.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, adminArtists]);

  // Filtering logic for users
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user: any) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === 'all' || user.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, allUsers]);

  // No longer needed - actions are handled directly in ArtistsTab
  // const handleStatusChange = (
  //   id: string,
  //   newStatus: string,
  //   type: 'artist' | 'user'
  // ) => {
  //   console.log(`Changing ${type} ${id} status to ${newStatus}`);
  // };

  const handleCreateArtist = async (artistData: any) => {
    try {
      // Map the form data to match the API expected format
      const apiData = {
        email: artistData.email,
        username: artistData.username,
        displayName: artistData.displayName,
        bio: artistData.bio,
        phone: artistData.phone,
        location: artistData.location,
        socials: artistData.socials,
        genres: artistData.genres,
        basePrice: artistData.price,
        isBookable: artistData.isBookable,
        isAvailable: artistData.isAvailable,
      };

      await createArtistMutation.mutateAsync(apiData);

      // Switch back to artists tab to see the new artist
      setActiveTab(AdminTab.ARTISTS);
    } catch (error) {
      console.error('Error creating artist:', error);
      // Error handling is done by the hook
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  // Show loading state
  if (usersLoading) {
    return (
      <div className='min-h-screen bg-neutral-950 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4'></div>
          <p className='text-white text-lg'>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Header */}
      <div className='bg-black border-b border-dashed border-white/20 p-4 lg:p-6 sticky top-0 z-10'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link to='/' className='relative'>
              <p className='font-mondwest text-xl lg:text-2xl font-bold text-white py-2 px-4 border border-white/20'>
                UPLIST
              </p>
              <span className='absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-orange-500'></span>
              <span className='absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-orange-500'></span>
              <span className='absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-orange-500'></span>
              <span className='absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-orange-500'></span>
            </Link>
            <div className='hidden lg:block'>
              <h1 className='font-mondwest text-xl font-bold text-white'>
                ADMIN DASHBOARD
              </h1>
              <p className='text-white/60 text-sm'>
                Administrative Control Panel
              </p>
              <div className='flex gap-4 mt-2 text-xs'>
                <span className='text-white/80'>
                  Artists: {dashboardStats.totalArtists} | Verified:{' '}
                  {dashboardStats.verifiedArtists} | Pending:{' '}
                  {dashboardStats.pendingArtists}
                </span>
                <span className='text-orange-400'>
                  Total Revenue: {formatPrice(dashboardStats.totalRevenue)}
                </span>
                {healthData && (
                  <span
                    className={`flex items-center gap-1 ${
                      healthData.status === 'OK'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        healthData.status === 'OK'
                          ? 'bg-green-400'
                          : 'bg-red-400'
                      }`}
                    ></span>
                    System: {healthData.status}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className='bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-2 hover:bg-red-500/30 transition-colors text-sm font-semibold'
          >
            LOGOUT
          </button>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row min-h-full flex-1'>
        {/* Mobile Menu Button */}
        <div className='lg:hidden bg-neutral-900 border-b border-dashed border-white/20 p-4'>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='flex items-center justify-between w-full p-3 bg-white/5 border border-white/20'
          >
            <div className='flex items-center gap-3'>
              <img
                src={
                  [
                    { id: 'overview', icon: '/icons/overview.png' },
                    { id: 'artists', icon: '/icons/artist.png' },
                    { id: 'users', icon: '/icons/users.png' },
                    { id: 'bookings', icon: '/icons/calendar.png' },
                    { id: 'reports', icon: '/icons/report.png' },
                    { id: 'settings', icon: '/icons/settings.png' },
                  ].find(tab => tab.id === activeTab)?.icon
                }
                alt='Active tab'
                className='w-6 h-6 invert'
              />
              <span className='text-white font-semibold'>
                {
                  [
                    { id: 'overview', label: 'Overview' },
                    { id: 'artists', label: 'Artists' },
                    { id: 'create-artist', label: 'Create Artist' },
                    // { id: 'approved', label: 'Approved' },
                    { id: 'users', label: 'Users' },
                    { id: 'bookings', label: 'Bookings' },
                    { id: 'reports', label: 'Reports' },
                    { id: 'recent-activity', label: 'Recent Activity' },
                    { id: 'settings', label: 'Settings' },
                  ].find(tab => tab.id === activeTab)?.label
                }
              </span>
            </div>
            <img
              src='/icons/angleDown.png'
              alt='arrowDown'
              className={`w-5 h-5 transition-transform duration-300 invert ${mobileMenuOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`lg:hidden bg-neutral-900 border-b border-dashed border-white/20 transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className='p-4 space-y-2'>
            {[
              {
                id: 'overview',
                label: 'Overview',
                icon: '/icons/overview.png',
              },
              { id: 'artists', label: 'Artists', icon: '/icons/artist.png' },
              {
                id: 'create-artist',
                label: 'Create Artist',
                icon: '/icons/frame.svg',
              },
              { id: 'approved', label: 'Approved', icon: '/icons/check.png' },
              { id: 'users', label: 'Users', icon: '/icons/users.png' },
              { id: 'reports', label: 'Reports', icon: '/icons/tick.svg' },
              {
                id: 'recent-activity',
                label: 'Recent Activity',
                icon: '/icons/overview.png',
              },
              {
                id: 'settings',
                label: 'Settings',
                icon: '/icons/settings.png',
              },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as AdminTab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-3 font-semibold transition-all duration-300 flex items-center gap-3  ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <img
                  src={tab.icon}
                  alt={tab.label}
                  className={`w-6 h-6 ${activeTab === tab.id ? '' : 'invert'}`}
                />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Desktop Sidebar */}
        <div className='hidden lg:block lg:w-64 bg-neutral-900 border-r border-dashed border-white/20 p-4 sticky top-[121px] h-[calc(100dvh-121px)]'>
          <nav className='space-y-2'>
            {[
              {
                id: 'overview',
                label: 'Overview',
                icon: '/icons/overview.png',
              },
              { id: 'artists', label: 'Artists', icon: '/icons/artist.png' },
              {
                id: 'create-artist',
                label: 'Create Artist',
                icon: '/icons/frame.svg',
              },
              // { id: 'approved', label: 'Approved', icon: '/icons/tick.svg' },
              { id: 'users', label: 'Users', icon: '/icons/users.png' },
              { id: 'reports', label: 'Reports', icon: '/icons/report.png' },
              {
                id: 'recent-activity',
                label: 'Recent Activity',
                icon: '/icons/overview.png',
              },
              {
                id: 'settings',
                label: 'Settings',
                icon: '/icons/settings.png',
              },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`w-full text-left p-3 font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <img
                  src={tab.icon}
                  alt={tab.label}
                  className={`w-7 h-7 ${activeTab === tab.id ? '' : 'invert'}`}
                />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className='flex-1 p-4 lg:p-6'>
          {/* Overview Tab */}
          {activeTab === AdminTab.OVERVIEW && (
            <OverviewTab dashboardStats={dashboardStats} />
          )}

          {/* Artists Tab */}
          {activeTab === AdminTab.ARTISTS && (
            <ArtistsTab
              searchTerm={searchTerm}
              filterStatus={filterStatus}
              filteredArtists={filteredArtists}
              onSearchChange={setSearchTerm}
              onFilterChange={setFilterStatus}
            />
          )}

          {/* Create Artist Tab */}
          {activeTab === AdminTab.CREATE_ARTIST && (
            <CreateArtistTab onCreateArtist={handleCreateArtist} />
          )}

          {/* Approved Tab */}
          {/* {activeTab === AdminTab.APPROVED && (
            <ApprovedTab
              onStatusChange={(id, status) =>
                console.log(`Artist ${id} ${status}`)
              }
            />
          )} */}

          {/* Users Tab */}
          {activeTab === AdminTab.USERS && (
            <UsersTab
              searchTerm={searchTerm}
              filteredUsers={filteredUsers}
              onSearchChange={setSearchTerm}
            />
          )}

          {/* Reports Tab */}
          {activeTab === AdminTab.REPORTS && <ReportsTab dummyReports={[]} />}

          {/* Recent Activity Tab */}
          {activeTab === AdminTab.RECENT_ACTIVITY && <RecentActivityTab />}

          {/* Settings Tab */}
          {activeTab === AdminTab.SETTINGS && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
