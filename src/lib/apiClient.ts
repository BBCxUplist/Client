import axios from 'axios';
import { authService } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

// Validate API URL is set
if (!API_URL) {
  console.error('VITE_API_URL is not set in environment variables');
}

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL || 'http://localhost:3000/api/v1', // Fallback for development
  headers: {
    'Content-Type': 'application/json',
  },
});

// Note: Request and response interceptors are now handled in axiosInterceptors.ts
// This keeps the API client clean and focused on configuration

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
