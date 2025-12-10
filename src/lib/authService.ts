import axios from 'axios';
import { useStore } from '@/stores/store';
import { tokenCookies } from '@/lib/cookieUtils';
import { api } from '@/config';
import type { User } from '@/types/auth';

// Type for user data that comes from the backend API
// This includes both Supabase auth fields and backend-specific fields
interface BackendUser extends User {
  // Backend-specific fields that might be present in API responses
  username?: string;
  useremail?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  socials?: any;
  isActive?: boolean;
  isAdmin?: boolean;
  banned?: boolean;
  saved_artists?: string[];
  slug?: string;
  photos?: string[];
  basePrice?: number;
  genres?: string[];
  embeds?: {
    youtube?: string[];
    soundcloud?: string[];
    spotify?: string[];
  };
  isBookable?: boolean;
  appealStatus?: 'pending' | 'approved' | 'rejected';
  artistType?: string;
  featured?: boolean;
  isActiveArtist?: boolean;
  isApproved?: boolean;
  isAvailable?: boolean;
}

const API_URL = api.url;

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'artist';
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/auth/login`,
        credentials
      );

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;

        // Convert User to ConsolidatedUser format
        // Cast to BackendUser since API response might include backend fields
        const backendUser = user as BackendUser;

        const consolidatedUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'user',
          // Backend fields (may be undefined if not set)
          username: backendUser.username,
          useremail: user.email,
          displayName: user.name,
          avatar: backendUser.avatar,
          bio: backendUser.bio,
          phone: backendUser.phone,
          location: backendUser.location,
          socials: backendUser.socials,
          isActive: backendUser.isActive,
          isAdmin: backendUser.isAdmin,
          banned: backendUser.banned,
          saved_artists: backendUser.saved_artists,
          slug: backendUser.slug,
          photos: backendUser.photos,
          basePrice: backendUser.basePrice,
          genres: backendUser.genres,
          embeds: backendUser.embeds,
          isBookable: backendUser.isBookable,
          appealStatus: backendUser.appealStatus,
          artistType: backendUser.artistType,
          featured: backendUser.featured,
          isActiveArtist: backendUser.isActiveArtist,
          isApproved: backendUser.isApproved,
          isAvailable: backendUser.isAvailable,
        };

        // Store tokens and user data
        const store = useStore.getState();
        store.setAuth(consolidatedUser, accessToken, refreshToken);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await axios.post<RegisterResponse>(
        `${API_URL}/auth/register`,
        userData
      );

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;

        // Convert User to ConsolidatedUser format
        // Cast to BackendUser since API response might include backend fields
        const backendUser = user as BackendUser;

        const consolidatedUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'user',
          // Backend fields (may be undefined if not set)
          username: backendUser.username,
          useremail: user.email,
          displayName: user.name,
          avatar: backendUser.avatar,
          bio: backendUser.bio,
          phone: backendUser.phone,
          location: backendUser.location,
          socials: backendUser.socials,
          isActive: backendUser.isActive,
          isAdmin: backendUser.isAdmin,
          banned: backendUser.banned,
          saved_artists: backendUser.saved_artists,
          slug: backendUser.slug,
          photos: backendUser.photos,
          basePrice: backendUser.basePrice,
          genres: backendUser.genres,
          embeds: backendUser.embeds,
          isBookable: backendUser.isBookable,
          appealStatus: backendUser.appealStatus,
          artistType: backendUser.artistType,
          featured: backendUser.featured,
          isActiveArtist: backendUser.isActiveArtist,
          isApproved: backendUser.isApproved,
          isAvailable: backendUser.isAvailable,
        };

        // Store tokens and user data
        const store = useStore.getState();
        store.setAuth(consolidatedUser, accessToken, refreshToken);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = tokenCookies.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post<RefreshTokenResponse>(
        `${API_URL}/auth/refresh`,
        {
          refreshToken,
        }
      );

      if (response.data.success) {
        const {
          user,
          accessToken,
          refreshToken: newRefreshToken,
        } = response.data.data;

        // Convert User to ConsolidatedUser format
        // Cast to BackendUser since API response might include backend fields
        const backendUser = user as BackendUser;

        const consolidatedUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'user',
          // Backend fields (may be undefined if not set)
          username: backendUser.username,
          useremail: user.email,
          displayName: user.name,
          avatar: backendUser.avatar,
          bio: backendUser.bio,
          phone: backendUser.phone,
          location: backendUser.location,
          socials: backendUser.socials,
          isActive: backendUser.isActive,
          isAdmin: backendUser.isAdmin,
          banned: backendUser.banned,
          saved_artists: backendUser.saved_artists,
          slug: backendUser.slug,
          photos: backendUser.photos,
          basePrice: backendUser.basePrice,
          genres: backendUser.genres,
          embeds: backendUser.embeds,
          isBookable: backendUser.isBookable,
          appealStatus: backendUser.appealStatus,
          artistType: backendUser.artistType,
          featured: backendUser.featured,
          isActiveArtist: backendUser.isActiveArtist,
          isApproved: backendUser.isApproved,
          isAvailable: backendUser.isAvailable,
        };

        // Update tokens and user data
        const store = useStore.getState();
        store.setAuth(consolidatedUser, accessToken, newRefreshToken);
      }

      return response.data;
    } catch (error: any) {
      // If refresh fails, clear auth and redirect to login
      const store = useStore.getState();
      store.clearAuth();
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  /**
   * Logout user and clear tokens
   */
  async logout(): Promise<void> {
    try {
      const accessToken = tokenCookies.getAccessToken();
      const refreshToken = tokenCookies.getRefreshToken();

      // Call logout endpoint if we have a token
      if (accessToken && refreshToken) {
        await axios.post(`${API_URL}/auth/logout`, {
          refreshToken,
        });
      }
    } catch (error) {
      // Even if logout API call fails, we should clear local auth
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local auth state using clearAuth to avoid circular dependency
      const store = useStore.getState();
      store.clearAuth();
    }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return tokenCookies.getAccessToken();
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    return tokenCookies.getRefreshToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const store = useStore.getState();
    const accessToken = tokenCookies.getAccessToken();
    return store.isAuthenticated && !!accessToken;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    const store = useStore.getState();
    return store.user;
  }

  /**
   * Check if token is expired (basic check)
   */
  isTokenExpired(): boolean {
    const accessToken = tokenCookies.getAccessToken();

    if (!accessToken) {
      return true;
    }

    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp < currentTime;
    } catch {
      // If we can't decode the token, consider it expired
      return true;
    }
  }

  /**
   * Verify token with server
   */
  async verifyToken(): Promise<boolean> {
    try {
      const accessToken = tokenCookies.getAccessToken();

      if (!accessToken) {
        return false;
      }

      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data.success;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
export default authService;
