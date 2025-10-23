import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/helper';

interface OverviewTabProps {
  dashboardData: any;
  savedArtists: any[];
  onTabChange: (tab: string) => void;
}

const OverviewTab = ({
  dashboardData,
  savedArtists,
  onTabChange,
}: OverviewTabProps) => {
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

  // Check if data exists and is not empty
  const hasUpcomingEvents =
    dashboardData?.upcomingEvents && dashboardData.upcomingEvents.length > 0;
  const hasRecentBookings =
    dashboardData?.recentBookings && dashboardData.recentBookings.length > 0;
  const hasSavedArtists = savedArtists && savedArtists.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='space-y-8'
    >
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Upcoming Events */}
        <div className='lg:col-span-2'>
          <div className='bg-white/5 border border-white/10 p-6 mb-8'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-semibold text-white font-mondwest'>
                Upcoming Events
              </h3>
              <button
                onClick={() => onTabChange('bookings')}
                className='text-orange-500 hover:text-orange-400 text-sm'
              >
                View All →
              </button>
            </div>
            {hasUpcomingEvents ? (
              <div className='space-y-4'>
                {dashboardData.upcomingEvents.map((event: any) => (
                  <div
                    key={event.id}
                    className='flex items-center justify-between p-4 bg-white/5 border border-white/10'
                  >
                    <div>
                      <p className='text-white font-semibold'>
                        {event.eventType}
                      </p>
                      <p className='text-white/60 text-sm'>
                        {event.artistName} • {event.date}
                      </p>
                      <p className='text-white/50 text-xs'>{event.location}</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-orange-500 font-bold font-mondwest'>
                        {formatPrice(event.amount)}
                      </p>
                      <span
                        className={`px-2 py-1 text-xs font-semibold border ${getStatusColor(
                          event.status
                        )}`}
                      >
                        {event.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
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
                <h4 className='text-white font-semibold mb-2'>
                  No Upcoming Events
                </h4>
                <p className='text-white/60 text-sm mb-4'>
                  You don't have any upcoming events scheduled yet.
                </p>
                <Link to='/explore'>
                  <button className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'>
                    BOOK AN ARTIST
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className='bg-white/5 border border-white/10 p-6'>
            <h3 className='text-xl font-semibold text-white mb-6 font-mondwest'>
              Recent Activity
            </h3>
            {hasRecentBookings ? (
              <div className='space-y-4'>
                {dashboardData.recentBookings
                  .slice(0, 3)
                  .map((booking: any) => (
                    <div
                      key={booking.id}
                      className='flex items-center gap-4 p-4 bg-white/5 border border-white/10'
                    >
                      <img
                        src={booking.artistAvatar}
                        alt={booking.artistName}
                        className='w-12 h-12 object-cover'
                        onError={e => {
                          e.currentTarget.src = '/images/artistNotFound.jpeg';
                        }}
                      />
                      <div className='flex-1'>
                        <p className='text-white font-semibold'>
                          {booking.eventType}
                        </p>
                        <p className='text-white/60 text-sm'>
                          {booking.artistName} • {booking.date}
                        </p>
                      </div>
                      <div className='text-right'>
                        <span
                          className={`px-2 py-1 text-xs font-semibold border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className='text-center py-8'>
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
                      d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                    />
                  </svg>
                </div>
                <h4 className='text-white font-semibold mb-2'>
                  No Recent Activity
                </h4>
                <p className='text-white/60 text-sm mb-4'>
                  You haven't made any bookings yet. Start exploring artists to
                  see your activity here.
                </p>
                <Link to='/explore'>
                  <button className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'>
                    EXPLORE ARTISTS
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Recommendations */}
          <div className='bg-white/5 border border-white/10 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4 font-mondwest'>
              Recommended Artists
            </h3>
            {hasSavedArtists ? (
              <div className='space-y-4'>
                {savedArtists.slice(0, 3).map((artist: any) => (
                  <Link
                    key={artist.id}
                    to={`/artist/${artist.username}`}
                    className='block'
                  >
                    <div className='flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10'>
                      <img
                        src={artist.avatar || '/images/artistNotFound.jpeg'}
                        alt={artist.displayName}
                        className='w-10 h-10 object-cover'
                        onError={e => {
                          e.currentTarget.src = '/images/artistNotFound.jpeg';
                        }}
                      />
                      <div className='flex-1'>
                        <p className='text-white text-sm font-semibold'>
                          {artist.displayName}
                        </p>
                        <p className='text-white/60 text-xs'>
                          @{artist.username} • {formatPrice(artist.basePrice)}
                        </p>
                        <div className='flex items-center gap-2 mt-1'>
                          <p className='text-orange-400 text-xs'>
                            {artist.genres?.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className='text-center py-8'>
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
                      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                    />
                  </svg>
                </div>
                <h4 className='text-white font-semibold mb-2'>
                  No Saved Artists Yet
                </h4>
                <p className='text-white/60 text-sm mb-4'>
                  Start exploring and save your favorite artists to see them
                  here.
                </p>
                <button
                  onClick={() => onTabChange('saved')}
                  className='bg-orange-500 text-black px-4 py-2 text-sm font-semibold hover:bg-orange-600 transition-colors'
                >
                  VIEW SAVED ARTISTS
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewTab;
