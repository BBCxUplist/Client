import { motion } from 'framer-motion';

const RecentActivityTab = () => {
  const recentActivities = [
    {
      type: 'user',
      action: 'New user registered',
      time: '2 minutes ago',
      user: 'john.doe@email.com',
    },
    {
      type: 'artist',
      action: 'Artist profile verified',
      time: '15 minutes ago',
      user: 'Sarah Johnson',
    },
    {
      type: 'booking',
      action: 'New booking created',
      time: '1 hour ago',
      user: 'Corporate Event Co.',
    },
    {
      type: 'payment',
      action: 'Payment processed',
      time: '2 hours ago',
      user: 'Wedding Planner Inc.',
    },
    {
      type: 'report',
      action: 'Report submitted',
      time: '3 hours ago',
      user: 'User123',
    },
    {
      type: 'commission',
      action: 'Commission earned',
      time: '4 hours ago',
      user: 'Artist Booking',
    },
    {
      type: 'verification',
      action: 'Artist appeal reviewed',
      time: '5 hours ago',
      user: 'Mike Chen',
    },
    {
      type: 'suspension',
      action: 'User account suspended',
      time: '6 hours ago',
      user: 'ProblemUser',
    },
  ];

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='space-y-6'
    >
      <div>
        <h2 className='text-2xl font-bold text-white mb-4'>Recent Activity</h2>
        <p className='text-white/70'>Latest platform activities and events</p>
      </div>

      {/* Activity List */}
      <div className='space-y-4'>
        {recentActivities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex items-start gap-4 p-4 border rounded-lg ${getActivityColor(activity.type)}`}
          >
            <div className='flex-shrink-0 mt-1'>
              {getActivityIcon(activity.type)}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-white text-sm font-medium'>
                {activity.action}
              </p>
              <p className='text-white/60 text-xs'>{activity.user}</p>
            </div>
            <span className='text-white/40 text-xs flex-shrink-0'>
              {activity.time}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      <div className='text-center pt-4'>
        <button className='bg-white/5 border border-white/10 text-white/70 px-6 py-3 hover:bg-white/10 transition-colors rounded'>
          Load More Activities
        </button>
      </div>
    </motion.div>
  );
};

export default RecentActivityTab;
