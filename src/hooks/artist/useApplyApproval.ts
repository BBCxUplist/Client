import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { AppealStatus } from './useGetApprovalStatus';

interface ApplyApprovalData {
  id: string;
  isApproved: boolean;
  appealStatus: AppealStatus;
  updatedAt: string;
}

interface ApplyApprovalResponse {
  success: boolean;
  message: string;
  data: ApplyApprovalData;
}

export const useApplyApproval = () => {
  const queryClient = useQueryClient();

  return useMutation<ApplyApprovalResponse, Error>({
    mutationFn: async () => {
      const response = await apiClient.post('/artists/apply-approval');
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch approval status after successful application
      queryClient.invalidateQueries({
        queryKey: ['artistApprovalStatus'],
      });
    },
  });
};
