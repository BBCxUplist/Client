import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import {
  tokenCookies,
  userDataCookies,
  clearAllAuthCookies,
} from '@/lib/cookieUtils';
import type { Store, ConsolidatedUser } from '@/types/store';
import type { Role } from '@/types';
import type { Artist } from '@/types/api';

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

        // Newsletter subscription state
        newsletterSubscriptions: [] as string[],

        // Dashboard tab states
        adminDashboardTab: 'overview',
        artistDashboardTab: 'overview',
        userDashboardTab: 'overview',

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
          } else {
            // Clear user data cookies when user is null
            userDataCookies.clearUserData();
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

          // Use aggressive cookie clearing as backup
          try {
            clearAllAuthCookies();
          } catch (error) {
            console.warn('Failed to run aggressive cookie clearing:', error);
          }

          // Also clear persisted storage
          try {
            localStorage.removeItem('auth-storage');
            // Also try clearing any other potential auth storage keys
            const authKeys = [
              'auth-storage',
              'user-storage',
              'token-storage',
              'session-storage',
            ];
            authKeys.forEach(key => {
              localStorage.removeItem(key);
              sessionStorage.removeItem(key);
            });
          } catch (error) {
            console.warn('Failed to clear persisted auth storage:', error);
          }

          set({
            user: null,
            isAuthenticated: false,
          });
        },

        setAuthMode: authMode => set({ authMode }),

        logout: async () => {
          try {
            // Call the backend logout endpoint directly
            const accessToken = tokenCookies.getAccessToken();
            const refreshToken = tokenCookies.getRefreshToken();

            if (accessToken && refreshToken) {
              const { api } = await import('@/config');
              await fetch(`${api.url}/auth/logout`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ refreshToken }),
              }).catch(error => {
                console.warn('Backend logout API call failed:', error);
              });
            }
          } catch (error) {
            console.warn('Backend logout failed:', error);
            // Continue with local cleanup even if API call fails
          }

          // Try Supabase logout as well (for Google auth)
          try {
            await supabase.auth.signOut();
          } catch (error) {
            console.warn('Supabase logout failed:', error);
          }

          // Clear all auth data
          tokenCookies.clearTokens();
          userDataCookies.clearUserData();

          // Use aggressive cookie clearing as backup
          try {
            clearAllAuthCookies();
          } catch (error) {
            console.warn('Failed to run aggressive cookie clearing:', error);
          }

          // Also clear persisted storage
          try {
            localStorage.removeItem('auth-storage');
            const authKeys = [
              'auth-storage',
              'user-storage',
              'token-storage',
              'session-storage',
            ];
            authKeys.forEach(key => {
              localStorage.removeItem(key);
              sessionStorage.removeItem(key);
            });
          } catch (error) {
            console.warn('Failed to clear persisted auth storage:', error);
          }

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

        // Newsletter subscription actions
        addNewsletterSubscription: (artistId: string) => {
          set(state => ({
            newsletterSubscriptions: state.newsletterSubscriptions.includes(
              artistId
            )
              ? state.newsletterSubscriptions
              : [...state.newsletterSubscriptions, artistId],
          }));
        },

        removeNewsletterSubscription: (artistId: string) => {
          set(state => ({
            newsletterSubscriptions: state.newsletterSubscriptions.filter(
              id => id !== artistId
            ),
          }));
        },

        isSubscribedToNewsletter: (artistId: string) => {
          return get().newsletterSubscriptions.includes(artistId);
        },

        // Dashboard tab actions
        setAdminDashboardTab: (tab: string) => {
          set({ adminDashboardTab: tab });
        },

        setArtistDashboardTab: (tab: string) => {
          set({ artistDashboardTab: tab });
        },

        setUserDashboardTab: (tab: string) => {
          set({ userDashboardTab: tab });
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
        // Only persist user data, not authentication tokens (those are in cookies)
        // Also be more conservative about what user data we persist
        partialize: state => ({
          // Only persist basic user info, not sensitive data
          user: state.user
            ? {
                id: state.user.id,
                email: state.user.email,
                name: state.user.name,
                role: state.user.role,
                username: state.user.username,
                displayName: state.user.displayName,
                avatar: state.user.avatar,
                bio: state.user.bio,
                // Don't persist sensitive or frequently changing data
              }
            : null,
          // Don't persist isAuthenticated - this should be determined by token validation
          authMode: state.authMode,
          // Persist dashboard tabs
          adminDashboardTab: state.adminDashboardTab,
          artistDashboardTab: state.artistDashboardTab,
          userDashboardTab: state.userDashboardTab,
        }),
        // Add version to handle breaking changes
        version: 1,
        // Custom storage to handle errors gracefully
        storage: {
          getItem: name => {
            try {
              const item = localStorage.getItem(name);
              if (!item) return null;

              const parsed = JSON.parse(item);

              // If we have persisted user data, also check if we have tokens
              if (parsed.state?.user) {
                const hasAccessToken = tokenCookies.getAccessToken();
                const hasRefreshToken = tokenCookies.getRefreshToken();

                // Only restore authentication state if we have tokens
                if (hasAccessToken && hasRefreshToken) {
                  return {
                    ...parsed,
                    state: {
                      ...parsed.state,
                      isAuthenticated: true, // Set authenticated if we have both user and tokens
                    },
                  };
                } else {
                  // Clear persisted user data if no tokens
                  return {
                    ...parsed,
                    state: {
                      ...parsed.state,
                      user: null,
                      isAuthenticated: false,
                    },
                  };
                }
              }

              return parsed;
            } catch (error) {
              console.warn('Failed to parse stored auth data:', error);
              localStorage.removeItem(name);
              return null;
            }
          },
          setItem: (name, value) => {
            try {
              localStorage.setItem(name, JSON.stringify(value));
            } catch (error) {
              console.warn('Failed to store auth data:', error);
            }
          },
          removeItem: name => {
            try {
              localStorage.removeItem(name);
            } catch (error) {
              console.warn('Failed to remove stored auth data:', error);
            }
          },
        },
      }
    )
  )
);
