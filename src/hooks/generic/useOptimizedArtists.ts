import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { useStore } from '@/stores/store';
import { useGetAllArtists } from './useGetAllArtists';
import { useGetBookableArtists } from './useGetBookableArtists';
import { useSearchArtists } from './useSearchArtists';
import type { Artist } from '@/types/api';

interface UseOptimizedArtistsParams {
  isSearching: boolean;
  isBookableFilter: boolean;
  searchQuery: string;
  currentPage: number;
  limit: number;
  selectedGenres: string[];
  locationSearch?: string;
}

export const useOptimizedArtists = ({
  isSearching,
  isBookableFilter,
  searchQuery,
  currentPage,
  limit,
  selectedGenres,
  locationSearch = '',
}: UseOptimizedArtistsParams) => {
  const { setArtistCache, getArtistCache } = useStore();

  // State for managing recursive fetching when filtering by genres
  const [, setAccumulatedPages] = useState<Map<number, Artist[]>>(new Map());
  const [currentFetchPage, setCurrentFetchPage] = useState(1);
  const [allFetchedArtists, setAllFetchedArtists] = useState<Artist[]>([]);
  const [shouldFetchMore, setShouldFetchMore] = useState(false);
  const [globalHasMore, setGlobalHasMore] = useState(true);
  const isFetchingRef = useRef(false);

  // Create cache key based on current filters
  const createCacheKey = useCallback(
    (page: number) => {
      const baseKey = isSearching
        ? `search:${searchQuery}:${page}`
        : isBookableFilter
          ? `bookable:${page}`
          : `all:${page}`;
      return selectedGenres.length > 0
        ? `${baseKey}:${selectedGenres.sort().join(',')}`
        : baseKey;
    },
    [isSearching, searchQuery, isBookableFilter, selectedGenres]
  );

  // Determine which page to fetch
  const pageToFetch =
    selectedGenres.length > 0 ? currentFetchPage : currentPage;

  // API hooks for fetching artists
  const allArtistsQuery = useGetAllArtists({
    page: pageToFetch,
    limit,
    enabled: !isSearching && !isBookableFilter,
  });

  const bookableArtistsQuery = useGetBookableArtists({
    page: pageToFetch,
    limit,
    enabled: !isSearching && isBookableFilter,
  });

  const searchArtistsQuery = useSearchArtists({
    query: searchQuery,
    page: pageToFetch,
    limit,
    enabled: isSearching,
    location: locationSearch,
    genres: selectedGenres,
  });

  // Prefetch next page for normal pagination (no genre filter)
  const allArtistsNextQuery = useGetAllArtists({
    page: currentPage + 1,
    limit,
    enabled: !isSearching && !isBookableFilter && selectedGenres.length === 0,
  });

  const bookableArtistsNextQuery = useGetBookableArtists({
    page: currentPage + 1,
    limit,
    enabled: !isSearching && isBookableFilter && selectedGenres.length === 0,
  });

  const searchArtistsNextQuery = useSearchArtists({
    query: searchQuery,
    page: currentPage + 1,
    limit,
    enabled: isSearching && selectedGenres.length === 0 && !locationSearch,
    location: locationSearch,
    genres: selectedGenres,
  });

  // Get the active query result
  const activeQuery = isSearching
    ? searchArtistsQuery
    : isBookableFilter
      ? bookableArtistsQuery
      : allArtistsQuery;

  const { data: artistsResponse, isLoading, error } = activeQuery;

  // Get next page data for prefetching
  const nextPageQuery = isSearching
    ? searchArtistsNextQuery
    : isBookableFilter
      ? bookableArtistsNextQuery
      : allArtistsNextQuery;

  const { data: nextPageResponse } = nextPageQuery;

  // Check for cached data
  const cachedData = getArtistCache(createCacheKey(currentPage));

  // Reset everything when filters change or page changes (for non-filtering scenarios)
  useEffect(() => {
    setAccumulatedPages(new Map());
    setCurrentFetchPage(1);
    setAllFetchedArtists([]);
    setShouldFetchMore(false);
    setGlobalHasMore(true);
    isFetchingRef.current = false;
  }, [
    selectedGenres,
    locationSearch,
    isSearching,
    isBookableFilter,
    searchQuery,
    currentPage,
  ]);

  // Handle accumulating artists and triggering recursive fetching
  useEffect(() => {
    if (
      !artistsResponse?.data?.artists ||
      (selectedGenres.length === 0 && !locationSearch)
    ) {
      return;
    }

    const newArtists = artistsResponse.data.artists;
    const hasMore = artistsResponse.data.hasMore || false;

    // Store this page's data
    setAccumulatedPages(prev => {
      const updated = new Map(prev);
      updated.set(currentFetchPage, newArtists);
      return updated;
    });

    // Combine all accumulated artists
    setAllFetchedArtists(prev => {
      const existingIds = new Set(prev.map(a => a.id));
      const newUniqueArtists = newArtists.filter(a => !existingIds.has(a.id));
      return [...prev, ...newUniqueArtists];
    });

    setGlobalHasMore(hasMore);
    isFetchingRef.current = false;

    // After receiving data, check if we need more
    setShouldFetchMore(true);
  }, [
    artistsResponse,
    currentFetchPage,
    selectedGenres.length,
    locationSearch,
  ]);

  // Apply genre and location filtering to all accumulated artists
  const filteredArtists = useMemo(() => {
    let artists = [];

    if (selectedGenres.length === 0 && !locationSearch) {
      // No filters, return regular paginated data
      artists = cachedData?.artists || artistsResponse?.data?.artists || [];
    } else {
      // Use accumulated artists for filtering (if we have any), otherwise use current page data
      artists =
        allFetchedArtists.length > 0
          ? allFetchedArtists
          : artistsResponse?.data?.artists || [];
    }

    // Apply genre filter
    if (selectedGenres.length > 0) {
      artists = artists.filter((artist: Artist) =>
        artist.genres.some(genre => selectedGenres.includes(genre))
      );
    }

    // Apply location filter (case-insensitive)
    if (locationSearch) {
      artists = artists.filter((artist: Artist) =>
        artist.location?.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    return artists;
  }, [
    allFetchedArtists,
    selectedGenres,
    locationSearch,
    cachedData?.artists,
    artistsResponse?.data?.artists,
  ]);

  // Recursive fetching logic: fetch more pages until we have enough filtered results
  useEffect(() => {
    if (
      (selectedGenres.length === 0 && !locationSearch) ||
      !shouldFetchMore ||
      isFetchingRef.current ||
      isLoading
    ) {
      return;
    }

    const currentFilteredCount = filteredArtists.length;

    // Check if we need to fetch more pages
    if (currentFilteredCount < limit && globalHasMore) {
      isFetchingRef.current = true;
      setShouldFetchMore(false);
      setCurrentFetchPage(prev => prev + 1);
    } else {
      setShouldFetchMore(false);
    }
  }, [
    selectedGenres.length,
    locationSearch,
    shouldFetchMore,
    filteredArtists,
    limit,
    globalHasMore,
    isLoading,
  ]);

  // Determine final artists to display
  const displayArtists = useMemo(() => {
    if (selectedGenres.length === 0 && !locationSearch) {
      return cachedData?.artists || artistsResponse?.data?.artists || [];
    }
    // Return only up to the limit
    return filteredArtists.slice(0, limit);
  }, [
    selectedGenres.length,
    locationSearch,
    filteredArtists,
    limit,
    cachedData?.artists,
    artistsResponse?.data?.artists,
  ]);

  // Determine hasMore for pagination
  const hasMore = useMemo(() => {
    if (selectedGenres.length === 0 && !locationSearch) {
      return cachedData?.hasMore || artistsResponse?.data?.hasMore || false;
    }
    // For filtering, hasMore is true if we have more filtered results or can fetch more pages
    return filteredArtists.length > limit || globalHasMore;
  }, [
    selectedGenres.length,
    locationSearch,
    filteredArtists.length,
    limit,
    globalHasMore,
    cachedData?.hasMore,
    artistsResponse?.data?.hasMore,
  ]);

  // Cache current page results (only for non-genre filtered queries)
  useEffect(() => {
    if (selectedGenres.length > 0) return;

    const rawArtists = artistsResponse?.data?.artists || [];
    if (rawArtists.length > 0 && !cachedData) {
      const currentPageKey = createCacheKey(currentPage);
      setArtistCache(
        currentPageKey,
        rawArtists,
        artistsResponse?.data?.hasMore || false
      );
    }
  }, [
    artistsResponse?.data?.artists,
    artistsResponse?.data?.hasMore,
    createCacheKey,
    currentPage,
    setArtistCache,
    cachedData,
    selectedGenres.length,
  ]);

  // Cache next page results for prefetching (only for non-genre filtered queries)
  useEffect(() => {
    if (selectedGenres.length > 0) return;

    if (
      nextPageResponse?.data?.artists &&
      nextPageResponse.data.artists.length > 0
    ) {
      const nextPageKey = createCacheKey(currentPage + 1);
      setArtistCache(
        nextPageKey,
        nextPageResponse.data.artists,
        nextPageResponse.data.hasMore || false
      );
    }
  }, [
    nextPageResponse,
    createCacheKey,
    currentPage,
    setArtistCache,
    selectedGenres.length,
  ]);

  return {
    artists: displayArtists,
    isLoading: cachedData && selectedGenres.length === 0 ? false : isLoading,
    error,
    hasMore,
  };
};
