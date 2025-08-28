import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  Role, 
  BookingStatus, 
  ReportTargetType,
  User, 
  Artist, 
  Booking, 
  Appeal, 
  Report 
} from '@/constants/types';
import { users } from '@/constants/users';
import { artists } from '@/constants/artists';
import { bookings } from '@/constants/bookings';
import { appeals } from '@/constants/appeals';
import { reports } from '@/constants/reports';

// Store state interface
interface AppState {
  // Auth slice
  auth: {
    currentUserId?: string;
    role?: Role;
  };
  
  // Data slices
  users: User[];
  artists: Artist[];
  bookings: Booking[];
  appeals: Appeal[];
  reports: Report[];
  
  // Auth actions
  login: (role: Role, userId: string) => void;
  logout: () => void;
  
  // Registration actions
  registerUser: (userData: Partial<User>) => string;
  registerArtist: (artistData: Partial<Artist>) => string;
  
  // Admin moderation actions
  toggleBan: (id: string, type: 'user' | 'artist') => void;
  
  // Appeal actions
  submitAppeal: (artistId: string, message: string, portfolioLinks?: string[]) => string;
  approveAppeal: (appealId: string) => void;
  rejectAppeal: (appealId: string) => void;
  
  // Booking actions
  createBooking: (artistId: string, userId: string, date: string, timeSlot: string, amount: number) => string;
  setBookingStatus: (id: string, status: BookingStatus) => void;
  acceptBooking: (bookingId: string, acceptedAmount?: number) => void;
  counterOffer: (bookingId: string, amount: number, note: string) => void;
  confirmBooking: (bookingId: string) => void;
  fundEscrow: (bookingId: string, amount: number) => void;
  releaseEscrow: (bookingId: string) => void;
  refundEscrow: (bookingId: string) => void;
  createThread: (bookingId: string) => string;
  
  // Report actions
  addReport: (reportData: {
    reporterId: string;
    targetId: string;
    targetType: ReportTargetType;
    reason: string;
    details?: string;
  }) => string;
  closeReport: (reportId: string) => void;
}

