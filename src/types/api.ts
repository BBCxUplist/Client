export interface Socials {
  twitter?: string;
  instagram?: string;
}

export interface Embeds {
  spotify?: string;
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
