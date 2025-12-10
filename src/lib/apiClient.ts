import axios from 'axios';
import { authService } from './authService';
import { api } from '@/config';

// Create axios instance
export const apiClient = axios.create({
  baseURL: api.url,
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
