import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import toast from 'react-hot-toast';

interface ResolveReportResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const useResolveReport = () => {
  const queryClient = useQueryClient();

  return useMutation<ResolveReportResponse, Error, string>({
    mutationFn: async (reportId: string) => {
      const response = await apiClient.patch<ResolveReportResponse>(
        `/admin/reports/${reportId}/resolve`
      );
      return response.data;
    },
    onSuccess: data => {
      toast.success(data.message || 'Report resolved successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to resolve report');
    },
  });
};
