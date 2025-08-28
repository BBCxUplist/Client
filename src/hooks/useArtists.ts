import { useAppStore } from "@/store";
import type { Artist } from "@/constants/types";

export const useArtists = () => {
  const { artists } = useAppStore();
  return artists;
};

export const useArtistBySlug = (slug: string): Artist | undefined => {
  const artists = useArtists();
  return artists.find(artist => artist.slug === slug);
};

export const useArtistById = (id: string): Artist | undefined => {
  const artists = useArtists();
  return artists.find(artist => artist.id === id);
};

export const useFeaturedArtists = (): Artist[] => {
  const artists = useArtists();
  return artists.filter(artist => artist.featured && artist.isBookable);
};

export const useBookableArtists = (): Artist[] => {
  const artists = useArtists();
  return artists.filter(artist => artist.isBookable);
};

export const useArtistsByGenre = (genre: string): Artist[] => {
  const artists = useArtists();
  return artists.filter(artist =>
    artist.tags.some(tag => tag.toLowerCase().includes(genre.toLowerCase()))
  );
};

export const useArtistsByPriceRange = (
  minPrice: number,
  maxPrice: number
): Artist[] => {
  const artists = useArtists();
  return artists.filter(
    artist => artist.price >= minPrice && artist.price <= maxPrice
  );
};

export const useArtistsByRating = (minRating: number): Artist[] => {
  const artists = useArtists();
  return artists.filter(artist => artist.rating >= minRating);
};

export const useArtistsByAvailability = (date: string): Artist[] => {
  const artists = useArtists();
  return artists.filter(artist => artist.availability.includes(date));
};

export const useSearchArtists = (query: string): Artist[] => {
  const artists = useArtists();
  const lowercaseQuery = query.toLowerCase();

  return artists.filter(
    artist =>
      artist.name.toLowerCase().includes(lowercaseQuery) ||
      artist.bio?.toLowerCase().includes(lowercaseQuery) ||
      artist.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const useFilteredArtists = (filters: {
  query?: string;
  genre?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  date?: string;
  bookableOnly?: boolean;
}): Artist[] => {
  let filteredArtists = useArtists();

  if (filters.query) {
    const lowercaseQuery = filters.query.toLowerCase();
    filteredArtists = filteredArtists.filter(
      artist =>
        artist.name.toLowerCase().includes(lowercaseQuery) ||
        artist.bio?.toLowerCase().includes(lowercaseQuery) ||
        artist.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  if (filters.genre) {
    filteredArtists = filteredArtists.filter(artist =>
      artist.tags.some(tag =>
        tag.toLowerCase().includes(filters.genre!.toLowerCase())
      )
    );
  }

  if (filters.category) {
    filteredArtists = filteredArtists.filter(artist =>
      artist.categories.some(category =>
        category.toLowerCase().includes(filters.category!.toLowerCase())
      )
    );
  }

  if (filters.minPrice !== undefined) {
    filteredArtists = filteredArtists.filter(
      artist => artist.price >= filters.minPrice!
    );
  }

  if (filters.maxPrice !== undefined) {
    filteredArtists = filteredArtists.filter(
      artist => artist.price <= filters.maxPrice!
    );
  }

  if (filters.minRating !== undefined) {
    filteredArtists = filteredArtists.filter(
      artist => artist.rating >= filters.minRating!
    );
  }

  if (filters.date) {
    filteredArtists = filteredArtists.filter(artist =>
      artist.availability.includes(filters.date!)
    );
  }

  if (filters.bookableOnly) {
    filteredArtists = filteredArtists.filter(artist => artist.isBookable);
  }

  return filteredArtists;
};
