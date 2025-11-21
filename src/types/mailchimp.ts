// Mailchimp integration types for the frontend

export interface MailchimpAccount {
  account_name: string;
  datacenter: string;
  list_id: string;
  is_active: boolean;
  last_sync: string;
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
  artist_id: string;
  email_address: string;
}

export interface MailchimpList {
  id: string;
  name: string;
  member_count: number;
}

export interface MailchimpConnectionResponse {
  success: boolean;
  data: MailchimpAccount;
}

export interface MailchimpInitiateResponse {
  success: boolean;
  data: {
    redirect_url: string;
  };
}

export interface MailchimpApiError {
  success: false;
  message: string;
  error?: string;
}

// Newsletter subscription form state
export interface NewsletterSubscriptionState {
  email: string;
  isSubmitting: boolean;
  isSubscribed: boolean;
  error: string;
  fieldError: string;
}

// Integration status for UI
export interface NewsletterIntegrationStatus {
  isConnected: boolean;
  isActive: boolean;
  subscriberCount?: number;
  lastSync?: string;
  accountName?: string;
}
