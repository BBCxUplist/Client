import { useEffect, useCallback, useMemo } from 'react';
import { useStore } from '@/stores/store';
import { useGetAllArtists } from './useGetAllArtists';
import { useGetBookableArtists } from './useGetBookableArtists';
import { useSearchArtists } from './useSearchArtists';

interface UseOptimizedArtistsParams {
  isSearching: boolean;
  isBookableFilter: boolean;
  searchQuery: string;
  currentPage: number;
  limit: number;
  selectedGenres: string[];
}

export const useOptimizedArtists = ({
  isSearching,
  isBookableFilter,
  searchQuery,
  currentPage,
  limit,
  selectedGenres,
}: UseOptimizedArtistsParams) => {
  const { setArtistCache, getArtistCache } = useStore();

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

  // API hooks for current page
  const allArtistsQuery = useGetAllArtists({
    page: currentPage,
    limit,
    enabled: !isSearching && !isBookableFilter,
  });

  const bookableArtistsQuery = useGetBookableArtists({
    page: currentPage,
    limit,
    enabled: !isSearching && isBookableFilter,
  });

  const searchArtistsQuery = useSearchArtists({
    query: searchQuery,
    page: currentPage,
    limit,
    enabled: isSearching,
  });

  // Get the active query result
  const activeQuery = isSearching
    ? searchArtistsQuery
    : isBookableFilter
      ? bookableArtistsQuery
      : allArtistsQuery;

  const { data: artistsResponse, isLoading, error } = activeQuery;

  // Check for cached data first
  const cachedData = getArtistCache(createCacheKey(currentPage));

  // Use cached hasMore if available, otherwise use API response
  const hasMore =
    cachedData?.hasMore ?? artistsResponse?.data?.hasMore ?? false;

  // API hooks for page 2 (prefetch when on page 1 and hasMore is true)
  const allArtistsPage2Query = useGetAllArtists({
    page: 2,
    limit,
    enabled: !isSearching && !isBookableFilter && currentPage === 1 && hasMore,
  });

  const bookableArtistsPage2Query = useGetBookableArtists({
    page: 2,
    limit,
    enabled: !isSearching && isBookableFilter && currentPage === 1 && hasMore,
  });

  const searchArtistsPage2Query = useSearchArtists({
    query: searchQuery,
    page: 2,
    limit,
    enabled: isSearching && currentPage === 1 && hasMore,
  });

  // API hooks for next page (prefetch when user navigates and hasMore is true)
  const allArtistsNextQuery = useGetAllArtists({
    page: currentPage + 1,
    limit,
    enabled: !isSearching && !isBookableFilter && currentPage > 1 && hasMore,
  });

  const bookableArtistsNextQuery = useGetBookableArtists({
    page: currentPage + 1,
    limit,
    enabled: !isSearching && isBookableFilter && currentPage > 1 && hasMore,
  });

  const searchArtistsNextQuery = useSearchArtists({
    query: searchQuery,
    page: currentPage + 1,
    limit,
    enabled: isSearching && currentPage > 1 && hasMore,
  });

  // Apply client-side genre filtering
  const filteredArtists = useMemo(() => {
    // Use cached data if available, otherwise use API response
    const artists = cachedData?.artists || artistsResponse?.data?.artists || [];

    if (selectedGenres.length > 0) {
      return artists.filter(artist => {
        const hasMatchingGenre = artist.genres.some(genre =>
          selectedGenres.includes(genre)
        );
        return hasMatchingGenre;
      });
    }

    return artists;
  }, [cachedData?.artists, artistsResponse?.data?.artists, selectedGenres]);

  // Get page 2 query result for prefetching (when on page 1)
  const page2Query = isSearching
    ? searchArtistsPage2Query
    : isBookableFilter
      ? bookableArtistsPage2Query
      : allArtistsPage2Query;

  const { data: page2Response } = page2Query;

  // Get next page query result for prefetching
  const nextPageQuery = isSearching
    ? searchArtistsNextQuery
    : isBookableFilter
      ? bookableArtistsNextQuery
      : allArtistsNextQuery;

  const { data: nextPageResponse } = nextPageQuery;

  // Cache current page results when they change
  useEffect(() => {
    if (filteredArtists.length > 0) {
      const currentPageKey = createCacheKey(currentPage);
      setArtistCache(
        currentPageKey,
        filteredArtists,
        artistsResponse?.data?.hasMore || false
      );
    }
  }, [
    filteredArtists,
    artistsResponse?.data?.hasMore,
    createCacheKey,
    currentPage,
    setArtistCache,
  ]);

  // Cache page 2 results when they load (for prefetching)
  useEffect(() => {
    if (page2Response?.data?.artists && page2Response.data.artists.length > 0) {
      const page2Key = createCacheKey(2);

      // Apply same genre filtering to page 2
      let filteredPage2Artists = page2Response.data.artists;
      if (selectedGenres.length > 0) {
        filteredPage2Artists = page2Response.data.artists.filter(artist => {
          const hasMatchingGenre = artist.genres.some(genre =>
            selectedGenres.includes(genre)
          );
          return hasMatchingGenre;
        });
      }

      setArtistCache(
        page2Key,
        filteredPage2Artists,
        page2Response.data.hasMore || false
      );
    }
  }, [page2Response, createCacheKey, selectedGenres, setArtistCache]);

  // Cache next page results when they load
  useEffect(() => {
    if (
      nextPageResponse?.data?.artists &&
      nextPageResponse.data.artists.length > 0
    ) {
      const nextPageKey = createCacheKey(currentPage + 1);

      // Apply same genre filtering to next page
      let filteredNextPageArtists = nextPageResponse.data.artists;
      if (selectedGenres.length > 0) {
        filteredNextPageArtists = nextPageResponse.data.artists.filter(
          artist => {
            const hasMatchingGenre = artist.genres.some(genre =>
              selectedGenres.includes(genre)
            );
            return hasMatchingGenre;
          }
        );
      }

      setArtistCache(
        nextPageKey,
        filteredNextPageArtists,
        nextPageResponse.data.hasMore || false
      );
    }
  }, [
    nextPageResponse,
    createCacheKey,
    currentPage,
    selectedGenres,
    setArtistCache,
  ]);

  return {
    artists: filteredArtists,
    isLoading: cachedData ? false : isLoading, // Don't show loading if we have cached data
    error,
    hasMore,
  };
};
