// Store-related types for the application

// Consolidated user interface that handles both regular users and artists
// Includes both Supabase auth fields and backend data
export interface ConsolidatedUser {
  // Core user fields (from Supabase auth)
  id: string;
  email?: string;
  name?: string;
  role?: 'user' | 'artist' | 'admin';

  // Backend user fields (populated after API calls)
  username?: string;
  useremail?: string;
  displayName?: string | null;
  avatar?: string | null;
  bio?: string | null;
  phone?: string | null;
  location?: string | null;
  socials?: any;
  isActive?: boolean;
  isAdmin?: boolean;
  banned?: boolean;
  saved_artists?: string[];
  // Additional artist fields
  slug?: string;
  photos?: string[];
  basePrice?: number;
  genres?: string[];
  embeds?: {
    youtube?: string[];
    soundcloud?: string[];
    spotify?: string[];
  };
  // Additional artist properties
  isBookable?: boolean;
  appealStatus?: string;
  artistType?: string;
  featured?: boolean;
  isActiveArtist?: boolean;
  isApproved?: boolean;
  isAvailable?: boolean;
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
  getRole: () => 'user' | 'artist' | 'admin';
  isArtist: () => boolean;
  isAdmin: () => boolean;
}

export type Store = AuthState & AuthActions;
