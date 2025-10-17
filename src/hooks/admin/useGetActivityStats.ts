import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface ActivityStat {
  action: string;
  count: number;
}

interface GetActivityStatsResponse {
  success: boolean;
  message: string;
  data: {
    stats: ActivityStat[];
    period: string;
  };
}

interface UseGetActivityStatsParams {
  days?: number;
}

export const useGetActivityStats = (params: UseGetActivityStatsParams = {}) => {
  const { days = 7 } = params;

  return useQuery<GetActivityStatsResponse, Error>({
    queryKey: ['admin', 'activity', 'stats', { days }],
    queryFn: async () => {
      const response = await apiClient.get<GetActivityStatsResponse>(
        `/admin/activity/stats?days=${days}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
