import axios, { AxiosError, type AxiosResponse } from 'axios';

import { useStore } from '@/stores/store';
import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  config => {
    // Get the current store state
    const store = useStore.getState();

    // Add Bearer token if available
    if (store.accessToken) {
      config.headers.Authorization = `Bearer ${store.accessToken}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Check if the error is due to unauthorized access (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const store = useStore.getState();

      // If we have a refresh token, try to refresh the access token
      if (store.refreshToken) {
        try {
          // Use auth service to refresh token
          await authService.refreshToken();

          // Get the new access token
          const newAccessToken = authService.getAccessToken();

          if (newAccessToken) {
            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          } else {
            throw new Error('Failed to get new access token');
          }
        } catch (refreshError) {
          // Refresh failed, clear auth and redirect to login
          await authService.logout();
          window.location.href = '/auth';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, clear auth and redirect to login
        await authService.logout();
        window.location.href = '/auth';
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to get current access token
export const getAccessToken = (): string | null => {
  return authService.getAccessToken();
};

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return authService.isAuthenticated();
};

// Helper function to logout and clear tokens
export const logout = async (): Promise<void> => {
  await authService.logout();
  window.location.href = '/auth';
};

// Helper function to get current user
export const getCurrentUser = () => {
  return authService.getCurrentUser();
};

// Helper function to check if token is expired
export const isTokenExpired = (): boolean => {
  return authService.isTokenExpired();
};

// Helper function to verify token with server
export const verifyToken = async (): Promise<boolean> => {
  return authService.verifyToken();
};

export const saveToGallery = async (urls: string[]) => {
  if (!Array.isArray(urls) || urls.length === 0)
    return { msg: 'No URLs to save' };
  const { data } = await apiClient.post('/api/v1/artists/gallery', {
    photoUrls: urls,
  });
  return data; // { msg, data: Artist }
};
