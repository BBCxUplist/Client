import { motion } from 'framer-motion';

interface AnalyticsTabProps {
  dashboardData: any;
}

const AnalyticsTab = ({ dashboardData }: AnalyticsTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-8'
    >
      <h3 className='text-2xl font-semibold text-white font-mondwest'>
        Performance Analytics
      </h3>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white/5 border border-white/10 p-6'>
          <h4 className='text-white/70 text-sm mb-2'>
            Profile Views (This Month)
          </h4>
          <p className='text-3xl font-bold text-orange-500 font-mondwest'>
            {dashboardData.stats.profileViews}
          </p>
          <p className='text-green-400 text-xs mt-1'>↗ +18% from last month</p>
        </div>
        <div className='bg-white/5 border border-white/10 p-6'>
          <h4 className='text-white/70 text-sm mb-2'>Booking Requests</h4>
          <p className='text-3xl font-bold text-orange-500 font-mondwest'>
            {dashboardData.stats.bookingRequests}
          </p>
          <p className='text-green-400 text-xs mt-1'>↗ +12% from last month</p>
        </div>
        <div className='bg-white/5 border border-white/10 p-6'>
          <h4 className='text-white/70 text-sm mb-2'>Conversion Rate</h4>
          <p className='text-3xl font-bold text-orange-500 font-mondwest'>
            {dashboardData.stats.conversionRate}%
          </p>
          <p className='text-yellow-400 text-xs mt-1'>→ Same as last month</p>
        </div>
      </div>

      {/* Improvement Tips */}
      <div className='bg-orange-500/10 border border-orange-500/30 p-6'>
        <h4 className='text-xl font-semibold text-orange-400 mb-4 font-mondwest'>
          Tips to Improve Performance
        </h4>
        <ul className='space-y-3 text-white/80'>
          <li className='flex items-start gap-3'>
            <div className='w-2 h-2 bg-orange-500 mt-2 flex-shrink-0'></div>
            <span>
              Update your gallery with recent performance photos to attract more
              bookings
            </span>
          </li>
          <li className='flex items-start gap-3'>
            <div className='w-2 h-2 bg-orange-500 mt-2 flex-shrink-0'></div>
            <span>
              Respond to booking requests within 1 hour to improve your response
              time
            </span>
          </li>
          <li className='flex items-start gap-3'>
            <div className='w-2 h-2 bg-orange-500 mt-2 flex-shrink-0'></div>
            <span>Add more music samples to showcase your versatility</span>
          </li>
          <li className='flex items-start gap-3'>
            <div className='w-2 h-2 bg-orange-500 mt-2 flex-shrink-0'></div>
            <span>
              Keep your availability calendar updated to avoid booking conflicts
            </span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default AnalyticsTab;
