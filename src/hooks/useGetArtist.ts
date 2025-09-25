import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

interface ArtistResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    role: string;
    username: string;
    email: string;
    displayName: string;
    avatar: string;
    bio: string;
    phone: string;
    location: string;
    socials: {
      twitter?: string;
      instagram?: string;
    };
    isActive: boolean;
    isAdmin: boolean;
    isLinkpageVisible: boolean;
    banned: boolean;
    genres: string[];
    photos: string[];
    embeds: {
      spotify?: string;
    };
    artistType: string;
    basePrice: number;
    featured: boolean;
    isActiveArtist: boolean;
    isApproved: boolean;
    isAvailable: boolean;
    isBookable: boolean;
    appealStatus: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const useGetArtist = (username: string) => {
  return useQuery({
    queryKey: ['artist', username],
    queryFn: async () => {
      const response = await apiClient.get(`/artists/username/${username}`);
      return response.data as ArtistResponse;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
