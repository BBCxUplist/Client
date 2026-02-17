import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import type {
  MailchimpConnection,
  MailchimpSubscribersResponse,
} from '@/types/mailchimp';
import toast from 'react-hot-toast';

const MAILCHIMP_QUERY_KEYS = {
  connection: 'mailchimp-connection',
  lists: 'mailchimp-lists',
  subscribers: (filters: any) => ['mailchimp-subscribers', filters],
  stats: 'mailchimp-stats',
};

// Get Mailchimp connection status
export const useMailchimpConnection = () => {
  return useQuery({
    queryKey: [MAILCHIMP_QUERY_KEYS.connection],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/mailchimp/lists');

        if (response.data.success) {
          return {
            isConnected: true,
            accountName: response.data.data?.account_name || null,
            datacenter: response.data.data?.datacenter || null,
            defaultListId: response.data.data?.default_list_id || null,
            isActive: response.data.data?.is_active !== false,
          } as MailchimpConnection;
        } else {
          throw new Error(
            response.data.message || 'Failed to get connection status'
          );
        }
      } catch (error: any) {
        // Check for specific error messages that indicate not connected
        const errorMessage = error.response?.data?.message || error.message;
        if (
          error.response?.status === 400 ||
          errorMessage === 'Mailchimp not connected' ||
          errorMessage?.includes('not connected')
        ) {
          return {
            isConnected: false,
            accountName: null,
            datacenter: null,
            defaultListId: null,
            isActive: false,
          } as MailchimpConnection;
        }
        // Re-throw for other errors
        throw error;
      }
    },
    retry: false,
    staleTime: 60 * 1000, // 1 minute
  });
};

// Get Mailchimp lists/audiences
export const useMailchimpLists = () => {
  return useQuery({
    queryKey: [MAILCHIMP_QUERY_KEYS.lists],
    queryFn: async () => {
      const response = await apiClient.get('/mailchimp/lists');
      return response.data.data?.lists || [];
    },
    enabled: false, // Only fetch when explicitly called
    retry: false,
  });
};

// Connect Mailchimp OAuth
export const useConnectMailchimp = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(
        '/mailchimp/connect',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to connect Mailchimp');
      }

      return response.data;
    },
    onSuccess: data => {
      if (data.data?.redirectUrl) {
        // Redirect to Mailchimp OAuth - this will leave the current page
        window.location.href = data.data.redirectUrl;
      } else {
        throw new Error('No redirect URL provided');
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to connect Mailchimp'
      );
    },
  });
};

// Update Mailchimp settings
export const useUpdateMailchimpSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: { list_id?: string; is_active?: boolean }) => {
      const response = await apiClient.put('/mailchimp/', settings);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MAILCHIMP_QUERY_KEYS.connection],
      });
      toast.success('Settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    },
  });
};

// Disconnect Mailchimp
export const useDisconnectMailchimp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete('/mailchimp/');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MAILCHIMP_QUERY_KEYS.connection],
      });
      queryClient.invalidateQueries({ queryKey: [MAILCHIMP_QUERY_KEYS.lists] });
      toast.success('Mailchimp disconnected successfully');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to disconnect Mailchimp'
      );
    },
  });
};

// Get subscribers
export const useMailchimpSubscribers = (filters: {
  status?: string;
  count?: number;
  offset?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: [MAILCHIMP_QUERY_KEYS.subscribers(filters)],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.count) params.append('count', filters.count.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
      if (filters.search) params.append('search', filters.search);

      const response = await apiClient.get(
        `/mailchimp/subscribers?${params.toString()}`
      );
      return response.data.data as MailchimpSubscribersResponse;
    },
    enabled: false, // Only fetch when explicitly called
    retry: false,
  });
};

// Subscribe to artist newsletter
export const useSubscribeToArtist = () => {
  return useMutation({
    mutationFn: async ({
      artistId,
      email_address,
    }: {
      artistId: string;
      email_address: string;
    }) => {
      const response = await apiClient.post('/mailchimp/subscribe', {
        artist_id: artistId,
        email_address,
      });
      return response.data;
    },
    onError: (error: any) => {
      console.error('Subscription error:', error);
      // Don't show toast here, let component handle it
    },
  });
};

// Utility function to handle Mailchimp errors
export const handleMailchimpError = (error: any): string => {
  // Handle network/CORS errors
  if (error?.code === 'ERR_NETWORK') {
    return 'Network error. Please check your connection and try again.';
  }

  if (error?.message?.includes('CORS')) {
    return 'Configuration error. Please contact support.';
  }

  if (error?.response?.status === 0) {
    return 'Connection failed. Please try again later.';
  }

  const errorMessage = error?.response?.data?.message || error.message;

  switch (errorMessage) {
    case 'Artist has no default Mailchimp audience configured.':
    case 'Artist has no default audience configured':
      return "This artist hasn't set up their newsletter yet. Check back later!";
    case 'Mailchimp not connected for this artist':
    case 'Mailchimp not connected':
      return "This artist hasn't connected their newsletter service yet. Please check back later!";
    case 'NO_DEFAULT_LIST':
      return 'Newsletter configuration incomplete';
    case 'Invalid email address':
      return 'Please enter a valid email address';
    case 'you already subscribe this artist':
      return "You're already subscribed to this artist's newsletter";
    default:
      return 'Something went wrong. Please try again.';
  }
};
