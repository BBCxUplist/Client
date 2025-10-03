import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  isMobile: boolean;
  currentFilters?: FilterState;
  availableGenres?: string[];
}

interface FilterState {
  activeTab: ActivityTab;
  genres: string[];
}

enum ActivityTab {
  ALL = 'all',
  BOOKABLE = 'bookable',
}

const Sidebar = ({
  onFilterChange,
  isMobile,
  currentFilters,
  availableGenres,
}: FilterProps) => {
  const [activeTab, setActiveTab] = useState<ActivityTab>(
    currentFilters?.activeTab || ActivityTab.ALL
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    currentFilters?.genres || []
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Use available genres from props, fallback to default list
  const genres =
    availableGenres && availableGenres.length > 0
      ? availableGenres
      : [
          'Hip-Hop',
          'Rap',
          'Bollywood',
          'Producer',
          'Regional Music',
          'Independent Artist',
          'Live Performance',
          'Battle Rap',
          'Storytelling',
          'Pop Rap',
          'Commercial Music',
          'Alternative Rap',
          'Underground',
          'Viral Artist',
          'Street Rap',
          'Music Producer',
          'MTV Hustle',
          'Regional Rap',
          'Fusion',
          'Traditional',
        ];

  const handleTabChange = (tab: ActivityTab) => {
    setActiveTab(tab);
    updateFilters(tab, selectedGenres);
  };

  const handleGenreChange = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(newGenres);
    updateFilters(activeTab, newGenres);
  };

  const updateFilters = (tab: ActivityTab, genres: string[]) => {
    onFilterChange({
      activeTab: tab,
      genres,
    });
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setActiveTab(ActivityTab.ALL);
    updateFilters(ActivityTab.ALL, []);
  };

  const activeFiltersCount = selectedGenres.length;

  // Sync state when currentFilters prop changes
  useEffect(() => {
    if (currentFilters) {
      setActiveTab(currentFilters.activeTab);
      setSelectedGenres(currentFilters.genres);
    }
  }, [currentFilters]);

  if (isMobile) {
    return (
      <div className='w-full'>
        {/* Mobile: Collapsible Filter Header */}
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

        {/* Mobile: Expandable Filter Content */}
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
                {/* Tab Buttons */}
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

                {/* Genres */}
                <div>
                  <h4 className='text-white text-xs font-medium mb-2'>
                    CATEGORIES
                  </h4>
                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto'>
                    {genres.slice(0, 9).map(genre => (
                      <label
                        key={genre}
                        className='flex items-center space-x-1 cursor-pointer text-xs'
                      >
                        <input
                          type='checkbox'
                          checked={selectedGenres.includes(genre)}
                          onChange={() => handleGenreChange(genre)}
                          className='w-3 h-3 text-orange-500 bg-transparent border-orange-500 rounded focus:ring-orange-500'
                        />
                        <span className='text-white truncate'>{genre}</span>
                      </label>
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

  // Desktop version (unchanged from original)
  return (
    <div className='w-[280px] h-fit sticky top-[100px] space-y-6'>
      {/* Tab Buttons */}
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

      {/* Filter Section */}
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

        {/* genres Filter */}
        <div className='mb-6'>
          <h3 className='text-white text-xs font-medium mb-3'>GENRES</h3>
          <div className='space-y-2 max-h-48 overflow-y-auto'>
            {genres.map((category: string) => (
              <label
                key={category}
                className='flex items-center space-x-2 cursor-pointer'
              >
                <input
                  type='checkbox'
                  checked={selectedGenres.includes(category)}
                  onChange={() => handleGenreChange(category)}
                  className='w-3 h-3 text-orange-500 bg-transparent border-orange-500 rounded focus:ring-orange-500'
                />
                <span className='text-white text-xs'>{category}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
