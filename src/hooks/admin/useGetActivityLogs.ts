import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface Activity {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

interface Actor {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  role: string;
}

interface ActivityItem {
  activity: Activity;
  actor: Actor;
}

interface GetActivityLogsResponse {
  success: boolean;
  message: string;
  data: {
    activities: ActivityItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface UseGetActivityLogsParams {
  action?: string;
  targetType?: string;
  actorId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}

export const useGetActivityLogs = (params: UseGetActivityLogsParams = {}) => {
  const {
    action,
    targetType,
    actorId,
    startDate,
    endDate,
    limit = 50,
    page = 1,
  } = params;

  return useQuery<GetActivityLogsResponse, Error>({
    queryKey: [
      'admin',
      'activity',
      { action, targetType, actorId, startDate, endDate, limit, page },
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (action) queryParams.append('action', action);
      if (targetType) queryParams.append('targetType', targetType);
      if (actorId) queryParams.append('actorId', actorId);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      queryParams.append('limit', limit.toString());
      queryParams.append('page', page.toString());

      const response = await apiClient.get<GetActivityLogsResponse>(
        `/admin/activity?${queryParams.toString()}`
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};
