import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface Report {
  id: string;
  fromUserId: string;
  toUserId: string;
  description: string;
  status: 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

interface ReportUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
}

interface ReportItem {
  report: Report;
  fromUser: ReportUser;
  toUser: ReportUser;
}

interface GetAllReportsResponse {
  success: boolean;
  message: string;
  data: {
    items: ReportItem[];
    total: number;
    page: number;
    limit: number;
  };
}

interface UseGetAllReportsParams {
  status?: 'pending' | 'resolved';
  priority?: 'low' | 'medium' | 'high';
  limit?: number;
  page?: number;
}

export const useGetAllReports = (params: UseGetAllReportsParams = {}) => {
  const { status, priority, limit = 50, page = 1 } = params;

  return useQuery<GetAllReportsResponse, Error>({
    queryKey: ['admin', 'reports', { status, priority, limit, page }],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);
      if (priority) queryParams.append('priority', priority);
      queryParams.append('limit', limit.toString());
      queryParams.append('page', page.toString());

      const response = await apiClient.get<GetAllReportsResponse>(
        `/admin/reports?${queryParams.toString()}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
