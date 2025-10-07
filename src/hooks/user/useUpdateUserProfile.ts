import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import type {
  UpdateUserProfileRequest,
  UpdateUserProfileResponse,
} from '@/types/api';

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserProfileResponse,
    Error,
    UpdateUserProfileRequest
  >({
    mutationFn: async data => {
      const response = await apiClient.patch<UpdateUserProfileResponse>(
        '/users/update-profile',
        data
      );
      return response.data;
    },
    onSuccess: data => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Update the specific user cache if we have the email
      if (data.data.useremail) {
        queryClient.setQueryData(['user', 'email', data.data.useremail], data);
      }
    },
  });
};
