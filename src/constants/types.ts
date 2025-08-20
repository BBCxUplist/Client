export type Role = 'user' | 'artist' | 'admin';

export type BookingStatus = 'inquiry' | 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';

export type EscrowStatus = 'none' | 'funded' | 'released' | 'refunded';

export type AppealStatus = 'pending' | 'approved' | 'rejected';

export type ReportStatus = 'open' | 'closed';

export type ReportTargetType = 'user' | 'artist';

export interface Socials {
  instagram?: string;
  twitter?: string;
  youtube?: string;
  spotify?: string;
  soundcloud?: string;
}

export interface Embeds {
  youtube?: string;
  spotify?: string;
  soundcloud?: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  socials?: Socials;
  role: Role;
  banned?: boolean;
  createdAt: string;
}

export interface Artist {
  id: string;
  slug: string;
  name: string;
  avatar?: string;
  bio?: string;
  socials?: Socials;
  embeds?: Embeds;
  photos: string[];
  price: number;
  rating: number;
  tags: string[];
  availability: string[];
  isBookable: boolean;
  appealStatus: AppealStatus;
  featured?: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  artistId: string;
  userId: string;
  status: BookingStatus;
  date: string;
  amount: number;
  escrowStatus: EscrowStatus;
  threadId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appeal {
  id: string;
  artistId: string;
  status: AppealStatus;
  message: string;
  portfolioLinks?: string[];
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: ReportTargetType;
  reason: string;
  details?: string;
  status: ReportStatus;
  createdAt: string;
  closedAt?: string;
  closedBy?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}
