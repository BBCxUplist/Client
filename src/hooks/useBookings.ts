import { useAppStore } from '@/store';
import type { Booking, BookingStatus, EscrowStatus } from '@/constants/types';

export const useBookings = () => {
  const { bookings } = useAppStore();
  return bookings;
};

export const useBookingsByUser = (userId: string): Booking[] => {
  const bookings = useBookings();
  return bookings.filter((booking) => booking.userId === userId);
};

export const useBookingsByArtist = (artistId: string): Booking[] => {
  const bookings = useBookings();
  return bookings.filter((booking) => booking.artistId === artistId);
};

export const useBookingById = (id: string): Booking | undefined => {
  const bookings = useBookings();
  return bookings.find((booking) => booking.id === id);
};

export const useCurrentBookings = (userId: string): Booking[] => {
  const userBookings = useBookingsByUser(userId);
  return userBookings.filter((booking) => 
    ['inquiry', 'pending', 'accepted'].includes(booking.status)
  );
};

export const usePreviousBookings = (userId: string): Booking[] => {
  const userBookings = useBookingsByUser(userId);
  return userBookings.filter((booking) => 
    ['completed', 'declined', 'cancelled'].includes(booking.status)
  );
};

export const useInquiries = (userId: string): Booking[] => {
  const userBookings = useBookingsByUser(userId);
  return userBookings.filter((booking) => booking.status === 'inquiry');
};

export const usePendingBookings = (userId: string): Booking[] => {
  const userBookings = useBookingsByUser(userId);
  return userBookings.filter((booking) => booking.status === 'pending');
};

export const useAcceptedBookings = (userId: string): Booking[] => {
  const userBookings = useBookingsByUser(userId);
  return userBookings.filter((booking) => booking.status === 'accepted');
};

export const useArtistRequests = (artistId: string): Booking[] => {
  const artistBookings = useBookingsByArtist(artistId);
  return artistBookings.filter((booking) => booking.status === 'pending');
};

export const useArtistBookings = (artistId: string): Booking[] => {
  const artistBookings = useBookingsByArtist(artistId);
  return artistBookings.filter((booking) => booking.status === 'accepted');
};

export const useBookingsByStatus = (status: BookingStatus): Booking[] => {
  const bookings = useBookings();
  return bookings.filter((booking) => booking.status === status);
};

export const useBookingsByEscrowStatus = (escrowStatus: EscrowStatus): Booking[] => {
  const bookings = useBookings();
  return bookings.filter((booking) => booking.escrowStatus === escrowStatus);
};

export const useFundedBookings = (): Booking[] => {
  return useBookingsByEscrowStatus('funded');
};

export const useReleasedBookings = (): Booking[] => {
  return useBookingsByEscrowStatus('released');
};

export const useRefundedBookings = (): Booking[] => {
  return useBookingsByEscrowStatus('refunded');
};

export const useBookingActions = () => {
  const {
    createBooking,
    setBookingStatus,
    fundEscrow,
    releaseEscrow,
    refundEscrow,
    createThread,
  } = useAppStore();
  
  return {
    createBooking,
    setBookingStatus,
    fundEscrow,
    releaseEscrow,
    refundEscrow,
    createThread,
  };
};
