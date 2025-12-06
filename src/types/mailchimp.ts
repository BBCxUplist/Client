// Types for Mailchimp integration
export interface MailchimpConnection {
  isConnected: boolean;
  accountName: string | null;
  datacenter: string | null;
  defaultListId: string | null;
  isActive: boolean;
}

export interface MailchimpList {
  id: string;
  name: string;
  member_count: number;
}

export interface MailchimpSubscriber {
  id: string;
  email_address: string;
  status: 'subscribed' | 'unsubscribed' | 'pending' | 'cleaned';
  timestamp_opt: string;
  merge_fields: {
    FNAME?: string;
    LNAME?: string;
  };
  tags: string[];
}

export interface MailchimpAudience {
  id: string;
  name: string;
  datacenter: string;
}

export interface MailchimpSubscribersResponse {
  audience: MailchimpAudience;
  total_items: number;
  count: number;
  offset: number;
  status: string;
  members: MailchimpSubscriber[];
}

export interface MailchimpState {
  connection: MailchimpConnection;
  lists: MailchimpList[];
  subscribers: {
    members: MailchimpSubscriber[];
    total_items: number;
    loading: boolean;
    filters: {
      status: string;
      search: string;
    };
    pagination: {
      offset: number;
      count: number;
    };
  };
}

export interface NewsletterSignupProps {
  artistId: string;
  className?: string;
  showSubscriberCount?: boolean;
  minimal?: boolean;
  onSubscribe?: (email: string) => void;
}

export type SubscriptionStatus =
  | 'idle'
  | 'success'
  | 'error'
  | 'already_subscribed'
  | 'loading';

// Export default to avoid module issues
export default {};
