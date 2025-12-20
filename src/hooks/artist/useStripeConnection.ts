import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

// Stripe connection status types - matching backend AccountStatus
export type StripeAccountStatus =
  | 'not_created'
  | 'onboarding_incomplete'
  | 'onboarding_complete'
  | 'restricted'
  | 'restricted_soon'
  | 'active';

// Legacy enum for backwards compatibility
export enum StripeConnectionStatus {
  PENDING_ONBOARDING = 'pending_onboarding',
  ACTIVE = 'active',
  INCOMPLETE = 'incomplete',
  DISCONNECTED = 'disconnected',
}

// Stripe connection data interface (from database)
export interface StripeConnectionData {
  id: string;
  userId: string;
  accountId: string;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  detailsSubmitted?: boolean;
  accountStatus?: StripeAccountStatus;
  requirements?: {
    currentlyDue: string[];
    eventuallyDue: string[];
    disabledReason?: string;
  };
  lastStatusCheck?: string;
  createdAt: string;
  updatedAt: string;
}

// Stripe account status interface (from getAccountStatus/handleOnboarding)
export interface StripeAccountStatusData {
  status: StripeAccountStatus;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  requirements: {
    currentlyDue: string[];
    eventuallyDue: string[];
    disabledReason?: string;
  };
  isReadyForPayments: boolean;
  isReadyForPayouts: boolean;
  message: string;
  onboardingLink?: string | null;
}

// Stripe onboarding status interface (from handleOnboarding)
export interface StripeOnboardingStatus {
  status: StripeAccountStatus;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  isReadyForPayments: boolean;
  isReadyForPayouts: boolean;
  requirements: {
    currentlyDue: string[];
    eventuallyDue: string[];
    disabledReason?: string;
  };
  message: string;
  onboardingLink?: string | null;
}

// API Response interfaces - matching backend ResponseHandler structure
interface StripeConnectionResponse {
  success: boolean;
  message: string;
  data: StripeConnectionData;
}

interface StripeRedirectResponse {
  success: boolean;
  message: string;
  data: {
    redirect: string;
    status?: string;
    message?: string;
  };
}

interface StripeOnboardingResponse {
  success: boolean;
  message: string;
  data: StripeOnboardingStatus;
}

interface StripeStatusResponse {
  success: boolean;
  message: string;
  data: StripeAccountStatusData;
}

// Step 1: Create Stripe connection (POST /connections/stripe) - Creates account + returns onboarding link
export const useCreateStripeConnection = () => {
  const queryClient = useQueryClient();

  return useMutation<StripeRedirectResponse, Error>({
    mutationFn: async () => {
      const response = await apiClient.post('/connections/stripe');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['stripeStatus'],
      });
      queryClient.invalidateQueries({
        queryKey: ['stripeOnboardingStatus'],
      });
      queryClient.invalidateQueries({
        queryKey: ['stripeConnection'],
      });
    },
  });
};

// Step 3: Check onboarding status (GET /connections/stripe/handle_onboarding)
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

// Step 4 & 5: Get Stripe account status (GET /connections/stripe/status) - Verify account is ready for payments/payouts
export const useGetStripeStatus = (enabled: boolean = true) => {
  return useQuery<StripeStatusResponse>({
    queryKey: ['stripeStatus'],
    queryFn: async () => {
      const response = await apiClient.get('/connections/stripe/status');
      return response.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// Step 6: Get Stripe manage link (GET /connections/stripe/manage) - Access Stripe Express Dashboard
export const useGetStripeManageLink = () => {
  return useMutation<StripeRedirectResponse, Error>({
    mutationFn: async () => {
      const response = await apiClient.get('/connections/stripe/manage');
      return response.data;
    },
  });
};

// Get Stripe connection (GET /connections/stripe) - Get connection data from database
export const useGetStripeConnection = () => {
  return useQuery<StripeConnectionResponse>({
    queryKey: ['stripeConnection'],
    queryFn: async () => {
      const response = await apiClient.get('/connections/stripe');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

// Get Stripe re-authentication link (GET /connections/stripe/authenticate) - For incomplete onboarding
export const useGetStripeAuthLink = () => {
  return useMutation<StripeRedirectResponse, Error>({
    mutationFn: async () => {
      const response = await apiClient.get('/connections/stripe/authenticate');
      return response.data;
    },
  });
};

// Update Stripe connection (PUT /connections/stripe) - Update connection data
export const useUpdateStripeConnection = () => {
  const queryClient = useQueryClient();

  return useMutation<StripeConnectionResponse, Error, Record<string, any>>({
    mutationFn: async updateData => {
      const response = await apiClient.put('/connections/stripe', updateData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['stripeConnection'],
      });
      queryClient.invalidateQueries({
        queryKey: ['stripeStatus'],
      });
    },
  });
};
