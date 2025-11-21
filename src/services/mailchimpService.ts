import { apiClient } from '@/lib/apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';

export interface MailchimpAccount {
  userId: string;
  accessToken: string;
  datacenter: string;
  listId: string;
  accountName: string;
  isActive: boolean;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email_address: string;
  status: 'subscribed' | 'unsubscribed' | 'pending';
  timestamp_signup: string;
  merge_fields?: Record<string, any>;
  tags?: string[];
}

export interface SubscribersResponse {
  success: boolean;
  data: {
    subscribers: Subscriber[];
    total_items: number;
  };
}

export interface MailchimpSettings {
  list_id?: string;
  is_active: boolean;
}

export interface SubscriptionRequest {
  email_address: string;
  artist_id?: string;
}

const baseUrl = '/mailchimp';

// API Functions
export const mailchimpApi = {
  connect: async (): Promise<MailchimpAccount> => {
    const response = await apiClient.post(`${baseUrl}/connect`);
    return response.data;
  },

  disconnect: async (): Promise<void> => {
    await apiClient.delete(baseUrl);
  },

  getSubscribers: async (
    params: {
      status?: 'subscribed' | 'unsubscribed' | 'pending';
      count?: number;
      offset?: number;
      search?: string;
    } = {}
  ): Promise<SubscribersResponse> => {
    const response = await apiClient.get(`${baseUrl}/subscribers`, {
      params: {
        status: params.status || 'subscribed',
        count: params.count || 100,
        offset: params.offset || 0,
        ...(params.search && { search: params.search }),
      },
    });
    return response.data;
  },

  updateSettings: async (
    settings: MailchimpSettings
  ): Promise<MailchimpAccount> => {
    const response = await apiClient.put(baseUrl, settings);
    return response.data;
  },

  subscribeToArtist: async (
    subscription: SubscriptionRequest
  ): Promise<void> => {
    await apiClient.post(`${baseUrl}/subscribe`, subscription);
  },

  subscribeToArtistById: async (
    artistId: string,
    email: string
  ): Promise<void> => {
    await apiClient.post(`${baseUrl}/subscribe/${artistId}`, {
      email_address: email,
    });
  },

  getLists: async (): Promise<
    Array<{ id: string; name: string; member_count: number }>
  > => {
    const response = await apiClient.get(`${baseUrl}/lists`);
    return response.data.data || response.data;
  },

  syncSubscribers: async (): Promise<void> => {
    await apiClient.post(`${baseUrl}/sync`);
  },

  exportSubscribers: async (status?: string): Promise<Blob> => {
    const response = await apiClient.get(`${baseUrl}/subscribers/export`, {
      params: { status },
      responseType: 'blob',
    });
    return response.data;
  },
};

// Query Keys
export const mailchimpKeys = {
  all: ['mailchimp'] as const,
  subscribers: (params?: any) =>
    [...mailchimpKeys.all, 'subscribers', params] as const,
  lists: () => [...mailchimpKeys.all, 'lists'] as const,
  connection: () => [...mailchimpKeys.all, 'connection'] as const,
};

// Hooks
export const useMailchimpConnection = () => {
  return useQuery({
    queryKey: mailchimpKeys.connection(),
    queryFn: async () => {
      try {
        // Since there's no /status endpoint, we try to get subscribers to check connection
        await mailchimpApi.getSubscribers({ count: 1 });
        return {
          userId: '',
          accessToken: '',
          datacenter: '',
          listId: '',
          accountName: '',
          isActive: true,
          createdAt: new Date().toISOString(),
        };
      } catch (error: any) {
        if (error.response?.status === 404 || error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });
};

export const useConnectMailchimp = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: mailchimpApi.connect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mailchimpKeys.all });
      showSuccess('Mailchimp account connected successfully!');
    },
    onError: (error: any) => {
      showError(
        error.response?.data?.message || 'Failed to connect Mailchimp account'
      );
    },
  });
};

export const useDisconnectMailchimp = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: mailchimpApi.disconnect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mailchimpKeys.all });
      showSuccess('Mailchimp account disconnected successfully');
    },
    onError: (error: any) => {
      showError(
        error.response?.data?.message ||
          'Failed to disconnect Mailchimp account'
      );
    },
  });
};

export const useSubscribers = (params?: {
  status?: 'subscribed' | 'unsubscribed' | 'pending';
  count?: number;
  offset?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: mailchimpKeys.subscribers(params),
    queryFn: () => mailchimpApi.getSubscribers(params),
    enabled: true,
  });
};

export const useUpdateMailchimpSettings = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: mailchimpApi.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mailchimpKeys.all });
      showSuccess('Mailchimp settings updated successfully');
    },
    onError: (error: any) => {
      showError(
        error.response?.data?.message || 'Failed to update Mailchimp settings'
      );
    },
  });
};

export const useSubscribeToArtist = () => {
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: mailchimpApi.subscribeToArtist,
    onSuccess: () => {
      showSuccess('Successfully subscribed to newsletter!');
    },
    onError: (error: any) => {
      if (error.response?.status === 409) {
        showError("You are already subscribed to this artist's newsletter");
      } else {
        showError(
          error.response?.data?.message || 'Failed to subscribe to newsletter'
        );
      }
    },
  });
};

export const useSubscribeToArtistById = () => {
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({ artistId, email }: { artistId: string; email: string }) =>
      mailchimpApi.subscribeToArtistById(artistId, email),
    onSuccess: () => {
      showSuccess('Successfully subscribed to newsletter!');
    },
    onError: (error: any) => {
      if (error.response?.status === 409) {
        showError("You are already subscribed to this artist's newsletter");
      } else {
        showError(
          error.response?.data?.message || 'Failed to subscribe to newsletter'
        );
      }
    },
  });
};

export const useMailchimpLists = () => {
  return useQuery({
    queryKey: mailchimpKeys.lists(),
    queryFn: mailchimpApi.getLists,
  });
};

export const useSyncSubscribers = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: mailchimpApi.syncSubscribers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mailchimpKeys.subscribers() });
      showSuccess('Subscribers synced successfully');
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || 'Failed to sync subscribers');
    },
  });
};

export const useExportSubscribers = () => {
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: mailchimpApi.exportSubscribers,
    onSuccess: blob => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'subscribers.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSuccess('Subscribers exported successfully');
    },
    onError: (error: any) => {
      showError(
        error.response?.data?.message || 'Failed to export subscribers'
      );
    },
  });
};
