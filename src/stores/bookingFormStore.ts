import { useCallback } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

const EXPIRY_DURATION = 12 * 60 * 60 * 1000; // 12 hours

export interface BookingFormData {
  eventDate: string | undefined;
  eventType: string;
  duration: string;
  guests: string;
  budget: string;
  location: string;
  message: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

interface StoredBookingData {
  data: BookingFormData;
  timestamp: number;
}

interface BookingFormState {
  bookingsByArtist: Record<string, StoredBookingData>;
}

interface BookingFormActions {
  getBookingData: (artistId: string) => BookingFormData | null;
  setBookingData: (artistId: string, data: Partial<BookingFormData>) => void;
  clearBookingData: (artistId: string) => void;
  clearExpiredData: () => void;
  clearAllBookingData: () => void;
}

const defaultFormData: BookingFormData = {
  eventDate: undefined,
  eventType: '',
  duration: '',
  guests: '',
  budget: '',
  location: '',
  message: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
};

const isExpired = (timestamp: number): boolean => {
  return Date.now() - timestamp > EXPIRY_DURATION;
};

export const useBookingFormStore = create<
  BookingFormState & BookingFormActions
>()(
  devtools(
    persist(
      (set, get) => ({
        bookingsByArtist: {},

        getBookingData: (artistId: string) => {
          const stored = get().bookingsByArtist[artistId];
          if (!stored) return null;

          if (isExpired(stored.timestamp)) {
            set(state => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { [artistId]: _removed, ...rest } = state.bookingsByArtist;
              return { bookingsByArtist: rest };
            });
            return null;
          }

          return stored.data;
        },

        setBookingData: (artistId: string, data: Partial<BookingFormData>) => {
          set(state => {
            const existingData =
              state.bookingsByArtist[artistId]?.data || defaultFormData;
            return {
              bookingsByArtist: {
                ...state.bookingsByArtist,
                [artistId]: {
                  data: { ...existingData, ...data },
                  timestamp: Date.now(),
                },
              },
            };
          });
        },

        clearBookingData: (artistId: string) => {
          set(state => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [artistId]: _removed, ...rest } = state.bookingsByArtist;
            return { bookingsByArtist: rest };
          });
        },

        clearExpiredData: () => {
          set(state => {
            const validEntries = Object.entries(state.bookingsByArtist).filter(
              ([_, stored]) => !isExpired(stored.timestamp)
            );
            return { bookingsByArtist: Object.fromEntries(validEntries) };
          });
        },

        clearAllBookingData: () => {
          set({ bookingsByArtist: {} });
        },
      }),
      {
        name: 'booking-form-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: state => ({ bookingsByArtist: state.bookingsByArtist }),
        onRehydrateStorage: () => state => state?.clearExpiredData(),
      }
    ),
    { name: 'BookingFormStore' }
  )
);

export const useArtistBookingForm = (artistId: string) => {
  const setBookingDataStore = useBookingFormStore(
    state => state.setBookingData
  );
  const clearBookingDataStore = useBookingFormStore(
    state => state.clearBookingData
  );
  const storedData = useBookingFormStore(
    state => state.bookingsByArtist[artistId]
  );

  const bookingData =
    storedData && !isExpired(storedData.timestamp) ? storedData.data : null;

  const setBookingData = useCallback(
    (data: Partial<BookingFormData>) => setBookingDataStore(artistId, data),
    [artistId, setBookingDataStore]
  );

  const clearBookingData = useCallback(
    () => clearBookingDataStore(artistId),
    [artistId, clearBookingDataStore]
  );

  return { bookingData, setBookingData, clearBookingData };
};
