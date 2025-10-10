// Store-related types for the application
import type { Role } from '@/types';

// Consolidated user interface that handles both regular users and artists
// Combines User and Artist types with additional Supabase auth fields
export interface ConsolidatedUser {
  // Core user fields (from Supabase auth)
  id: string;
  email?: string;
  name?: string;
  role?: Role;

  // User fields (from User type)
  avatar?: string | null;
  description?: string;
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  socials?: any;
  banned?: boolean;
  createdAt?: string;

  // Artist fields (from Artist type)
  slug?: string;
  embeds?: any;
  photos?: string[];
  basePrice?: number;
  genres?: string[];
  isBookable?: boolean;
  appealStatus?: 'pending' | 'approved' | 'rejected';
  featured?: boolean;

  // Backend user fields (populated after API calls)
  username?: string;
  useremail?: string;
  displayName?: string | null;
  isActive?: boolean;
  isAdmin?: boolean;
  saved_artists?: string[];
  updatedAt?: string;

  // Additional artist properties
  artistType?: string;
  isActiveArtist?: boolean;
  isApproved?: boolean;
  isAvailable?: boolean;
  isLinkpageVisible?: boolean;
}

export interface AuthState {
  user: ConsolidatedUser | null;
  isAuthenticated: boolean;
  authMode: 'signin' | 'register' | null;
}

export interface AuthActions {
  setAuth: (
    user: ConsolidatedUser,
    accessToken: string,
    refreshToken: string
  ) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
  setUser: (user: ConsolidatedUser) => void;
  setAuthMode: (mode: 'signin' | 'register' | null) => void;

  // Helper methods
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getRole: () => Role;
  isArtist: () => boolean;
  isAdmin: () => boolean;
}

export type Store = AuthState & AuthActions;
