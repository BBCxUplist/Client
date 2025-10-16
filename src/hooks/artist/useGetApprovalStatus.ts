import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

export enum AppealStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REQUESTED = 'requested',
}

interface ApprovalStatusData {
  isApproved: boolean;
  appealStatus: AppealStatus;
  updatedAt: string;
}

interface ApprovalStatusResponse {
  success: boolean;
  message: string;
  data: ApprovalStatusData;
}

export const useGetApprovalStatus = () => {
  return useQuery<ApprovalStatusResponse>({
    queryKey: ['artistApprovalStatus'],
    queryFn: async () => {
      const response = await apiClient.get('/artists/approval-status');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
