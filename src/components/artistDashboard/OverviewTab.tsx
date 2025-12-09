import { motion } from 'framer-motion';
import { DashboardTab } from '@/types';
import { AppealStatus } from '@/hooks/artist/useGetApprovalStatus';
import { useGetBookings } from '@/hooks/booking/useGetBookings';
import { format } from 'date-fns';

interface OverviewTabProps {
  dashboardData: any;
  setActiveTab: (tab: DashboardTab) => void;
  setSelectedBooking: (booking: any) => void;
  setIsModalOpen: (open: boolean) => void;
  isProfileIncomplete: boolean;
  approvalStatus: any;
  isApprovalLoading: boolean;
}

const OverviewTab = ({
  dashboardData,
  setActiveTab,
  setSelectedBooking,
  setIsModalOpen,
  isProfileIncomplete,
  approvalStatus,
  isApprovalLoading,
}: OverviewTabProps) => {
  const { data: bookingsResponse } = useGetBookings();

  const allBookings =
    bookingsResponse?.data || dashboardData?.recentBookings || [];

  const now = new Date();
  const upcomingBookings = allBookings.filter((booking: any) => {
    const eventDate = new Date(booking.eventDate);
    return booking.status === 'confirmed' && eventDate > now;
  });

  const recentBookings = allBookings;

  // Check if data exists and is not empty
  const hasRecentBookings = recentBookings && recentBookings.length > 0;
  const hasUpcomingBookings = upcomingBookings && upcomingBookings.length > 0;

  // Determine the appropriate message and action based on account status
  const getEmptyStateContent = () => {
    if (isProfileIncomplete) {
      return {
        title: 'Complete Your Profile',
        message:
          'Complete your profile to start receiving booking requests from clients.',
        buttonText: 'COMPLETE PROFILE',
        buttonAction: () => (window.location.href = '/dashboard/edit'),
      };
    }

    if (!isApprovalLoading && approvalStatus && !approvalStatus.isApproved) {
      if (approvalStatus.appealStatus === AppealStatus.PENDING) {
        return {
          title: 'Get Approved',
          message:
            'Complete your profile and get approved to start receiving booking requests.',
          buttonText: 'REQUEST APPROVAL',
          buttonAction: () => setActiveTab(DashboardTab.SETTINGS),
        };
      } else if (approvalStatus.appealStatus === AppealStatus.REQUESTED) {
        return {
          title: 'Application Under Review',
          message:
            'Your application is being reviewed. You will be notified once approved.',
          buttonText: 'VIEW STATUS',
          buttonAction: () => setActiveTab(DashboardTab.SETTINGS),
        };
      } else if (approvalStatus.appealStatus === AppealStatus.REJECTED) {
        return {
          title: 'Update Your Profile',
          message:
            'Your application was not approved. Update your profile and reapply to get bookings.',
          buttonText: 'UPDATE PROFILE',
          buttonAction: () => (window.location.href = '/dashboard/edit'),
        };
      }
    }

    if (!isApprovalLoading && approvalStatus && approvalStatus.isApproved) {
      return {
        title: 'No Recent Requests',
        message:
          "You haven't received any booking requests yet. Keep your profile updated to attract more clients.",
        buttonText: 'UPDATE PROFILE',
        buttonAction: () => (window.location.href = '/dashboard/edit'),
      };
    }

    // Default fallback
    return {
      title: 'Complete Your Profile',
      message:
        'Complete your profile to start receiving booking requests from clients.',
      buttonText: 'COMPLETE PROFILE',
      buttonAction: () => (window.location.href = '/dashboard/edit'),
    };
  };

  const emptyStateContent = getEmptyStateContent();

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
          {hasRecentBookings ? (
            <div className='space-y-4'>
              {recentBookings.slice(0, 3).map((booking: any) => (
                <div
                  key={booking.id}
                  className='flex items-center justify-between p-4 bg-white/5 border border-white/10'
                >
                  <div className='flex-1'>
                    <div className='flex items-center gap-4 mb-2'>
                      <div className='flex-1'>
                        <p className='text-white font-semibold'>
                          {booking.contactName ||
                            booking.clientName ||
                            'Unknown Client'}
                        </p>
                        <p className='text-white/60 text-sm'>
                          {booking.eventType || 'Event'} •{' '}
                          {booking.eventDate
                            ? format(
                                new Date(booking.eventDate),
                                'MMM dd, yyyy'
                              )
                            : 'Date TBD'}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='text-orange-500 font-semibold text-sm'>
                          {booking.budgetRange || 'Budget TBD'}
                        </p>
                        <p className='text-white/60 text-xs'>
                          {booking.eventLocation || 'Location TBD'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='ml-4'>
                    <button
                      onClick={() => {
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
                          duration: `${booking.duration || 0} hours`,
                          guests: booking.expectedGuests || 0,
                          message: booking.specialRequirements,
                          contactPhone: booking.contactPhone,
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
                {emptyStateContent.title}
              </h4>
              <p className='text-white/60 text-sm mb-4'>
                {emptyStateContent.message}
              </p>
              <button
                onClick={emptyStateContent.buttonAction}
                className='bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 transition-colors'
              >
                {emptyStateContent.buttonText}
              </button>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div>
          <div className='bg-white/5 border border-white/10 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4 font-mondwest'>
              Upcoming Events
            </h3>
            {hasUpcomingBookings ? (
              <div className='space-y-3'>
                {upcomingBookings
                  .slice(0, 3)
                  .map((booking: any, index: number) => (
                    <div
                      key={booking.id || index}
                      className='flex items-center gap-3 p-3 bg-white/5'
                    >
                      <div className='w-2 h-2 bg-orange-500 flex-shrink-0'></div>
                      <div>
                        <p className='text-white text-sm font-semibold'>
                          {booking.eventType || booking.event}
                        </p>
                        <p className='text-white/60 text-xs'>
                          {booking.eventDate
                            ? new Date(booking.eventDate).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )
                            : 'TBD'}{' '}
                          •{' '}
                          {booking.eventLocation ||
                            booking.location ||
                            'Location TBD'}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className='text-center py-6'>
                <div className='w-12 h-12 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-white/40'
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
                <h4 className='text-white font-semibold mb-1 text-sm'>
                  No Upcoming Events
                </h4>
                <p className='text-white/60 text-xs'>No events scheduled yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewTab;