// Utility function to generate IDs
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      auth: {},
      users,
      artists,
      bookings,
      appeals,
      reports,
      
      // Auth actions
      login: (role: Role, userId: string) => {
        set(() => ({
          auth: {
            currentUserId: userId,
            role,
          },
        }));
      },
      
      logout: () => {
        set(() => ({
          auth: {},
        }));
      },
      
      // Registration actions
      registerUser: (userData: Partial<User>) => {
        const newUser: User = {
          id: generateId('user'),
          name: userData.name || 'New User',
          avatar: userData.avatar,
          description: userData.description,
          socials: userData.socials,
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          users: [...state.users, newUser],
        }));
        
        return newUser.id;
      },
      
      registerArtist: (artistData: Partial<Artist>) => {
        const newArtist: Artist = {
          id: generateId('artist'),
          slug: artistData.slug || 'new-artist',
          name: artistData.name || 'New Artist',
          avatar: artistData.avatar,
          bio: artistData.bio,
          socials: artistData.socials,
          embeds: artistData.embeds,
          photos: artistData.photos || [],
          price: artistData.price || 0,
          rating: 0,
          tags: artistData.tags || [],
          categories: artistData.categories || [],
          availability: artistData.availability || [],
          timeSlots: artistData.timeSlots || [],
          isBookable: false,
          appealStatus: 'pending',
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          artists: [...state.artists, newArtist],
        }));
        
        return newArtist.id;
      },
      
      // Admin moderation actions
      toggleBan: (id: string, type: 'user' | 'artist') => {
        set((state) => {
          if (type === 'user') {
            return {
              users: state.users.map((user) =>
                user.id === id ? { ...user, banned: !user.banned } : user
              ),
            };
          } else {
            return {
              artists: state.artists.map((artist) =>
                artist.id === id ? { ...artist, isBookable: false } : artist
              ),
            };
          }
        });
      },
      
      // Appeal actions
      submitAppeal: (artistId: string, message: string, portfolioLinks?: string[]) => {
        const newAppeal: Appeal = {
          id: generateId('appeal'),
          artistId,
          status: 'pending',
          message,
          portfolioLinks,
          submittedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          appeals: [...state.appeals, newAppeal],
        }));
        
        return newAppeal.id;
      },
      
      approveAppeal: (appealId: string) => {
        set((state) => {
          const appeal = state.appeals.find((a) => a.id === appealId);
          if (!appeal) return state;
          
          return {
            appeals: state.appeals.map((a) =>
              a.id === appealId
                ? { ...a, status: 'approved', reviewedAt: new Date().toISOString(), reviewedBy: state.auth.currentUserId }
                : a
            ),
            artists: state.artists.map((artist) =>
              artist.id === appeal.artistId
                ? { ...artist, isBookable: true, appealStatus: 'approved' }
                : artist
            ),
          };
        });
      },
      
      rejectAppeal: (appealId: string) => {
        set((state) => {
          const appeal = state.appeals.find((a) => a.id === appealId);
          if (!appeal) return state;
          
          return {
            appeals: state.appeals.map((a) =>
              a.id === appealId
                ? { ...a, status: 'rejected', reviewedAt: new Date().toISOString(), reviewedBy: state.auth.currentUserId }
                : a
            ),
            artists: state.artists.map((artist) =>
              artist.id === appeal.artistId
                ? { ...artist, appealStatus: 'rejected' }
                : artist
            ),
          };
        });
      },
      
      // Booking actions
      createBooking: (artistId: string, userId: string, date: string, timeSlot: string, amount: number) => {
        const platformFee = Math.round(amount * 0.05); // 5% platform fee
        const newBooking: Booking = {
          id: generateId('booking'),
          artistId,
          userId,
          status: 'inquiry',
          date,
          timeSlot,
          amount,
          originalAmount: amount,
          escrowStatus: 'none',
          platformFee,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          bookings: [...state.bookings, newBooking],
        }));
        
        return newBooking.id;
      },
      
      setBookingStatus: (id: string, status: BookingStatus) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id
              ? { ...booking, status, updatedAt: new Date().toISOString() }
              : booking
          ),
        }));
      },
      
      acceptBooking: (bookingId: string, acceptedAmount?: number) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? { 
                  ...booking, 
                  status: 'confirmed',
                  amount: acceptedAmount || booking.amount,
                  updatedAt: new Date().toISOString() 
                }
              : booking
          ),
        }));
      },
      
      counterOffer: (bookingId: string, amount: number, note: string) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? { 
                  ...booking, 
                  status: 'negotiating',
                  counterOffer: amount,
                  counterNote: note,
                  updatedAt: new Date().toISOString() 
                }
              : booking
          ),
        }));
      },
      
      confirmBooking: (bookingId: string) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? { 
                  ...booking, 
                  status: 'confirmed',
                  amount: booking.counterOffer || booking.amount,
                  updatedAt: new Date().toISOString() 
                }
              : booking
          ),
        }));
      },
      
      fundEscrow: (bookingId: string, amount: number) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? { 
                  ...booking, 
                  escrowStatus: 'funded', 
                  amount,
                  status: 'pending',
                  updatedAt: new Date().toISOString() 
                }
              : booking
          ),
        }));
      },
      
      releaseEscrow: (bookingId: string) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? { 
                  ...booking, 
                  escrowStatus: 'released', 
                  status: 'completed',
                  updatedAt: new Date().toISOString() 
                }
              : booking
          ),
        }));
      },
      
      refundEscrow: (bookingId: string) => {
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? { 
                  ...booking, 
                  escrowStatus: 'refunded', 
                  updatedAt: new Date().toISOString() 
                }
              : booking
          ),
        }));
      },
      
      createThread: (bookingId: string) => {
        const threadId = generateId('thread');
        
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === bookingId
              ? { ...booking, threadId, updatedAt: new Date().toISOString() }
              : booking
          ),
        }));
        
        return threadId;
      },
      
      // Report actions
      addReport: (reportData) => {
        const newReport: Report = {
          id: generateId('report'),
          reporterId: reportData.reporterId,
          targetId: reportData.targetId,
          targetType: reportData.targetType,
          reason: reportData.reason,
          details: reportData.details,
          status: 'open',
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          reports: [...state.reports, newReport],
        }));
        
        return newReport.id;
      },
      
      closeReport: (reportId: string) => {
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === reportId
              ? { 
                  ...report, 
                  status: 'closed', 
                  closedAt: new Date().toISOString(), 
                  closedBy: state.auth.currentUserId 
                }
              : report
          ),
        }));
      },
    }),
    {
      name: 'uplist-store',
      partialize: (state) => ({
        auth: state.auth,
        users: state.users,
        artists: state.artists,
        bookings: state.bookings,
        appeals: state.appeals,
        reports: state.reports,
      }),
    }
  )
);
