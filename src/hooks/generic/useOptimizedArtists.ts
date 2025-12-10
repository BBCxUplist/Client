import { useMemo, useEffect, useCallback } from 'react';
import { useStore } from '@/stores/store';
import { useGetAllArtists } from './useGetAllArtists';
import { useGetBookableArtists } from './useGetBookableArtists';
import { useSearchByName } from './useSearchByName';
import { useSearchByLocation } from './useSearchByLocation';
import { useSearchByGenre } from './useSearchByGenre';

export enum SearchType {
  NONE = 'none',
  NAME = 'name',
  LOCATION = 'location',
  GENRE = 'genre',
}

interface UseOptimizedArtistsParams {
  searchType: SearchType;
  isBookableFilter: boolean;
  searchQuery: string;
  locationQuery: string;
  genreQuery: string;
  currentPage: number;
  limit: number;
}

export const useOptimizedArtists = ({
  searchType,
  isBookableFilter,
  searchQuery,
  locationQuery,
  genreQuery,
  currentPage,
  limit,
}: UseOptimizedArtistsParams) => {
  const { setArtistCache, getArtistCache } = useStore();

  const createCacheKey = useCallback(
    (page: number) => {
      const bookableSuffix = isBookableFilter ? ':bookable' : '';
      switch (searchType) {
        case SearchType.NAME:
          return `name:${searchQuery}:${page}${bookableSuffix}`;
        case SearchType.LOCATION:
          return `location:${locationQuery}:${page}${bookableSuffix}`;
        case SearchType.GENRE:
          return `genre:${genreQuery}:${page}${bookableSuffix}`;
        case SearchType.NONE:
        default:
          return isBookableFilter ? `bookable:${page}` : `all:${page}`;
      }
    },
    [searchType, searchQuery, locationQuery, genreQuery, isBookableFilter]
  );

  const cachedData = getArtistCache(createCacheKey(currentPage));
  const nextPageCachedData = getArtistCache(createCacheKey(currentPage + 1));
  const shouldPrefetchNext = cachedData?.hasMore && !nextPageCachedData;

  const allArtistsQuery = useGetAllArtists({
    page: currentPage,
    limit,
    enabled: searchType === SearchType.NONE && !isBookableFilter,
  });

  const bookableArtistsQuery = useGetBookableArtists({
    page: currentPage,
    limit,
    enabled: searchType === SearchType.NONE && isBookableFilter,
  });

  const searchByNameQuery = useSearchByName({
    query: searchQuery,
    page: currentPage,
    limit,
    isOnlyBookable: isBookableFilter,
    enabled: searchType === SearchType.NAME && !!searchQuery.trim(),
  });

  const searchByLocationQuery = useSearchByLocation({
    location: locationQuery,
    page: currentPage,
    limit,
    isOnlyBookable: isBookableFilter,
    enabled:
      searchType === SearchType.LOCATION && locationQuery.trim().length >= 4,
  });

  const searchByGenreQuery = useSearchByGenre({
    genre: genreQuery,
    page: currentPage,
    limit,
    isOnlyBookable: isBookableFilter,
    enabled: searchType === SearchType.GENRE && !!genreQuery.trim(),
  });

  const allArtistsNextQuery = useGetAllArtists({
    page: currentPage + 1,
    limit,
    enabled:
      searchType === SearchType.NONE && !isBookableFilter && shouldPrefetchNext,
  });

  const bookableArtistsNextQuery = useGetBookableArtists({
    page: currentPage + 1,
    limit,
    enabled:
      searchType === SearchType.NONE && isBookableFilter && shouldPrefetchNext,
  });

  const searchByNameNextQuery = useSearchByName({
    query: searchQuery,
    page: currentPage + 1,
    limit,
    isOnlyBookable: isBookableFilter,
    enabled:
      searchType === SearchType.NAME &&
      !!searchQuery.trim() &&
      shouldPrefetchNext,
  });

  const searchByLocationNextQuery = useSearchByLocation({
    location: locationQuery,
    page: currentPage + 1,
    limit,
    isOnlyBookable: isBookableFilter,
    enabled:
      searchType === SearchType.LOCATION &&
      locationQuery.trim().length >= 4 &&
      shouldPrefetchNext,
  });

  const searchByGenreNextQuery = useSearchByGenre({
    genre: genreQuery,
    page: currentPage + 1,
    limit,
    isOnlyBookable: isBookableFilter,
    enabled:
      searchType === SearchType.GENRE &&
      !!genreQuery.trim() &&
      shouldPrefetchNext,
  });

  const activeQuery = useMemo(() => {
    switch (searchType) {
      case SearchType.NAME:
        return searchByNameQuery;
      case SearchType.LOCATION:
        return searchByLocationQuery;
      case SearchType.GENRE:
        return searchByGenreQuery;
      case SearchType.NONE:
      default:
        return isBookableFilter ? bookableArtistsQuery : allArtistsQuery;
    }
  }, [
    searchType,
    isBookableFilter,
    searchByNameQuery,
    searchByLocationQuery,
    searchByGenreQuery,
    bookableArtistsQuery,
    allArtistsQuery,
  ]);

  const nextPageQuery = useMemo(() => {
    switch (searchType) {
      case SearchType.NAME:
        return searchByNameNextQuery;
      case SearchType.LOCATION:
        return searchByLocationNextQuery;
      case SearchType.GENRE:
        return searchByGenreNextQuery;
      case SearchType.NONE:
      default:
        return isBookableFilter
          ? bookableArtistsNextQuery
          : allArtistsNextQuery;
    }
  }, [
    searchType,
    isBookableFilter,
    searchByNameNextQuery,
    searchByLocationNextQuery,
    searchByGenreNextQuery,
    bookableArtistsNextQuery,
    allArtistsNextQuery,
  ]);

  const { data: artistsResponse, isLoading, error } = activeQuery;
  const { data: nextPageResponse } = nextPageQuery;

  const artists = useMemo(() => {
    if (cachedData?.artists) {
      return cachedData.artists;
    }
    return artistsResponse?.data?.artists || [];
  }, [cachedData?.artists, artistsResponse?.data?.artists]);

  const hasMore = useMemo(() => {
    if (cachedData?.hasMore !== undefined) {
      return cachedData.hasMore;
    }
    return artistsResponse?.data?.hasMore || false;
  }, [cachedData?.hasMore, artistsResponse?.data?.hasMore]);

  useEffect(() => {
    const rawArtists = artistsResponse?.data?.artists;
    if (rawArtists && rawArtists.length > 0 && !cachedData) {
      const key = createCacheKey(currentPage);
      setArtistCache(key, rawArtists, artistsResponse?.data?.hasMore || false);
    }
  }, [
    artistsResponse,
    currentPage,
    cachedData,
    setArtistCache,
    createCacheKey,
  ]);

  useEffect(() => {
    const nextPageArtists = nextPageResponse?.data?.artists;
    if (nextPageArtists && nextPageArtists.length > 0 && !nextPageCachedData) {
      const key = createCacheKey(currentPage + 1);
      setArtistCache(
        key,
        nextPageArtists,
        nextPageResponse?.data?.hasMore || false
      );
    }
  }, [
    nextPageResponse,
    currentPage,
    nextPageCachedData,
    setArtistCache,
    createCacheKey,
  ]);

  const effectiveLoading = cachedData ? false : isLoading;

  return {
    artists,
    isLoading: effectiveLoading,
    error,
    hasMore,
  };
};
