import { motion } from 'framer-motion';
import { formatPrice } from '@/helper';
import {
  useGetActivityStats,
  useGetAllReports,
  useHealthCheck,
} from '@/hooks/admin';

interface OverviewTabProps {
  dashboardStats: {
    totalArtists: number;
    verifiedArtists: number;
    pendingArtists: number;
    totalRevenue: number;
    featuredArtists: number;
  };
}

const OverviewTab = ({ dashboardStats }: OverviewTabProps) => {
  // Fetch real-time data
  const { data: activityStats } = useGetActivityStats({ days: 30 });
  const { data: reportsData } = useGetAllReports({
    status: 'pending',
    limit: 10,
  });
  const { data: healthData } = useHealthCheck();

  // Calculate totals from activity stats
  const totalRegistrations =
    activityStats?.data?.stats?.find(s => s.action === 'user_registered')
      ?.count || 0;

  const totalBookings =
    activityStats?.data?.stats?.find(s => s.action === 'booking_created')
      ?.count || 0;

  const pendingReportsCount = reportsData?.data?.total || 0;

  // Use real data from dashboard
  const stats = [
    {
      label: 'Total Artists',
      value: dashboardStats.totalArtists.toString(),
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      label: 'Verified Artists',
      value: dashboardStats.verifiedArtists.toString(),
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      label: 'Pending Artists',
      value: dashboardStats.pendingArtists.toString(),
      change: '+2%',
      changeType: 'positive' as const,
    },
    {
      label: 'Total Revenue',
      value: formatPrice(dashboardStats.totalRevenue),
      change: '+18%',
      changeType: 'positive' as const,
    },
    {
      label: 'Featured Artists',
      value: dashboardStats.featuredArtists.toString(),
      change: '+3%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='space-y-6'
    >
      <div>
        <h2 className='text-2xl font-bold text-white mb-4'>
          Platform Overview
        </h2>
        <p className='text-white/70'>Key metrics and performance indicators</p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className='bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all duration-300'
          >
            <div className='flex items-center justify-between mb-2'>
              <p className='text-white/60 text-sm'>{stat.label}</p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  stat.changeType === 'positive'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <p className='text-3xl font-bold text-white font-mondwest'>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='bg-white/5 border border-white/10 p-6'
      >
        <h3 className='text-white font-semibold text-lg mb-4'>
          Activity Overview (Last 30 Days)
        </h3>
        <div className='space-y-3'>
          <div className='flex items-center justify-between p-3 bg-white/5 border border-white/10'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-green-500/20 border border-green-500/30 flex items-center justify-center'>
                <svg
                  className='w-4 h-4 text-green-400'
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
              </div>
              <div>
                <p className='text-white font-semibold'>New Registrations</p>
                <p className='text-white/60 text-xs'>Users joined</p>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-green-400 font-bold text-xl'>
                {totalRegistrations}
              </p>
            </div>
          </div>
          <div className='flex items-center justify-between p-3 bg-white/5 border border-white/10'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-blue-500/20 border border-blue-500/30 flex items-center justify-center'>
                <svg
                  className='w-4 h-4 text-blue-400'
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
              </div>
              <div>
                <p className='text-white font-semibold'>Total Bookings</p>
                <p className='text-white/60 text-xs'>Created this month</p>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-blue-400 font-bold text-xl'>{totalBookings}</p>
            </div>
          </div>
          <div className='flex items-center justify-between p-3 bg-white/5 border border-white/10'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-red-500/20 border border-red-500/30 flex items-center justify-center'>
                <svg
                  className='w-4 h-4 text-red-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
              </div>
              <div>
                <p className='text-white font-semibold'>Pending Reports</p>
                <p className='text-white/60 text-xs'>Require attention</p>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-red-400 font-bold text-xl'>
                {pendingReportsCount}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='bg-white/5 border border-white/10 p-6'
        >
          <h3 className='text-white font-semibold text-lg mb-4'>
            Quick Actions
          </h3>
          <div className='space-y-3'>
            <button className='w-full bg-orange-500/20 border border-orange-500/30 text-orange-400 p-3 text-left hover:bg-orange-500/30 transition-colors'>
              <div className='flex items-center gap-3'>
                <svg
                  className='w-5 h-5'
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
                <span>Verify New Artist</span>
              </div>
            </button>
            <button className='w-full bg-white/5 border border-white/10 text-white/70 p-3 text-left hover:bg-white/10 transition-colors'>
              <div className='flex items-center gap-3'>
                <svg
                  className='w-5 h-5'
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
                <span>Review Reports</span>
              </div>
            </button>
            <button className='w-full bg-white/5 border border-white/10 text-white/70 p-3 text-left hover:bg-white/10 transition-colors'>
              <div className='flex items-center gap-3'>
                <svg
                  className='w-5 h-5'
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
                <span>Process Refunds</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='bg-white/5 border border-white/10 p-6'
        >
          <h3 className='text-white font-semibold text-lg mb-4'>
            System Status
          </h3>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div
                  className={`w-3 h-3 rounded-full ${
                    healthData?.services?.api?.status === 'OK'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                ></div>
                <span className='text-white/80 text-sm'>API</span>
              </div>
              <span className='text-white/60 text-xs'>
                {healthData?.services?.api?.responseTime
                  ? `${healthData.services.api.responseTime}ms`
                  : 'N/A'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div
                  className={`w-3 h-3 rounded-full ${
                    healthData?.services?.database?.status === 'OK'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                ></div>
                <span className='text-white/80 text-sm'>Database</span>
              </div>
              <span className='text-white/60 text-xs'>
                {healthData?.services?.database?.responseTime
                  ? `${healthData.services.database.responseTime}ms`
                  : 'N/A'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div
                  className={`w-3 h-3 rounded-full ${
                    healthData?.status === 'OK'
                      ? 'bg-green-500'
                      : healthData?.status === 'DEGRADED'
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                  }`}
                ></div>
                <span className='text-white/80 text-sm'>Overall Status</span>
              </div>
              <span
                className={`text-xs font-semibold ${
                  healthData?.status === 'OK'
                    ? 'text-green-400'
                    : healthData?.status === 'DEGRADED'
                      ? 'text-orange-400'
                      : 'text-red-400'
                }`}
              >
                {healthData?.status || 'UNKNOWN'}
              </span>
            </div>
            {healthData?.services?.database?.error && (
              <div className='pt-2 border-t border-white/10'>
                <span className='text-red-400 text-xs'>
                  DB Error: {healthData.services.database.error}
                </span>
              </div>
            )}
            {healthData && (
              <div className='pt-2 border-t border-white/10 space-y-1'>
                <div className='flex justify-between text-xs'>
                  <span className='text-white/60'>Environment:</span>
                  <span className='text-white/80'>
                    {healthData.environment}
                  </span>
                </div>
                <div className='flex justify-between text-xs'>
                  <span className='text-white/60'>Uptime:</span>
                  <span className='text-white/80'>
                    {Math.floor(healthData.uptime / 3600)}h{' '}
                    {Math.floor((healthData.uptime % 3600) / 60)}m
                  </span>
                </div>
                <div className='flex justify-between text-xs'>
                  <span className='text-white/60'>Last checked:</span>
                  <span className='text-white/80'>
                    {new Date(healthData.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Platform Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className='bg-white/5 border border-white/10 p-6'
        >
          <h3 className='text-white font-semibold text-lg mb-4'>
            Platform Statistics
          </h3>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-white/70 text-sm'>Total Users</span>
              <span className='text-white font-semibold'>
                {healthData?.services?.database?.statistics?.totalUsers || 0}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-white/70 text-sm'>Total Artists</span>
              <span className='text-white font-semibold'>
                {healthData?.services?.database?.statistics?.totalArtists || 0}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-white/70 text-sm'>Verified Artists</span>
              <span className='text-white font-semibold'>
                {dashboardStats.verifiedArtists}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-white/70 text-sm'>Pending Artists</span>
              <span className='text-orange-400 font-semibold'>
                {dashboardStats.pendingArtists}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-white/70 text-sm'>Total Bookings</span>
              <span className='text-white font-semibold'>
                {healthData?.services?.database?.statistics?.totalBookings || 0}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-white/70 text-sm'>Total Messages</span>
              <span className='text-white font-semibold'>
                {healthData?.services?.database?.statistics?.totalMessages || 0}
              </span>
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-white/70 text-sm'>Active Reports</span>
              <span
                className={`font-semibold ${
                  pendingReportsCount > 0 ? 'text-red-400' : 'text-white'
                }`}
              >
                {pendingReportsCount}
              </span>
            </div>
            <div className='pt-2 border-t border-white/10'>
              <div className='flex justify-between items-center'>
                <span className='text-white/70 text-sm'>New Users (30d)</span>
                <span className='text-green-400 font-semibold'>
                  {totalRegistrations}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OverviewTab;
