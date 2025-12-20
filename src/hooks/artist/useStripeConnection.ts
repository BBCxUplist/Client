import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

// Stripe connection status types
export enum StripeConnectionStatus {
  PENDING_ONBOARDING = 'pending_onboarding',
  ACTIVE = 'active',
  INCOMPLETE = 'incomplete',
  DISCONNECTED = 'disconnected',
}

// Stripe connection data interface
export interface StripeConnectionData {
  id: string;
  artistId: string;
  accountId: string;
  status: StripeConnectionStatus;
  createdAt: string;
}

// Stripe onboarding status interface
export interface StripeOnboardingStatus {
  status: 'onboarding_complete' | 'onboarding_incomplete';
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}

// Stripe account status interface
export interface StripeAccountStatus {
  accountId: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  status: string;
}

// API Response interfaces
interface StripeConnectionResponse {
  success: boolean;
  message: string;
  data: StripeConnectionData;
}

interface StripeRedirectResponse {
  success: boolean;
  message?: string;
  data: {
    redirect: string;
    status?: string;
    message?: string;
  };
}

interface StripeOnboardingResponse {
  success: boolean;
  data: StripeOnboardingStatus;
}

interface StripeStatusResponse {
  success: boolean;
  data: StripeAccountStatus;
}

// Step 1: Create Stripe connection (POST /stripe/) - Creates account + returns onboarding link
export const useCreateStripeConnection = () => {
  const queryClient = useQueryClient();

  return useMutation<StripeRedirectResponse, Error>({
    mutationFn: async () => {
      const response = await apiClient.post('/connections/stripe/');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['stripeStatus'],
      });
      queryClient.invalidateQueries({
        queryKey: ['stripeOnboardingStatus'],
      });
    },
  });
};

// Step 3: Check onboarding status (GET /stripe/handle_onboarding)
export const useGetStripeOnboardingStatus = (enabled: boolean = true) => {
  return useQuery<StripeOnboardingResponse>({
    queryKey: ['stripeOnboardingStatus'],
    queryFn: async () => {
      const response = await apiClient.get(
        '/connections/stripe/handle_onboarding'
      );
      return response.data;
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });
};

// Step 4 & 5: Get Stripe account status (GET /stripe/status) - Verify account is ready for payments/payouts
export const useGetStripeStatus = (enabled: boolean = true) => {
  return useQuery<StripeStatusResponse>({
    queryKey: ['stripeStatus'],
    queryFn: async () => {
      const response = await apiClient.get('/connections/stripe/');
      return response.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// Step 6: Get Stripe manage link (GET /stripe/manage) - Access Stripe Express Dashboard
export const useGetStripeManageLink = () => {
  return useMutation<StripeRedirectResponse, Error>({
    mutationFn: async () => {
      const response = await apiClient.get('/connections/stripe/manage');
      return response.data;
    },
  });
};

// Legacy: Get Stripe connection (keeping for backwards compatibility)
export const useGetStripeConnection = () => {
  return useQuery<StripeConnectionResponse>({
    queryKey: ['stripeConnection'],
    queryFn: async () => {
      const response = await apiClient.get('/connections/stripe/');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

// Get Stripe re-authentication link (for incomplete onboarding)
export const useGetStripeAuthLink = () => {
  return useMutation<StripeRedirectResponse, Error>({
    mutationFn: async () => {
      const response = await apiClient.get('/connections/stripe/authenticate');
      return response.data;
    },
  });
};
