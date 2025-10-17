export interface Socials {
  twitter?: string;
  instagram?: string;
}

export interface Embeds {
  spotify?: string[];
  youtube?: string[];
  soundcloud?: string[];
}

export interface RiderItem {
  id: string;
  artistId: string;
  name: string;
  status: 'included' | 'to_be_provided';
  createdAt: string;
  updatedAt: string;
}

export interface Artist {
  id: string;
  role: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  bio: string;
  phone: string;
  location: string;
  socials: Socials;
  isActive: boolean;
  isAdmin: boolean;
  isLinkpageVisible: boolean;
  banned: boolean;
  genres: string[];
  photos: string[];
  embeds: Embeds;
  riders?: RiderItem[];
  artistType: string;
  basePrice: number;
  featured: boolean;
  isActiveArtist: boolean;
  isApproved: boolean;
  isAvailable: boolean;
  isBookable: boolean;
  appealStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedArtistsResponse {
  success: boolean;
  message: string;
  data: {
    artists: Artist[];
  };
}

export interface AllArtistsResponse {
  success: boolean;
  message: string;
  data: {
    artists: Artist[];
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface ArtistByEmailResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    role: string;
    username: string;
    useremail: string;
    displayName: string | null;
    avatar: string | null;
    bio: string | null;
    phone: string | null;
    location: string | null;
    socials: any | null;
    isActive: boolean;
    isAdmin: boolean;
    is_linkpage_visible: boolean;
    banned: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface User {
  id: string;
  useremail: string;
  username: string;
  role: string;
  bio: string | null;
  displayName: string | null;
  avatar: string | null;
  phone: string | null;
  location: string | null;
  socials: Socials | null;
  isActive: boolean;
  isAdmin: boolean;
  is_linkpage_visible: boolean;
  banned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserByEmailResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UpdateUserProfileRequest {
  username?: string;
  bio?: string;
  displayName?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  socials?: Socials;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  message: string;
  data: User;
}
