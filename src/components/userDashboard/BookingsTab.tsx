import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/helper';

interface BookingsTabProps {
  dashboardData: any;
}

const BookingsTab = ({ dashboardData }: BookingsTabProps) => {
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

  return (
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
                      e.currentTarget.src = '/images/artistNotFound.jpeg';
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
                  {booking.status === 'completed' && !booking.rating && (
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
  );
};

export default BookingsTab;
