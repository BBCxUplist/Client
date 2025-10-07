import axios from 'axios';
import { useStore } from '@/stores/store';
import type { User } from '@/types/auth';

const API_URL = import.meta.env.VITE_API_URL;

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

        // Store tokens and user data
        const store = useStore.getState();
        store.setAuth(user, accessToken, refreshToken);
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

        // Store tokens and user data
        const store = useStore.getState();
        store.setAuth(user, accessToken, refreshToken);
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
      const store = useStore.getState();

      if (!store.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post<RefreshTokenResponse>(
        `${API_URL}/auth/refresh`,
        {
          refreshToken: store.refreshToken,
        }
      );

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;

        // Update tokens and user data
        store.setAuth(user, accessToken, refreshToken);
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
      const store = useStore.getState();

      // Call logout endpoint if we have a token
      if (store.accessToken) {
        await axios.post(`${API_URL}/auth/logout`, {
          refreshToken: store.refreshToken,
        });
      }
    } catch (error) {
      // Even if logout API call fails, we should clear local auth
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local auth state
      const store = useStore.getState();
      store.logout();
    }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    const store = useStore.getState();
    return store.accessToken;
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    const store = useStore.getState();
    return store.refreshToken;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const store = useStore.getState();
    return store.isAuthenticated && !!store.accessToken;
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
    const store = useStore.getState();

    if (!store.accessToken) {
      return true;
    }

    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(store.accessToken.split('.')[1]));
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
      const store = useStore.getState();

      if (!store.accessToken) {
        return false;
      }

      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${store.accessToken}`,
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
