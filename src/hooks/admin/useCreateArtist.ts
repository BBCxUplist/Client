import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import toast from 'react-hot-toast';

interface CreateArtistData {
  email: string;
  username: string;
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
    user: any;
    artist: any;
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
      toast.success(data.message || 'Artist account created successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to create artist account'
      );
    },
  });
};
