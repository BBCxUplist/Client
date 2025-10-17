import { motion } from 'framer-motion';
import { useState } from 'react';
import { useGetActivityLogs, useGetActivityStats } from '@/hooks/admin';
import { formatDistanceToNow } from 'date-fns';

const RecentActivityTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterAction, setFilterAction] = useState<string>('');
  const [filterTargetType, setFilterTargetType] = useState<string>('');
  const pageLimit = 20;

  // Fetch activity logs and stats
  const {
    data: activityData,
    isLoading,
    error,
  } = useGetActivityLogs({
    limit: pageLimit,
    page: currentPage,
    ...(filterAction && { action: filterAction }),
    ...(filterTargetType && { targetType: filterTargetType }),
  });
  const { data: statsData } = useGetActivityStats({ days: 7 });

  const activities = activityData?.data?.activities || [];
  const pagination = activityData?.data?.pagination;

  // Map API action to display type for icon/color
  const getActivityType = (action: string, targetType: string): string => {
    if (action.includes('create') && targetType === 'user') return 'user';
    if (action.includes('artist') || targetType === 'artist') return 'artist';
    if (action.includes('booking') || targetType === 'booking')
      return 'booking';
    if (action.includes('payment') || targetType === 'payment')
      return 'payment';
    if (action.includes('report') || targetType === 'report') return 'report';
    if (action.includes('commission')) return 'commission';
    if (action.includes('verify') || action.includes('approve'))
      return 'verification';
    if (action.includes('suspend') || action.includes('ban'))
      return 'suspension';
    return 'user';
  };

  // Format action for display
  const formatAction = (action: string, targetType: string): string => {
    const actionMap: Record<string, string> = {
      create_artist: 'Created new artist',
      update_artist: 'Updated artist profile',
      delete_artist: 'Deleted artist',
      approve_artist: 'Approved artist',
      reject_artist: 'Rejected artist',
      ban_artist: 'Banned artist',
      unban_artist: 'Unbanned artist',
      create_user: 'New user registered',
      update_user: 'Updated user profile',
      delete_user: 'Deleted user',
      ban_user: 'Banned user',
      unban_user: 'Unbanned user',
      create_booking: 'Created booking',
      update_booking: 'Updated booking',
      cancel_booking: 'Cancelled booking',
      create_report: 'Submitted report',
      resolve_report: 'Resolved report',
    };

    return actionMap[action] || `${action.replace(/_/g, ' ')} ${targetType}`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return (
          <svg
            className='w-5 h-5 text-blue-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
            />
          </svg>
        );
      case 'artist':
        return (
          <svg
            className='w-5 h-5 text-green-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
            />
          </svg>
        );
      case 'booking':
        return (
          <svg
            className='w-5 h-5 text-purple-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
        );
      case 'payment':
        return (
          <svg
            className='w-5 h-5 text-yellow-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
            />
          </svg>
        );
      case 'report':
        return (
          <svg
            className='w-5 h-5 text-red-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        );
      case 'commission':
        return (
          <svg
            className='w-5 h-5 text-orange-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
            />
          </svg>
        );
      case 'verification':
        return (
          <svg
            className='w-5 h-5 text-indigo-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        );
      case 'suspension':
        return (
          <svg
            className='w-5 h-5 text-gray-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636'
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'border-blue-500/20 bg-blue-500/10';
      case 'artist':
        return 'border-green-500/20 bg-green-500/10';
      case 'booking':
        return 'border-purple-500/20 bg-purple-500/10';
      case 'payment':
        return 'border-yellow-500/20 bg-yellow-500/10';
      case 'report':
        return 'border-red-500/20 bg-red-500/10';
      case 'commission':
        return 'border-orange-500/20 bg-orange-500/10';
      case 'verification':
        return 'border-indigo-500/20 bg-indigo-500/10';
      case 'suspension':
        return 'border-gray-500/20 bg-gray-500/10';
      default:
        return 'border-white/10 bg-white/5';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-center'>
          <div className='animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4'></div>
          <p className='text-white/70'>Loading activity logs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='bg-red-500/10 border border-red-500/20 p-6 rounded-lg'>
        <p className='text-red-400 text-center'>
          Failed to load activity logs. Please try again.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='space-y-6'
    >
      <div>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h2 className='text-2xl font-bold text-white font-mondwest'>
              Recent Activity
            </h2>
            <p className='text-white/70'>
              Latest platform activities and events
            </p>
          </div>
          {pagination && (
            <div className='text-white/60 text-sm'>
              Showing {activities.length} of {pagination.total} activities
            </div>
          )}
        </div>

        {/* Filters */}
        <div className='flex flex-wrap gap-3'>
          <select
            value={filterTargetType}
            onChange={e => {
              setFilterTargetType(e.target.value);
              setCurrentPage(1);
            }}
            className='bg-white/5 border border-white/20 text-white px-4 py-2 rounded focus:border-orange-500 focus:outline-none'
          >
            <option value=''>All Types</option>
            <option value='user'>Users</option>
            <option value='artist'>Artists</option>
            <option value='booking'>Bookings</option>
            <option value='report'>Reports</option>
            <option value='payment'>Payments</option>
          </select>

          <select
            value={filterAction}
            onChange={e => {
              setFilterAction(e.target.value);
              setCurrentPage(1);
            }}
            className='bg-white/5 border border-white/20 text-white px-4 py-2 rounded focus:border-orange-500 focus:outline-none'
          >
            <option value=''>All Actions</option>
            <option value='create_artist'>Create Artist</option>
            <option value='update_artist'>Update Artist</option>
            <option value='approve_artist'>Approve Artist</option>
            <option value='reject_artist'>Reject Artist</option>
            <option value='ban_artist'>Ban Artist</option>
            <option value='create_user'>Create User</option>
            <option value='ban_user'>Ban User</option>
            <option value='create_booking'>Create Booking</option>
            <option value='create_report'>Create Report</option>
            <option value='resolve_report'>Resolve Report</option>
          </select>

          {(filterAction || filterTargetType) && (
            <button
              onClick={() => {
                setFilterAction('');
                setFilterTargetType('');
                setCurrentPage(1);
              }}
              className='bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-2 rounded hover:bg-red-500/30 transition-colors'
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Activity Stats */}
      {statsData?.data?.stats && (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {statsData.data.stats.slice(0, 4).map((stat, index) => (
            <div
              key={index}
              className='bg-white/5 border border-white/10 p-4 rounded-lg'
            >
              <p className='text-white/60 text-xs mb-1'>
                {stat.action.replace(/_/g, ' ').toUpperCase()}
              </p>
              <p className='text-white text-2xl font-bold'>{stat.count}</p>
            </div>
          ))}
        </div>
      )}

      {/* Activity List */}
      <div className='space-y-4'>
        {activities.length === 0 ? (
          <div className='bg-white/5 border border-white/10 p-12 rounded-lg text-center'>
            <p className='text-white/60'>No recent activity to display</p>
          </div>
        ) : (
          activities.map((item, index) => {
            const activityType = getActivityType(
              item.activity.action,
              item.activity.targetType
            );
            const displayAction = formatAction(
              item.activity.action,
              item.activity.targetType
            );
            const timeAgo = formatDistanceToNow(
              new Date(item.activity.createdAt),
              { addSuffix: true }
            );

            return (
              <motion.div
                key={item.activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.05, 0.5),
                }}
                className={`flex items-start gap-4 p-4 border rounded-lg ${getActivityColor(activityType)}`}
              >
                <div className='flex-shrink-0 mt-1'>
                  {getActivityIcon(activityType)}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-white text-sm font-medium'>
                    {displayAction}
                  </p>
                  <p className='text-white/60 text-xs'>
                    {item.actor?.displayName ||
                      item.actor?.username ||
                      'Unknown user'}
                    {item.activity.metadata?.targetName && (
                      <span className='text-white/40'>
                        {' → '}
                        {item.activity.metadata.targetName}
                      </span>
                    )}
                  </p>
                </div>
                <span className='text-white/40 text-xs flex-shrink-0'>
                  {timeAgo}
                </span>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className='flex items-center justify-center gap-4 pt-4'>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className='bg-white/5 border border-white/10 text-white/70 px-6 py-3 hover:bg-white/10 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Previous
          </button>
          <span className='text-white/70 text-sm'>
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))
            }
            disabled={currentPage === pagination.totalPages}
            className='bg-white/5 border border-white/10 text-white/70 px-6 py-3 hover:bg-white/10 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default RecentActivityTab;
