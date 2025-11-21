// Types for tab components - only include necessary data

export interface AboutTabData {
  id?: string;
  displayName?: string;
  bio?: string;
}

export interface GalleryTabData {
  photos?: string[];
}

export interface BookingTabData {
  id: string;
  displayName: string;
  basePrice: number;
  isBookable: boolean;
  location?: string;
}
