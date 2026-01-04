import { motion } from 'framer-motion';
import { useGetBookings } from '@/hooks/booking/useGetBookings';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';

interface BookingsTabProps {
  dashboardData: any;
  getStatusColor: (status: string) => string;
  setSelectedBooking?: (booking: any) => void;
  setIsModalOpen?: (open: boolean) => void;
}

const BookingsTab = ({
  dashboardData,
  getStatusColor,
  setSelectedBooking,
  setIsModalOpen,
}: BookingsTabProps) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  // Fetch bookings from API
  const { data: bookingsResponse, isLoading, error } = useGetBookings();

  // Use API data if available, otherwise fallback to dummy data
  const allBookings = bookingsResponse?.data || dashboardData.recentBookings;

  // Filter bookings based on selected filters
  const filteredBookings = useMemo(() => {
    let bookings = allBookings || [];

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

    // Sort by date - most recent first
    bookings.sort((a: any, b: any) => {
      const dateA = new Date(a.eventDate).getTime();
      const dateB = new Date(b.eventDate).getTime();
      return dateB - dateA;
    });

    return bookings;
  }, [allBookings, statusFilter, timeFilter]);

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='space-y-6'
      >
        <div className='text-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4'></div>
          <p className='text-white/60'>Loading bookings...</p>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='space-y-6'
      >
        <div className='text-center py-12'>
          <p className='text-red-400 mb-4'>Failed to load bookings</p>
          <p className='text-white/60 text-sm'>{error.message}</p>
        </div>
      </motion.div>
    );
  }

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
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking: any) => (
                <tr key={booking.id} className='border-b border-white/5'>
                  <td className='p-4 text-white'>{booking.eventType}</td>
                  <td className='p-4 text-white'>{booking.contactName}</td>
                  <td className='p-4 text-white'>
                    {booking.eventDate
                      ? format(new Date(booking.eventDate), 'MMM dd, yyyy')
                      : 'N/A'}
                  </td>
                  <td className='p-4 text-white/60'>{booking.eventLocation}</td>
                  <td className='p-4 text-orange-500 font-semibold'>
                    {booking.budgetRange || 'TBD'}
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
                    <button
                      onClick={() => {
                        if (setSelectedBooking && setIsModalOpen) {
                          setSelectedBooking({
                            ...booking,
                            clientId: booking.userId, // Add client user ID for chat functionality
                            clientEmail: booking.contactEmail,
                            clientName: booking.contactName,
                            date: booking.eventDate
                              ? format(
                                  new Date(booking.eventDate),
                                  'MMM dd, yyyy'
                                )
                              : 'N/A',
                            location: booking.eventLocation,
                            amount: booking.budgetRange || 0,
                            duration: `${booking.duration || 3} hours`,
                            guests: booking.expectedGuests || 0,
                            message: booking.specialRequirements,
                            contactPhone: booking.contactPhone,
                          });
                          setIsModalOpen(true);
                        }
                      }}
                      className='text-orange-500 hover:text-orange-400 text-sm'
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className='p-8 text-center text-white/60'>
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default BookingsTab;
