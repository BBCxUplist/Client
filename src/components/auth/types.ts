export interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isArtist: boolean;
}

export type AuthMode = 'signin' | 'register';
