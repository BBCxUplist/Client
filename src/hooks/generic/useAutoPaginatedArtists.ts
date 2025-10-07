import { useMemo } from 'react';
import { useGetAllArtists } from '../generic/useGetAllArtists';
import { useGetBookableArtists } from '../generic/useGetBookableArtists';
import { useSearchArtists } from '../generic/useSearchArtists';

interface UseAutoPaginatedArtistsParams {
  isSearching: boolean;
  isBookableFilter: boolean;
  searchQuery: string;
  currentPage: number;
  limit: number;
  selectedGenres: string[];
}

export const useAutoPaginatedArtists = ({
  isSearching,
  isBookableFilter,
  searchQuery,
  currentPage,
  limit,
  selectedGenres,
}: UseAutoPaginatedArtistsParams) => {
  // Conditionally call only the needed API using enabled option
  const allArtistsQuery = useGetAllArtists({
    page: currentPage,
    limit,
    enabled: !isSearching && !isBookableFilter, // Only enable when not searching and not bookable
  });

  const bookableArtistsQuery = useGetBookableArtists({
    page: currentPage,
    limit,
    enabled: !isSearching && isBookableFilter, // Only enable when not searching and bookable is selected
  });

  const searchArtistsQuery = useSearchArtists({
    query: searchQuery,
    page: currentPage,
    limit,
    enabled: isSearching, // Only enable when searching
  });

  // Select the appropriate query result based on current state
  const activeQuery = isSearching
    ? searchArtistsQuery
    : isBookableFilter
      ? bookableArtistsQuery
      : allArtistsQuery;

  const { data: artistsResponse, isLoading, error } = activeQuery;

  // Apply client-side genre filtering
  const filteredArtists = useMemo(() => {
    if (!artistsResponse?.data?.artists) return [];

    if (selectedGenres.length > 0) {
      return artistsResponse.data.artists.filter(artist => {
        const hasMatchingGenre = artist.genres.some(genre =>
          selectedGenres.includes(genre)
        );
        return hasMatchingGenre;
      });
    }

    return artistsResponse.data.artists;
  }, [artistsResponse?.data?.artists, selectedGenres]);

  return {
    artists: filteredArtists,
    isLoading,
    error,
    hasMore: artistsResponse?.data?.hasMore || false,
  };
};
