import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { tokenCookies, userDataCookies } from '@/lib/cookieUtils';
import type { Store, ConsolidatedUser } from '@/types/store';
import type { Role } from '@/types';
import type { Artist } from '@/types/api';

// Force TypeScript recompilation

export const useStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        // Auth state
        user: null,
        isAuthenticated: false,
        authMode: null,

        // Artist cache state
        artistCache: {} as Record<
          string,
          { artists: Artist[]; hasMore: boolean; timestamp: number }
        >,

        // Auth actions
        setUser: (user: ConsolidatedUser | null) => {
          set({
            user,
            isAuthenticated: !!user,
          });

          // Store user ID and role in cookies for quick access
          if (user) {
            userDataCookies.setUserId(user.id);
            if (user.role) {
              userDataCookies.setUserRole(user.role);
            }
          }
        },

        setAuth: (
          user: ConsolidatedUser,
          accessToken: string,
          refreshToken: string
        ) => {
          // Store tokens in secure cookies
          tokenCookies.setAccessToken(accessToken);
          tokenCookies.setRefreshToken(refreshToken);

          // Store user data in state and cookies
          set({
            user,
            isAuthenticated: true,
          });

          userDataCookies.setUserId(user.id);
          if (user.role) {
            userDataCookies.setUserRole(user.role);
          }
        },

        clearAuth: () => {
          // Clear tokens from cookies
          tokenCookies.clearTokens();
          userDataCookies.clearUserData();

          set({
            user: null,
            isAuthenticated: false,
          });
        },

        setAuthMode: authMode => set({ authMode }),

        logout: async () => {
          try {
            await supabase.auth.signOut();
          } catch (error) {
            console.warn('Supabase logout failed:', error);
          }

          // Clear all auth data
          tokenCookies.clearTokens();
          userDataCookies.clearUserData();

          set({
            user: null,
            isAuthenticated: false,
            authMode: null,
          });
        },

        // Artist cache actions
        setArtistCache: (key: string, artists: Artist[], hasMore: boolean) => {
          set(state => ({
            artistCache: {
              ...state.artistCache,
              [key]: {
                artists,
                hasMore,
                timestamp: Date.now(),
              },
            },
          }));
        },

        getArtistCache: (key: string) => {
          const cache = get().artistCache[key];
          if (!cache) return null;

          // Cache expires after 5 minutes
          if (Date.now() - cache.timestamp > 5 * 60 * 1000) {
            return null;
          }

          return cache;
        },

        clearArtistCache: () => {
          set({ artistCache: {} });
        },

        // Helper methods
        getAccessToken: () => tokenCookies.getAccessToken(),
        getRefreshToken: () => tokenCookies.getRefreshToken(),
        getRole: (): Role => get().user?.role || 'user',
        isArtist: () => get().user?.role === 'artist',
        isAdmin: () => get().user?.role === 'admin',
      }),
      {
        name: 'auth-storage',
        // Persist both Supabase auth and backend data in localStorage
        partialize: state => ({
          user: {
            id: state.user?.id,
            email: state.user?.email,
            name: state.user?.name,
            role: state.user?.role,
            // Backend user fields
            username: state.user?.username,
            useremail: state.user?.useremail,
            displayName: state.user?.displayName,
            avatar: state.user?.avatar,
            bio: state.user?.bio,
            phone: state.user?.phone,
            location: state.user?.location,
            socials: state.user?.socials,
            isActive: state.user?.isActive,
            isAdmin: state.user?.isAdmin,
            banned: state.user?.banned,
            savedArtists: state.user?.savedArtists,
            updatedAt: state.user?.updatedAt,
            notificationSettings: state.user?.notificationSettings,
            bookings: state.user?.bookings,
            // Additional artist fields
            slug: state.user?.slug,
            photos: state.user?.photos,
            basePrice: state.user?.basePrice,
            genres: state.user?.genres,
            embeds: state.user?.embeds,
            // Additional artist properties
            isBookable: state.user?.isBookable,
            appealStatus: state.user?.appealStatus,
            artistType: state.user?.artistType,
            featured: state.user?.featured,
            isActiveArtist: state.user?.isActiveArtist,
            isApproved: state.user?.isApproved,
            isAvailable: state.user?.isAvailable,
          },
          isAuthenticated: state.isAuthenticated,
          authMode: state.authMode,
        }),
      }
    )
  )
);
