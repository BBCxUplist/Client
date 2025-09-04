import { motion } from 'framer-motion';
import { formatPrice } from '@/helper';

interface BookingsTabProps {
  dashboardData: any;
  getStatusColor: (status: string) => string;
}

const BookingsTab = ({ dashboardData, getStatusColor }: BookingsTabProps) => {
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
            <option>Cancelled</option>
          </select>
          <select className='bg-white/5 border border-white/20 text-white p-2 text-sm'>
            <option>This Month</option>
            <option>Last Month</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      <div className='bg-white/5 border border-white/10 overflow-x-auto'>
        <table className='w-full'>
          <thead className='border-b border-white/10'>
            <tr>
              <th className='text-left p-4 text-white/70 font-semibold'>
                Event
              </th>
              <th className='text-left p-4 text-white/70 font-semibold'>
                Client
              </th>
              <th className='text-left p-4 text-white/70 font-semibold'>
                Date
              </th>
              <th className='text-left p-4 text-white/70 font-semibold'>
                Location
              </th>
              <th className='text-left p-4 text-white/70 font-semibold'>
                Amount
              </th>
              <th className='text-left p-4 text-white/70 font-semibold'>
                Status
              </th>
              <th className='text-left p-4 text-white/70 font-semibold'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentBookings.map((booking: any) => (
              <tr key={booking.id} className='border-b border-white/5'>
                <td className='p-4 text-white'>{booking.eventType}</td>
                <td className='p-4 text-white'>{booking.clientName}</td>
                <td className='p-4 text-white'>{booking.date}</td>
                <td className='p-4 text-white/60'>{booking.location}</td>
                <td className='p-4 text-orange-500 font-semibold'>
                  {formatPrice(booking.amount)}
                </td>
                <td className='p-4'>
                  <span
                    className={`px-3 py-1 text-xs font-semibold border ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </td>
                <td className='p-4'>
                  <button className='text-orange-500 hover:text-orange-400 text-sm'>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default BookingsTab;
