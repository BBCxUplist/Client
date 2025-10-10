import axios, { AxiosError, type AxiosResponse } from 'axios';
import { tokenCookies } from '@/lib/cookieUtils';
import { authService } from '@/lib/authService';
import { apiClient } from './apiClient'; // Import the apiClient instance

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Setup axios interceptors for automatic token refresh
 */
export function setupAxiosInterceptors() {
  // Clear existing interceptors to prevent duplicates if called multiple times
  axios.interceptors.request.clear();
  axios.interceptors.response.clear();

  apiClient.interceptors.request.clear();
  apiClient.interceptors.response.clear();

  // Request interceptor to add auth token
  apiClient.interceptors.request.use(
    config => {
      const token = tokenCookies.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
        if (isRefreshing) {
          // If already refreshing, queue the request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh the token
          await authService.refreshToken();
          const newToken = tokenCookies.getAccessToken();

          processQueue(null, newToken);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);

          // If refresh fails, clear auth and redirect to login
          authService.logout();

          // Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/auth';
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
}

/**
 * Remove axios interceptors (useful for cleanup)
 */
export function removeAxiosInterceptors() {
  axios.interceptors.request.clear();
  axios.interceptors.response.clear();
  apiClient.interceptors.request.clear();
  apiClient.interceptors.response.clear();
}
