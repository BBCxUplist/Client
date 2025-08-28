export type Role = "user" | "artist" | "admin";

export type BookingStatus =
  | "inquiry"
  | "pending"
  | "negotiating"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "declined";

export type EscrowStatus = "none" | "funded" | "released" | "refunded";

export type AppealStatus = "pending" | "approved" | "rejected";

export type ReportStatus = "open" | "closed";

export type ReportTargetType = "user" | "artist";

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
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
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
  categories: string[];
  availability: string[];
  timeSlots: string[];
  isBookable: boolean;
  appealStatus: AppealStatus;
  featured?: boolean;
  banned?: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  artistId: string;
  userId: string;
  status: BookingStatus;
  date: string;
  timeSlot?: string;
  amount: number;
  originalAmount?: number;
  counterOffer?: number;
  counterNote?: string;
  escrowStatus: EscrowStatus;
  threadId?: string;
  platformFee: number;
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
