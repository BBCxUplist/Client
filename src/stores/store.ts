import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: 'user' | 'artist' | 'admin' | null;
  accessToken: string | null;
  refreshToken: string | null;
  artistData: any | null;
  authMode: 'signin' | 'register' | null;
}

interface Store extends AuthState {
  // Legacy state
  count: number;
  increment: () => void;
  decrement: () => void;

  // Auth actions
  setUser: (user: User | null) => void;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setRole: (role: 'user' | 'artist' | 'admin' | null) => void;
  setArtistData: (artistData: any | null) => void;
  setAuthMode: (mode: 'signin' | 'register' | null) => void;
  logout: () => void;
}

export const useStore = create<Store>()(
  persist(
    set => ({
      // Legacy state
      count: 0,
      increment: () => set(state => ({ count: state.count + 1 })),
      decrement: () => set(state => ({ count: state.count - 1 })),

      // Auth state
      user: null,
      isAuthenticated: false,
      role: null,
      accessToken: null,
      refreshToken: null,
      artistData: null,
      authMode: null,

      // Auth actions
      setUser: user =>
        set({
          user,
          isAuthenticated: !!user,
          role: user?.role || null,
        }),

      setAuth: (user, accessToken, refreshToken) =>
        set({
          user,
          isAuthenticated: true,
          role: user.role || null,
          accessToken,
          refreshToken,
        }),

      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
          role: null,
          accessToken: null,
          refreshToken: null,
        }),

      setRole: role => set({ role }),

      setArtistData: artistData => set({ artistData }),

      setAuthMode: authMode => set({ authMode }),

      logout: async () => {
        await supabase.auth.signOut();

        set({
          user: null,
          isAuthenticated: false,
          role: null,
          accessToken: null,
          refreshToken: null,
          artistData: null,
          authMode: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        artistData: state.artistData,
        authMode: state.authMode,
      }),
    }
  )
);
