// Auth-related types for the application
import type {
  User as SupabaseUser,
  Session as SupabaseSession,
} from '@supabase/supabase-js';

export interface User {
  id: string;
  email?: string;
  name?: string;
  role?: 'user' | 'artist' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface AuthSession {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at?: number;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'artist';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

export interface RegisterResponse {
  user: SupabaseUser | null;
  session: SupabaseSession | null;
  needsConfirmation?: boolean;
}

export interface LoginResponse {
  user: SupabaseUser;
  session: SupabaseSession;
}

// Form data types for auth components
export interface AuthFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isArtist: boolean;
}

export type AuthMode = 'signin' | 'register';

// Hook return types
import type { UseMutationResult } from '@tanstack/react-query';

export type UseRegisterReturn = UseMutationResult<
  RegisterResponse,
  AuthError,
  RegisterData
>;
export type UseLoginReturn = UseMutationResult<
  LoginResponse,
  AuthError,
  LoginData
>;
