// Store-related types for the application
import type { Role } from '@/types';
import type { Artist } from '@/types/api';

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
  savedArtists?: Artist[];
  updatedAt?: string;

  // Notification settings
  notificationSettings?: {
    bookingReminders?: boolean;
    smsNotifications?: boolean;
    emailNotifications?: boolean;
    artistRecommendations?: boolean;
  };

  // Privacy options
  privacyOptions?: {
    showContactInfo?: boolean;
    profileVisibility?: boolean;
    allowDirectMessages?: boolean;
  };

  // Bookings
  bookings?: Array<{
    id: string;
    userId: string;
    artistId: string;
    status: string;
    isPaid: boolean;
    eventDate: string;
    eventType: string;
    duration: number;
    expectedGuests: number;
    budgetRange: string;
    eventLocation: string;
    specialRequirements: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    createdAt: string;
    updatedAt: string;
  }>;

  // Additional artist properties
  artistType?: string;
  isActiveArtist?: boolean;
  isApproved?: boolean;
  isAvailable?: boolean;
}

export interface AuthState {
  user: ConsolidatedUser | null;
  isAuthenticated: boolean;
  authMode: 'signin' | 'register' | null;
  artistCache: Record<
    string,
    { artists: Artist[]; hasMore: boolean; timestamp: number }
  >;
  newsletterSubscriptions: string[]; // Array of artist IDs user is subscribed to
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

  // Artist cache actions
  setArtistCache: (key: string, artists: Artist[], hasMore: boolean) => void;
  getArtistCache: (
    key: string
  ) => { artists: Artist[]; hasMore: boolean; timestamp: number } | null;
  clearArtistCache: () => void;

  // Newsletter subscription actions
  addNewsletterSubscription: (artistId: string) => void;
  removeNewsletterSubscription: (artistId: string) => void;
  isSubscribedToNewsletter: (artistId: string) => boolean;

  // Helper methods
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getRole: () => Role;
  isArtist: () => boolean;
  isAdmin: () => boolean;
}

export type Store = AuthState & AuthActions;
