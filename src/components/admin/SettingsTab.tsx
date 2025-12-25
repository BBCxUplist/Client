import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import {
  useGetAdminUsers,
  useGetAllUsers,
  usePromoteUser,
  useDemoteUser,
} from '@/hooks/admin';

const SettingsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionInProgress, setActionInProgress] = useState<{
    type: 'promote' | 'demote' | null;
    userId: string | null;
  }>({ type: null, userId: null });

  // Fetch admin users
  const { data: adminUsersData, isLoading: adminsLoading } = useGetAdminUsers();

  // Fetch all users for search
  const { data: allUsersData, isLoading: usersLoading } = useGetAllUsers();

  // Admin action hooks
  const promoteUser = usePromoteUser();
  const demoteUser = useDemoteUser();

  // Get admin users
  const adminUsers = useMemo(() => {
    return adminUsersData?.data?.users || [];
  }, [adminUsersData]);

  // Get non-admin users for search (exclude artists and admins)
  const searchableUsers = useMemo(() => {
    const allUsers = allUsersData?.data?.users || [];
    return allUsers.filter(
      (user: any) => user.role !== 'admin' && !user.isArtist
    );
  }, [allUsersData]);

  // Filter users based on search term
  const filteredSearchUsers = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return searchableUsers
      .filter(
        (user: any) =>
          user.username?.toLowerCase().includes(term) ||
          user.useremail?.toLowerCase().includes(term) ||
          user.displayName?.toLowerCase().includes(term)
      )
      .slice(0, 5); // Limit to 5 results
  }, [searchTerm, searchableUsers]);

  const handlePromoteToAdmin = (userId: string) => {
    setActionInProgress({ type: 'promote', userId });
    promoteUser.mutate(
      {
        userId,
        data: {
          role: 'admin',
        },
      },
      {
        onSettled: () => {
          setActionInProgress({ type: null, userId: null });
          setSearchTerm('');
        },
      }
    );
  };

  const handleDemoteAdmin = (userId: string) => {
    setActionInProgress({ type: 'demote', userId });
    demoteUser.mutate(userId, {
      onSettled: () => setActionInProgress({ type: null, userId: null }),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='space-y-6'
    >
      <div>
        <h2 className='text-2xl font-bold text-white mb-4'>Settings</h2>
        <p className='text-white/70'>
          Manage admin users and platform configuration
        </p>
      </div>

      {/* Admin Management Section */}
      <div className='bg-white/5 border border-white/10 p-6 rounded-lg'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h3 className='text-xl font-semibold text-white'>
              Admin Management
            </h3>
            <p className='text-white/60 text-sm mt-1'>
              {adminUsers.length} admin{adminUsers.length !== 1 ? 's' : ''}{' '}
              currently active
            </p>
          </div>
        </div>

        {/* Search Users to Promote */}
        <div className='mb-6'>
          <label className='block text-white/70 text-sm mb-2'>
            Search Users to Promote to Admin
          </label>
          <div className='relative'>
            <input
              type='text'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder='Search by username or email...'
              className='w-full bg-white/5 border border-white/20 text-white p-3 rounded focus:border-orange-500 focus:outline-none'
            />
            {usersLoading && searchTerm && (
              <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                <div className='animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full'></div>
              </div>
            )}
          </div>

          {/* Search Results */}
          {filteredSearchUsers.length > 0 && (
            <div className='mt-2 bg-white/5 border border-white/20 rounded-lg overflow-hidden'>
              {filteredSearchUsers.map((user: any) => (
                <div
                  key={user.id}
                  className='flex items-center justify-between p-3 hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0'
                >
                  <div className='flex items-center gap-3'>
                    <div>
                      <p className='text-white font-medium'>
                        {user.displayName || user.username}
                      </p>
                      <p className='text-white/60 text-sm'>{user.useremail}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePromoteToAdmin(user.id)}
                    disabled={
                      actionInProgress.type === 'promote' &&
                      actionInProgress.userId === user.id
                    }
                    className='bg-purple-500/20 border border-purple-500/40 text-purple-400 px-3 py-1 rounded hover:bg-purple-500/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {actionInProgress.type === 'promote' &&
                    actionInProgress.userId === user.id
                      ? 'Promoting...'
                      : 'Promote to Admin'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {searchTerm && filteredSearchUsers.length === 0 && !usersLoading && (
            <p className='text-white/50 text-sm mt-2'>
              No users found matching "{searchTerm}"
            </p>
          )}
        </div>

        {/* Current Admins List */}
        <div>
          <h4 className='text-white font-semibold mb-4'>Current Admins</h4>

          {adminsLoading ? (
            <div className='flex items-center justify-center py-8'>
              <div className='animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full'></div>
            </div>
          ) : adminUsers.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-white/60'>No admin users found</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {adminUsers.map((admin: any) => (
                <motion.div
                  key={admin.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='bg-white/5 border border-white/10 p-4 rounded-lg flex items-center justify-between'
                >
                  <div className='flex items-center gap-3'>
                    <div>
                      <div className='flex items-center gap-2'>
                        <p className='text-white font-semibold'>
                          {admin.displayName || admin.username}
                        </p>
                      </div>
                      <p className='text-white/60 text-sm'>{admin.useremail}</p>
                      <p className='text-white/40 text-xs mt-1'>
                        Joined: {new Date(admin.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        admin.isActive && !admin.banned
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {admin.isActive && !admin.banned ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <button
                      onClick={() => handleDemoteAdmin(admin.id)}
                      disabled={
                        actionInProgress.type === 'demote' &&
                        actionInProgress.userId === admin.id
                      }
                      className='bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded hover:bg-red-500/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {actionInProgress.type === 'demote' &&
                      actionInProgress.userId === admin.id
                        ? 'Demoting...'
                        : 'Demote to User'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Platform Settings Section */}
      <div className='bg-white/5 border border-white/10 p-6 rounded-lg'>
        <h3 className='text-xl font-semibold text-white mb-4'>
          Platform Settings
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Commission Rate (%)
            </label>
            <input
              type='number'
              defaultValue='10'
              className='w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none'
            />
          </div>
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Auto-verification Threshold
            </label>
            <input
              type='number'
              defaultValue='4.5'
              className='w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none'
            />
          </div>
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Payment Gateway
            </label>
            <select className='w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none'>
              <option>Stripe</option>
              <option>PayPal</option>
              <option>Razorpay</option>
            </select>
          </div>
          <div>
            <label className='block text-white/70 text-sm mb-2'>
              Default Currency
            </label>
            <select className='w-full bg-white/5 border border-white/20 text-white p-2 rounded focus:border-orange-500 focus:outline-none'>
              <option>USD</option>
              <option>INR</option>
              <option>EUR</option>
            </select>
          </div>
        </div>
        <div className='mt-6'>
          <button className='bg-orange-500 text-black px-6 py-2 font-semibold hover:bg-orange-600 transition-colors rounded'>
            Save Settings
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsTab;
