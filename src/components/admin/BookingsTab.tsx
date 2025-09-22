import { motion } from 'framer-motion';

interface Booking {
  id: string;
  artistName: string;
  userName: string;
  eventDate: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'disputed';
  createdAt: string;
}

interface BookingsTabProps {
  dummyBookings: Booking[];
}

const BookingsTab = ({ dummyBookings }: BookingsTabProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400 bg-green-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'cancelled':
        return 'text-red-400 bg-red-500/20';
      case 'disputed':
        return 'text-orange-400 bg-orange-500/20';
      default:
        return 'text-white/60 bg-white/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
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
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        );
      case 'pending':
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
              d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        );
      case 'cancelled':
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
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        );
      case 'disputed':
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
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    console.log(`Changing booking ${bookingId} status to ${newStatus}`);
    // Implement status change logic here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='space-y-6'
    >
      <div>
        <h2 className='text-2xl font-bold text-white mb-4'>
          Bookings Management
        </h2>
        <p className='text-white/70'>
          Monitor and manage all platform bookings
        </p>
      </div>

      {/* Bookings Summary */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white/5 border border-white/10 p-4 rounded-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/60 text-sm'>Total Bookings</p>
              <p className='text-2xl font-bold text-white'>
                {dummyBookings.length}
              </p>
            </div>
            <div className='w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center'>
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
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
            </div>
          </div>
        </div>

        <div className='bg-white/5 border border-white/10 p-4 rounded-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/60 text-sm'>Confirmed</p>
              <p className='text-2xl font-bold text-green-400'>
                {dummyBookings.filter(b => b.status === 'confirmed').length}
              </p>
            </div>
            <div className='w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center'>
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
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
          </div>
        </div>

        <div className='bg-white/5 border border-white/10 p-4 rounded-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/60 text-sm'>Pending</p>
              <p className='text-2xl font-bold text-yellow-400'>
                {dummyBookings.filter(b => b.status === 'pending').length}
              </p>
            </div>
            <div className='w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center'>
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
                  d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
          </div>
        </div>

        <div className='bg-white/5 border border-white/10 p-4 rounded-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/60 text-sm'>Total Revenue</p>
              <p className='text-2xl font-bold text-orange-400'>
                {formatCurrency(
                  dummyBookings.reduce((sum, b) => sum + b.amount, 0)
                )}
              </p>
            </div>
            <div className='w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center'>
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
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className='space-y-4'>
        {dummyBookings.map(booking => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white/5 border border-white/10 p-4 rounded-lg'
          >
            <div className='flex items-start justify-between mb-3'>
              <div className='flex items-center gap-3'>
                {getStatusIcon(booking.status)}
                <div>
                  <h4 className='text-white font-semibold'>
                    Booking #{booking.id}
                  </h4>
                  <p className='text-white/60 text-sm'>
                    {booking.artistName} → {booking.userName}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}
                >
                  {booking.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm'>
              <div>
                <span className='text-white/70'>Event Date: </span>
                <span className='text-white'>
                  {new Date(booking.eventDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className='text-white/70'>Amount: </span>
                <span className='text-white font-semibold'>
                  {formatCurrency(booking.amount)}
                </span>
              </div>
              <div>
                <span className='text-white/70'>Created: </span>
                <span className='text-white'>
                  {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                <button className='bg-white/10 border border-white/20 text-white px-3 py-1 rounded hover:bg-white/20 transition-colors text-sm'>
                  View Details
                </button>
                <button className='bg-white/10 border border-white/20 text-white px-3 py-1 rounded hover:bg-white/20 transition-colors text-sm'>
                  Contact Parties
                </button>
              </div>
              <div className='flex gap-2'>
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusChange(booking.id, 'confirmed')
                      }
                      className='bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 rounded hover:bg-green-500/30 transition-colors text-sm'
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(booking.id, 'cancelled')
                      }
                      className='bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded hover:bg-red-500/30 transition-colors text-sm'
                    >
                      Cancel
                    </button>
                  </>
                )}
                {booking.status === 'disputed' && (
                  <button
                    onClick={() => handleStatusChange(booking.id, 'cancelled')}
                    className='bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1 rounded hover:bg-red-500/30 transition-colors text-sm'
                  >
                    Resolve Dispute
                  </button>
                )}
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusChange(booking.id, 'cancelled')}
                    className='bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 px-3 py-1 rounded hover:bg-yellow-500/30 transition-colors text-sm'
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BookingsTab;
