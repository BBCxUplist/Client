/**
 * Utility functions for building search queries and handling search parameters
 */

export interface SearchFilters {
  query: string;
  location?: string;
  genres?: string[];
  minPrice?: number;
  maxPrice?: number;
  isBookable?: boolean;
  isAvailable?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  q: string;
  page: number;
  limit: number;
  location?: string;
  genre?: string[];
  minPrice?: number;
  maxPrice?: number;
  isBookable?: boolean;
  isAvailable?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

/**
 * Builds a search query string with proper encoding and validation
 */
export const buildSearchQuery = (filters: SearchFilters): URLSearchParams => {
  const params = new URLSearchParams({
    q: filters.query.trim(),
    page: '1', // Will be overridden by caller
    limit: '12', // Will be overridden by caller
  });

  // Add location filter if provided and meets minimum length requirement
  if (filters.location && filters.location.trim().length >= 4) {
    params.append('location', filters.location.trim());
  }

  // Add genre filters if provided
  if (filters.genres && filters.genres.length > 0) {
    filters.genres.forEach(genre => {
      if (genre.trim()) {
        params.append('genre', genre.trim());
      }
    });
  }

  // Add price range filters
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    params.append('minPrice', filters.minPrice.toString());
  }
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    params.append('maxPrice', filters.maxPrice.toString());
  }

  // Add boolean filters
  if (filters.isBookable !== undefined) {
    params.append('isBookable', filters.isBookable.toString());
  }
  if (filters.isAvailable !== undefined) {
    params.append('isAvailable', filters.isAvailable.toString());
  }

  // Add sorting parameters
  if (filters.sortBy) {
    params.append('sortBy', filters.sortBy);
  }
  if (filters.sortOrder) {
    params.append('sortOrder', filters.sortOrder);
  }

  return params;
};

/**
 * Validates search parameters
 */
export const validateSearchParams = (filters: SearchFilters): string[] => {
  const errors: string[] = [];

  if (!filters.query || filters.query.trim().length === 0) {
    errors.push('Search query is required');
  }

  if (filters.query && filters.query.trim().length < 2) {
    errors.push('Search query must be at least 2 characters long');
  }

  if (
    filters.location &&
    filters.location.trim().length > 0 &&
    filters.location.trim().length < 4
  ) {
    errors.push('Location filter must be at least 4 characters long');
  }

  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    if (filters.minPrice > filters.maxPrice) {
      errors.push('Minimum price cannot be greater than maximum price');
    }
  }

  if (filters.minPrice !== undefined && filters.minPrice < 0) {
    errors.push('Minimum price cannot be negative');
  }

  if (filters.maxPrice !== undefined && filters.maxPrice < 0) {
    errors.push('Maximum price cannot be negative');
  }

  return errors;
};

/**
 * Sanitizes search query to prevent injection attacks
 */
export const sanitizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes that might break queries
    .substring(0, 100); // Limit length
};

/**
 * Formats location for search (handles common variations)
 */
export const formatLocationForSearch = (location: string): string => {
  return location
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[^\w\s,.-]/g, ''); // Remove special characters except common ones
};

/**
 * Formats genre for search (handles common variations)
 */
export const formatGenreForSearch = (genre: string): string => {
  return genre
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[^\w\s-]/g, ''); // Remove special characters except hyphens
};

/**
 * Creates a search cache key for React Query
 */
export const createSearchCacheKey = (
  baseKey: string,
  filters: SearchFilters,
  page: number,
  limit: number
): string[] => {
  const key = [
    baseKey,
    filters.query,
    page.toString(),
    limit.toString(),
    filters.location || '',
    filters.genres?.sort().join(',') || '',
    filters.minPrice?.toString() || '',
    filters.maxPrice?.toString() || '',
    filters.isBookable?.toString() || '',
    filters.isAvailable?.toString() || '',
    filters.sortBy || '',
    filters.sortOrder || '',
  ];

  return key.filter(Boolean) as string[];
};
