import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';

interface Socials {
  twitter?: string;
  instagram?: string;
  youtube?: string;
  spotify?: string;
  soundcloud?: string;
}

interface Embeds {
  youtube?: string[];
  spotify?: string[];
  soundcloud?: string[];
  custom?: Array<{ title: string; url: string }>;
}

interface PrivacyOptions {
  profileVisibility: boolean;
  showContactInfo: boolean;
  allowDirectMessages: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  bookingReminders: boolean;
  artistRecommendations: boolean;
}

interface User {
  id: string;
  role: string;
  username: string;
  useremail: string;
  displayName: string | null;
  avatar: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  socials: Socials | null;
  notificationSettings: NotificationSettings;
  isActive: boolean;
  isAdmin: boolean;
  isLinkpageVisible: boolean;
  banned: boolean;
  savedArtists: string[];
  createdAt: string;
  updatedAt: string;
  isArtist: boolean;
  // Artist-specific fields (present only if isArtist is true)
  basePrice?: number;
  genres?: string[];
  photos?: string[];
  embeds?: Embeds | null;
  privacyOptions?: PrivacyOptions;
  artistType?: string;
  isActiveArtist?: boolean;
  isApproved?: boolean;
  isAvailable?: boolean;
  isBookable?: boolean;
  appealStatus?: string;
  featured?: boolean;
  artistCreatedAt?: string;
  artistUpdatedAt?: string;
}

interface GetAllUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    page: number;
    limit: number;
  };
}

/**
 * Fetches ALL users by automatically paginating through all pages
 * Returns combined results from all pages
 */
export const useGetAllUsers = () => {
  return useQuery<GetAllUsersResponse, Error>({
    queryKey: ['admin', 'users', 'all'],
    queryFn: async () => {
      const allUsers: User[] = [];
      let currentPage = 1;
      const limit = 100; // Fetch 100 per page for efficiency
      let hasMore = true;

      // Keep fetching pages until we get less than the limit (indicating last page)
      while (hasMore) {
        const response = await apiClient.get<GetAllUsersResponse>(
          `/admin/users?page=${currentPage}&limit=${limit}`
        );

        const fetchedUsers = response.data.data.users;
        allUsers.push(...fetchedUsers);

        // If we got less than the limit, we've reached the last page
        if (fetchedUsers.length < limit) {
          hasMore = false;
        } else {
          currentPage++;
        }
      }

      // Return in the same format as the API
      return {
        success: true,
        message: 'All users fetched successfully',
        data: {
          users: allUsers,
          page: 1,
          limit: allUsers.length,
        },
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
