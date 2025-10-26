import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';

interface BookingsTabProps {
  dashboardData: any;
}

const BookingsTab = ({ dashboardData }: BookingsTabProps) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  // Filter bookings based on selected filters
  const filteredBookings = useMemo(() => {
    let bookings = dashboardData.recentBookings || [];

    // Filter by status
    if (statusFilter !== 'all') {
      bookings = bookings.filter(
        (booking: any) =>
          booking.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Filter by time
    if (timeFilter !== 'all') {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      bookings = bookings.filter((booking: any) => {
        const bookingDate = new Date(booking.eventDate);
        const bookingMonth = bookingDate.getMonth();
        const bookingYear = bookingDate.getFullYear();

        switch (timeFilter) {
          case 'this-month':
            return bookingMonth === currentMonth && bookingYear === currentYear;
          case 'last-month': {
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear =
              currentMonth === 0 ? currentYear - 1 : currentYear;
            return bookingMonth === lastMonth && bookingYear === lastMonthYear;
          }
          case 'this-year':
            return bookingYear === currentYear;
          default:
            return true;
        }
      });
    }

    return bookings;
  }, [dashboardData.recentBookings, statusFilter, timeFilter]);

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
        <div>
          <h3 className='text-2xl font-semibold text-white mb-1 font-mondwest'>
            All Bookings
          </h3>
          <p className='text-white/60 text-sm'>
            {filteredBookings.length} booking
            {filteredBookings.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className='flex gap-2'>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className='bg-white/5 border border-white/20 text-white p-2 text-sm focus:outline-none focus:border-orange-500'
          >
            <option value='all'>All Status</option>
            <option value='confirmed'>Confirmed</option>
            <option value='pending'>Pending</option>
            <option value='completed'>Completed</option>
            <option value='cancelled'>Cancelled</option>
          </select>
          <select
            value={timeFilter}
            onChange={e => setTimeFilter(e.target.value)}
            className='bg-white/5 border border-white/20 text-white p-2 text-sm focus:outline-none focus:border-orange-500'
          >
            <option value='all'>All Time</option>
            <option value='this-month'>This Month</option>
            <option value='last-month'>Last Month</option>
            <option value='this-year'>This Year</option>
          </select>
        </div>
      </div>

      {filteredBookings && filteredBookings.length > 0 ? (
        <div className='space-y-4'>
          {filteredBookings.map((booking: any) => (
            <div
              key={booking.id}
              className='bg-white/5 border border-white/10 p-6'
            >
              <div className='flex items-center justify-between mb-4'>
                <div className='flex-1'>
                  <h4 className='text-white font-semibold text-lg'>
                    {booking.eventType}
                  </h4>
                  <p className='text-white/60 text-sm'>
                    {new Date(booking.eventDate).toLocaleDateString()} •{' '}
                    {booking.duration} minutes
                  </p>
                  <p className='text-white/50 text-xs'>
                    {booking.eventLocation}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-orange-500 font-bold font-mondwest text-lg'>
                    ${booking.budgetRange}
                  </p>
                  <span
                    className={`px-3 py-1 text-xs font-semibold border ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Event details */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                {booking.expectedGuests && (
                  <div>
                    <p className='text-white/60 text-sm'>
                      <span className='font-semibold'>Expected Guests:</span>{' '}
                      {booking.expectedGuests}
                    </p>
                  </div>
                )}
                <div>
                  <p className='text-white/60 text-sm'>
                    <span className='font-semibold'>Created:</span>{' '}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Special requirements */}
              {booking.specialRequirements && (
                <div className='mb-4'>
                  <p className='text-white/60 text-sm'>
                    <span className='font-semibold'>Special Requirements:</span>
                  </p>
                  <p className='text-white/70 text-sm mt-1'>
                    {booking.specialRequirements}
                  </p>
                </div>
              )}

              {/* Contact information */}
              <div className='border-t border-white/10 pt-4'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                  <div>
                    <p className='text-white/60'>
                      <span className='font-semibold'>Contact:</span>{' '}
                      {booking.contactName}
                    </p>
                  </div>
                  <div>
                    <p className='text-white/60'>
                      <span className='font-semibold'>Email:</span>{' '}
                      {booking.contactEmail}
                    </p>
                  </div>
                  <div>
                    <p className='text-white/60'>
                      <span className='font-semibold'>Phone:</span>{' '}
                      {booking.contactPhone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <div className='w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-white/40'
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
          <h4 className='text-white font-semibold mb-2'>No Bookings Yet</h4>
          <p className='text-white/60 text-sm mb-4'>
            You haven't made any bookings yet. Start exploring artists to book
            your first event.
          </p>
          <Link to='/explore'>
            <button className='bg-orange-500 text-black px-6 py-3 font-semibold hover:bg-orange-600 transition-colors'>
              EXPLORE ARTISTS
            </button>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default BookingsTab;
