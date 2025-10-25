import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import toast from 'react-hot-toast';

export interface CreateArtistData {
  email: string;
  username: string;
  // No password needed - artist will create their own when they sign up
  displayName?: string;
  bio?: string;
  phone?: string;
  location?: string;
  socials?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    spotify?: string;
    soundcloud?: string;
  };
  genres?: string[];
  artistType?: 'dj' | 'music_artist' | 'other' | 'none';
  basePrice?: number;
  photos?: string[];
  embeds?: {
    youtube?: string[];
    spotify?: string[];
    soundcloud?: string[];
    custom?: Array<{ title: string; url: string }>;
  };
  privacyOptions?: {
    profileVisibility?: boolean;
    showContactInfo?: boolean;
    allowDirectMessages?: boolean;
  };
  isBookable?: boolean;
  isAvailable?: boolean;
  featured?: boolean;
}

interface CreateArtistResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
    profile: any; // Pre-created artist profile
  };
}

export const useCreateArtist = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateArtistResponse, Error, CreateArtistData>({
    mutationFn: async artistData => {
      const response = await apiClient.post<CreateArtistResponse>(
        '/admin/artists',
        artistData
      );
      return response.data;
    },
    onSuccess: data => {
      toast.success(
        data.data.message ||
          'Artist profile created successfully! The artist can now sign up to claim their account.'
      );
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      queryClient.invalidateQueries({
        queryKey: ['admin', 'pre-created-profiles'],
      });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to create artist account'
      );
    },
  });
};
