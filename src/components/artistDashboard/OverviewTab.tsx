import { motion } from 'framer-motion';
import { DashboardTab } from '@/types';

interface OverviewTabProps {
  dashboardData: any;
  setActiveTab: (tab: DashboardTab) => void;
  setSelectedBooking: (booking: any) => void;
  setIsModalOpen: (open: boolean) => void;
}

const OverviewTab = ({
  dashboardData,
  setActiveTab,
  setSelectedBooking,
  setIsModalOpen,
}: OverviewTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-8'
    >
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Recent Requests */}
        <div className='lg:col-span-2 bg-white/5 border border-white/10 p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-xl font-semibold text-white font-mondwest'>
              Recent Requests
            </h3>
            <button
              onClick={() => setActiveTab(DashboardTab.BOOKINGS)}
              className='text-orange-500 hover:text-orange-400 text-sm'
            >
              View All →
            </button>
          </div>
          <div className='space-y-4'>
            {dashboardData.recentBookings.slice(0, 3).map((booking: any) => (
              <div
                key={booking.id}
                className='flex items-center justify-between p-4 bg-white/5 border border-white/10'
              >
                <div className='flex-1'>
                  <p className='text-white font-semibold'>
                    {booking.clientName}
                  </p>
                  <p className='text-white/60 text-sm'>
                    {`${booking.clientName.toLowerCase().replace(' ', '.')}@example.com`}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setSelectedBooking({
                        ...booking,
                        clientEmail: `${booking.clientName.toLowerCase().replace(' ', '.')}@example.com`,
                        duration: '3 hours',
                        guests: '150',
                        message:
                          'Looking forward to having you perform at our special event. We would love to discuss the music selection and any special arrangements.',
                        contactPhone: '+91 98765 43210',
                      });
                      setIsModalOpen(true);
                    }}
                    className='text-orange-500 hover:text-orange-400 text-sm font-semibold'
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <div className='bg-white/5 border border-white/10 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4 font-mondwest'>
              Upcoming Events
            </h3>
            <div className='space-y-3'>
              {dashboardData.upcomingBookings
                .slice(0, 3)
                .map((booking: any, index: number) => (
                  <div
                    key={index}
                    className='flex items-center gap-3 p-3 bg-white/5'
                  >
                    <div className='w-2 h-2 bg-orange-500 flex-shrink-0'></div>
                    <div>
                      <p className='text-white text-sm font-semibold'>
                        {booking.event}
                      </p>
                      <p className='text-white/60 text-xs'>
                        {booking.date} • {booking.location}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewTab;
