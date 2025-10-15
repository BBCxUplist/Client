import Navbar from '@/components/landing/Navbar';
import Sidebar from '@/components/explore/Sidebar';
import { useOptimizedArtists } from '@/hooks/generic/useOptimizedArtists';
import { useDebounce } from '@/hooks/useDebounce';
import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Artist } from '@/types/api';

enum ActivityTab {
  ALL = 'all',
  BOOKABLE = 'bookable',
}

interface FilterState {
  activeTab: ActivityTab;
  genres: string[];
}

const Explore = () => {
  const [searchParams] = useSearchParams();
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [showImageDirectly, setShowImageDirectly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    activeTab: ActivityTab.ALL,
    genres: [],
  });

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Determine which hook to use based on current state
  const isSearching = debouncedSearchTerm.trim().length > 0;
  const isBookableFilter = filters.activeTab === ActivityTab.BOOKABLE;

  // Use optimized hook with caching and prefetching
  const { artists, isLoading, error, hasMore } = useOptimizedArtists({
    isSearching,
    isBookableFilter,
    searchQuery: debouncedSearchTerm,
    currentPage,
    limit: 12,
    selectedGenres: filters.genres,
  });

  // Initialize search term from URL params
  useEffect(() => {
    const urlSearchTerm = searchParams.get('search') || '';
    setSearchTerm(urlSearchTerm);
  }, [searchParams]);

  // Get all unique genres from current artists for dynamic genre list
  const availableGenres = useMemo(() => {
    const genreSet = new Set<string>();
    artists.forEach((artist: Artist) => {
      artist.genres.forEach((genre: string) => genreSet.add(genre));
    });
    return Array.from(genreSet).sort();
  }, [artists]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when genre filters change (search and bookable are handled by API)
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.genres, debouncedSearchTerm, filters.activeTab]);

  return (
    <div className='min-h-screen'>
      <Navbar />
      <div className='w-full p-4 md:p-6 lg:p-8'>
        <div className='w-full flex md:items-center justify-between mb-6 md:mb-8 lg:mb-12 flex-col md:flex-row gap-4 md:gap-0'>
          <h2 className='font-bold text-white text-3xl md:text-4xl lg:text-7xl'>
            Explore
          </h2>

          {/* Search Bar */}
          <div className='w-full md:max-w-2xl'>
            <div className='relative'>
              <input
                type='text'
                value={searchTerm}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder='Search artists by name, bio, or genres...'
                className='w-full px-6 py-4 text-lg bg-black/20 border border-white/20 text-white placeholder-white/60 transition-all duration-300 focus:outline-none focus:ring-0 focus:border-orange-500'
              />
              <img
                src='/icons/search.png'
                alt='search'
                className='absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 opacity-60'
              />
            </div>
            {searchTerm && (
              <p className='text-white/60 text-sm mt-2'>
                Searching for: "
                <span className='text-orange-400'>{searchTerm}</span>"
              </p>
            )}
          </div>
        </div>

        {/* Mobile/Tablet: Filters on top */}
        <div className='lg:hidden mb-6'>
          <Sidebar
            onFilterChange={handleFilterChange}
            isMobile={true}
            currentFilters={filters}
            availableGenres={availableGenres}
          />
        </div>

        <div className='flex flex-col lg:flex-row h-full gap-4'>
          {/* Desktop: Sidebar on left */}
          <div className='hidden lg:block'>
            <Sidebar
              onFilterChange={handleFilterChange}
              isMobile={false}
              currentFilters={filters}
              availableGenres={availableGenres}
            />
          </div>

          <div className='w-full'>
            {/* Results count and image toggle */}
            <div className='mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
              <div className='text-white text-sm'>
                {isLoading
                  ? 'Loading artists...'
                  : isSearching
                    ? `Search results for "${debouncedSearchTerm}" - ${artists.length} artists`
                    : isBookableFilter
                      ? `Bookable artists - ${artists.length} artists`
                      : filters.genres.length > 0
                        ? `Filtered by genres - ${artists.length} artists (Page ${currentPage})`
                        : `All artists - ${artists.length} artists`}
              </div>

              {/* Image display toggle - only on lg+ screens */}
              <div className='hidden lg:flex items-center gap-3'>
                <span className='text-white text-xs'>Image Display:</span>
                <button
                  onClick={() => setShowImageDirectly(false)}
                  className={`px-3 py-1 text-xs border transition-all duration-300 ${
                    !showImageDirectly
                      ? 'bg-orange-500 text-black border-black'
                      : 'text-orange-500 border-orange-500 hover:bg-orange-500/10'
                  }`}
                >
                  On Hover
                </button>
                <button
                  onClick={() => setShowImageDirectly(true)}
                  className={`px-3 py-1 text-xs border transition-all duration-300 ${
                    showImageDirectly
                      ? 'bg-orange-500 text-black border-black'
                      : 'text-orange-500 border-orange-500 hover:bg-orange-500/10'
                  }`}
                >
                  Always Show
                </button>
              </div>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className='text-center py-12'>
                <p className='text-white text-lg'>Loading artists...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className='text-center py-12'>
                <p className='text-red-400 text-lg'>Failed to load artists</p>
                <p className='text-white/60 text-sm mt-2'>
                  Please try again later
                </p>
              </div>
            )}

            {/* Artists grid */}
            {!isLoading && !error && (
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 divide-y divide-dashed divide-white'>
                {artists.map((artist: Artist, index: number) => (
                  <Link
                    key={artist.id}
                    onMouseEnter={() => setIsHovered(index)}
                    onMouseLeave={() => setIsHovered(null)}
                    to={`/artist/${artist.username}`}
                    className='mx-2 p-4 [&:nth-child(-n+1)]:border-t sm:[&:nth-child(-n+2)]:border-t lg:[&:nth-child(-n+3)]:border-t border-dashed border-white relative group'
                  >
                    {/* Mobile: Image always visible */}
                    <div className='lg:hidden mb-3'>
                      <img
                        src={artist.avatar || '/images/artistNotFound.jpeg'}
                        alt={artist.displayName}
                        className='w-full aspect-square object-cover rounded'
                        onError={e => {
                          e.currentTarget.src = '/images/artistNotFound.jpeg';
                        }}
                      />
                    </div>

                    {/* Desktop: Always show image (like mobile style) */}
                    {showImageDirectly && (
                      <div className='hidden lg:block mb-4'>
                        <img
                          src={artist.avatar || '/images/artistNotFound.jpeg'}
                          alt={artist.displayName}
                          className='w-full aspect-square object-cover rounded'
                          onError={e => {
                            e.currentTarget.src = '/images/artistNotFound.jpeg';
                          }}
                        />
                      </div>
                    )}

                    {/* Desktop: Hover overlay image (only when not always showing) */}
                    {!showImageDirectly && (
                      <motion.img
                        src={artist.avatar || '/images/artistNotFound.jpeg'}
                        alt={artist.displayName}
                        initial={{
                          opacity: 0,
                          filter: 'blur(8px)',
                        }}
                        animate={{
                          opacity: isHovered === index ? 1 : 0,
                          filter:
                            isHovered === index ? 'blur(0px)' : 'blur(8px)',
                        }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 hidden lg:group-hover:block aspect-square w-4/5 object-cover z-10'
                        onError={e => {
                          e.currentTarget.src = '/images/artistNotFound.jpeg';
                        }}
                      />
                    )}

                    {/* Content section */}
                    <div
                      className={`flex ${
                        showImageDirectly
                          ? 'flex-col sm:flex-row sm:items-center sm:justify-between'
                          : 'flex-col sm:flex-row sm:items-center sm:justify-between'
                      }`}
                    >
                      <div className='flex-grow pr-2 overflow-hidden'>
                        <Link
                          to={`/artist/${artist.username}`}
                          className='block hover:opacity-80 transition-opacity'
                        >
                          <p className='text-white text-2xl sm:text-3xl lg:text-5xl font-bold font-mondwest truncate'>
                            {artist.displayName}
                          </p>
                        </Link>
                        <p className='text-white text-xs font-thin truncate max-w-full'>
                          {artist.genres.length > 0
                            ? artist.genres.join(', ')
                            : 'No genres specified'}
                        </p>
                      </div>
                      <img
                        src='/icons/plus.svg'
                        alt='plus'
                        className='w-5 h-5 sm:w-6 sm:h-6 mt-2 sm:mt-0 self-end sm:self-center'
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* No results message */}
            {!isLoading && !error && artists.length === 0 && (
              <div className='text-center py-12'>
                <p className='text-white text-lg'>
                  No artists found matching your filters
                </p>
                <p className='text-white/60 text-sm mt-2'>
                  Try adjusting your search criteria
                </p>
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && !error && artists.length > 0 && (
              <div className='flex justify-center items-center gap-4 mt-8'>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border transition-all duration-300 ${
                    currentPage === 1
                      ? 'border-white/20 text-white/40 cursor-not-allowed'
                      : 'border-orange-500 text-orange-500 hover:bg-orange-500/10'
                  }`}
                >
                  Previous
                </button>

                <div className='flex items-center gap-2'>
                  <span className='text-white text-sm'>Page {currentPage}</span>
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasMore}
                  className={`px-4 py-2 border transition-all duration-300 ${
                    !hasMore
                      ? 'border-white/20 text-white/40 cursor-not-allowed'
                      : 'border-orange-500 text-orange-500 hover:bg-orange-500/10'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
