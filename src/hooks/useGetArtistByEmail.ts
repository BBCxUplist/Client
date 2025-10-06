import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import type { ArtistByEmailResponse } from '@/types/api';

interface UseGetArtistByEmailProps {
  email: string;
  enabled?: boolean;
}

export const useGetArtistByEmail = ({
  email,
  enabled = true,
}: UseGetArtistByEmailProps) => {
  return useQuery<ArtistByEmailResponse, Error>({
    queryKey: ['artist', 'email', email],
    queryFn: async () => {
      const response = await apiClient.get<ArtistByEmailResponse>(
        `/artists/email/${email}`
      );
      return response.data;
    },
    enabled: enabled && !!email,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
