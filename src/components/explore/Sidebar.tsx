import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchType } from '@/hooks/generic/useOptimizedArtists';

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  isMobile: boolean;
  currentFilters?: FilterState;
  availableGenres?: string[];
}

export interface FilterState {
  activeTab: ActivityTab;
  searchType: SearchType;
  nameSearch: string;
  locationSearch: string;
  selectedGenre: string;
}

enum ActivityTab {
  ALL = 'all',
  BOOKABLE = 'bookable',
}

const Sidebar = ({
  onFilterChange,
  isMobile,
  currentFilters,
  availableGenres = [],
}: FilterProps) => {
  const [activeTab, setActiveTab] = useState<ActivityTab>(
    currentFilters?.activeTab || ActivityTab.ALL
  );
  const [searchType, setSearchType] = useState<SearchType>(
    currentFilters?.searchType || SearchType.NONE
  );
  const [nameSearch, setNameSearch] = useState<string>(
    currentFilters?.nameSearch || ''
  );
  const [locationSearch, setLocationSearch] = useState<string>(
    currentFilters?.locationSearch || ''
  );
  const [selectedGenre, setSelectedGenre] = useState<string>(
    currentFilters?.selectedGenre || ''
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Debounce location search to avoid too many API calls
  const debouncedLocationSearch = useDebounce(locationSearch, 500);

  // Use availableGenres if provided, otherwise fallback to hardcoded genres
  const genres = useMemo(() => {
    if (availableGenres.length > 0) {
      return availableGenres.sort((a, b) => a.localeCompare(b));
    }

    // Fallback to hardcoded genres
    return [
      'Afrobeats',
      'Afrotech',
      'Drill',
      'DnB',
      'Garage',
      'Grime',
      'Hip Hop',
      'House',
      'Producer',
      'Rap',
      'Traditional',
      'UKG',
      'Jungle',
      'MC',
    ].sort((a, b) => a.localeCompare(b));
  }, [availableGenres]);

  const handleTabChange = (tab: ActivityTab) => {
    setActiveTab(tab);
    updateFilters(
      tab,
      searchType,
      nameSearch,
      debouncedLocationSearch,
      selectedGenre
    );
  };

  const handleLocationSearch = (search: string) => {
    setLocationSearch(search);
    if (search.trim()) {
      setNameSearch('');
      setSelectedGenre('');
      setSearchType(SearchType.LOCATION);
    } else if (!nameSearch.trim() && !selectedGenre) {
      setSearchType(SearchType.NONE);
    }
  };

  const handleGenreSelect = (genre: string) => {
    const newGenre = selectedGenre === genre ? '' : genre;
    setSelectedGenre(newGenre);
    if (newGenre) {
      setNameSearch('');
      setLocationSearch('');
      setSearchType(SearchType.GENRE);
      updateFilters(activeTab, SearchType.GENRE, '', '', newGenre);
    } else {
      setSearchType(SearchType.NONE);
      updateFilters(activeTab, SearchType.NONE, '', '', '');
    }
  };

  useEffect(() => {
    if (debouncedLocationSearch.trim().length >= 4) {
      updateFilters(
        activeTab,
        SearchType.LOCATION,
        '',
        debouncedLocationSearch,
        ''
      );
    } else if (
      searchType === SearchType.LOCATION &&
      !debouncedLocationSearch.trim()
    ) {
      updateFilters(activeTab, SearchType.NONE, '', '', '');
    }
  }, [debouncedLocationSearch]);

  const updateFilters = (
    tab: ActivityTab,
    type: SearchType,
    name: string,
    location: string,
    genre: string
  ) => {
    onFilterChange({
      activeTab: tab,
      searchType: type,
      nameSearch: name,
      locationSearch: location,
      selectedGenre: genre,
    });
  };

  const clearFilters = () => {
    setNameSearch('');
    setLocationSearch('');
    setSelectedGenre('');
    setActiveTab(ActivityTab.ALL);
    setSearchType(SearchType.NONE);
    updateFilters(ActivityTab.ALL, SearchType.NONE, '', '', '');
  };

  const activeFiltersCount =
    (nameSearch ? 1 : 0) +
    (debouncedLocationSearch ? 1 : 0) +
    (selectedGenre ? 1 : 0);

  useEffect(() => {
    if (currentFilters) {
      setActiveTab(currentFilters.activeTab);
      setSearchType(currentFilters.searchType);
      setNameSearch(currentFilters.nameSearch || '');
      setLocationSearch(currentFilters.locationSearch || '');
      setSelectedGenre(currentFilters.selectedGenre || '');
    }
  }, [currentFilters]);

  if (isMobile) {
    return (
      <div className='w-full'>
        <div
          className='border border-dashed border-white p-4 cursor-pointer'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h3 className='text-white font-semibold text-sm'>FILTERS</h3>
              {activeFiltersCount > 0 && (
                <span className='bg-orange-500 text-black text-xs px-2 py-1 rounded-full'>
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <div className='flex items-center gap-2'>
              {activeFiltersCount > 0 && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    clearFilters();
                  }}
                  className='text-orange-500 text-xs hover:text-orange-400 transition-colors'
                >
                  Clear
                </button>
              )}
              <svg
                className={`w-4 h-4 text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='border-l border-r border-b border-dashed border-white overflow-hidden'
            >
              <div className='p-4 space-y-4'>
                <div className='grid grid-cols-2 gap-2'>
                  <button
                    className={`border p-2 text-xs transition-all duration-300 ${
                      activeTab === ActivityTab.ALL
                        ? 'bg-orange-500 text-black border-black'
                        : 'text-orange-500 border-orange-500 hover:bg-orange-500/10'
                    }`}
                    onClick={() => handleTabChange(ActivityTab.ALL)}
                  >
                    ALL ARTISTS
                  </button>
                  <button
                    className={`border p-2 text-xs transition-all duration-300 ${
                      activeTab === ActivityTab.BOOKABLE
                        ? 'bg-orange-500 text-black border-black'
                        : 'text-orange-500 border-orange-500 hover:bg-orange-500/10'
                    }`}
                    onClick={() => handleTabChange(ActivityTab.BOOKABLE)}
                  >
                    BOOKABLE
                  </button>
                </div>

                <div>
                  <h4 className='text-white text-xs font-medium mb-2'>
                    LOCATION
                  </h4>
                  <input
                    type='text'
                    value={locationSearch}
                    onChange={e => handleLocationSearch(e.target.value)}
                    placeholder='Search by location (min 4 chars)...'
                    className={`w-full px-3 py-2 text-xs bg-black/20 border text-white placeholder-white/60 focus:outline-none focus:border-orange-500 ${
                      searchType === SearchType.LOCATION
                        ? 'border-orange-500'
                        : 'border-white/20'
                    }`}
                  />
                  {locationSearch && locationSearch.length < 4 && (
                    <p className='text-orange-400 text-xs mt-1'>
                      Min 4 characters required
                    </p>
                  )}
                </div>

                <div>
                  <h4 className='text-white text-xs font-medium mb-2'>
                    GENRE{' '}
                    {selectedGenre && (
                      <span className='text-orange-400'>
                        (clears other filters)
                      </span>
                    )}
                  </h4>
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto'>
                    {genres.map(genre => (
                      <button
                        key={genre}
                        onClick={() => handleGenreSelect(genre)}
                        className={`px-2 py-1 text-xs border transition-all duration-200 ${
                          selectedGenre === genre
                            ? 'bg-orange-500 text-black border-orange-500'
                            : 'text-white border-white/20 hover:border-orange-500/50'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className='w-[280px] h-fit sticky top-[100px] space-y-6'>
      <div className='space-y-2'>
        <button
          className={`w-full border p-2 text-sm transition-all duration-300 ${
            activeTab === ActivityTab.ALL
              ? 'bg-orange-500 text-black border-black'
              : 'text-orange-500 border-orange-500 hover:bg-orange-500/10'
          }`}
          onClick={() => handleTabChange(ActivityTab.ALL)}
        >
          ALL ARTISTS
        </button>
        <button
          className={`w-full border p-2 text-sm transition-all duration-300 ${
            activeTab === ActivityTab.BOOKABLE
              ? 'bg-orange-500 text-black border-black'
              : 'text-orange-500 border-orange-500 hover:bg-orange-500/10'
          }`}
          onClick={() => handleTabChange(ActivityTab.BOOKABLE)}
        >
          BOOKABLE ARTISTS
        </button>
      </div>

      <div className='border-t border-dashed border-white pt-4'>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-white text-sm font-semibold'>FILTER BY</p>
          <button
            onClick={clearFilters}
            className='text-orange-500 text-xs hover:text-orange-400 transition-colors'
          >
            Clear All
          </button>
        </div>

        {searchType !== SearchType.NONE && (
          <div className='mb-4 p-2 bg-orange-500/10 border border-orange-500/30'>
            <p className='text-orange-400 text-xs'>
              Active:{' '}
              {searchType === SearchType.LOCATION
                ? 'Location search'
                : searchType === SearchType.GENRE
                  ? 'Genre filter'
                  : searchType === SearchType.NAME
                    ? 'Name search'
                    : 'None'}
            </p>
          </div>
        )}

        <div className='mb-6'>
          <h3 className='text-white text-xs font-medium mb-3'>
            LOCATION{' '}
            {locationSearch && (
              <span className='text-orange-400'>(clears other filters)</span>
            )}
          </h3>
          <input
            type='text'
            value={locationSearch}
            onChange={e => handleLocationSearch(e.target.value)}
            placeholder='Search by location (min 4 chars)...'
            className={`w-full px-3 py-2 text-xs bg-black/20 border text-white placeholder-white/60 focus:outline-none focus:border-orange-500 ${
              searchType === SearchType.LOCATION
                ? 'border-orange-500'
                : 'border-white/20'
            }`}
          />
          {locationSearch && locationSearch.length < 4 && (
            <p className='text-orange-400 text-xs mt-1'>
              Min 4 characters required
            </p>
          )}
        </div>

        <div className='mb-6'>
          <h3 className='text-white text-xs font-medium mb-3'>
            GENRE{' '}
            {selectedGenre && (
              <span className='text-orange-400'>(clears other filters)</span>
            )}
          </h3>
          <div className='flex flex-wrap gap-2 max-h-48 overflow-y-auto'>
            {genres.map((genre: string) => (
              <button
                key={genre}
                onClick={() => handleGenreSelect(genre)}
                className={`px-3 py-1 text-xs border transition-all duration-200 ${
                  selectedGenre === genre
                    ? 'bg-orange-500 text-black border-orange-500'
                    : 'text-white border-white/20 hover:border-orange-500/50'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
