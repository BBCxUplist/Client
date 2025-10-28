import { useState, useCallback } from 'react';
import { Search, MapPin, DollarSign, Filter, X } from 'lucide-react';
import { useAdvancedSearchArtists } from '@/hooks/generic/useAdvancedSearchArtists';
import { validateSearchParams } from '@/lib/searchUtils';
import type { AllArtistsResponse } from '@/types/api';

interface AdvancedSearchProps {
  onResults: (
    results: AllArtistsResponse | null,
    isLoading: boolean,
    error: any
  ) => void;
  onClear: () => void;
}

const AdvancedSearch = ({ onResults, onClear }: AdvancedSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    location: '',
    genres: [] as string[],
    minPrice: '',
    maxPrice: '',
    isBookable: false,
    isAvailable: false,
    sortBy: 'name' as const,
    sortOrder: 'asc' as const,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Available genres (this could come from an API or constant)
  const availableGenres = [
    'Electronic',
    'Techno',
    'House',
    'Trance',
    'Dubstep',
    'Drum & Bass',
    'Ambient',
    'Chillout',
    'Progressive',
    'Minimal',
    'Deep House',
    'Tech House',
    'Future Bass',
    'Trap',
    'Hip Hop',
    'R&B',
    'Pop',
    'Rock',
    'Jazz',
    'Classical',
    'Folk',
    'Country',
    'Reggae',
  ];

  const searchQuery = useAdvancedSearchArtists({
    query: searchFilters.query,
    location: searchFilters.location,
    genres: searchFilters.genres,
    minPrice: searchFilters.minPrice
      ? parseInt(searchFilters.minPrice)
      : undefined,
    maxPrice: searchFilters.maxPrice
      ? parseInt(searchFilters.maxPrice)
      : undefined,
    isBookable: searchFilters.isBookable,
    isAvailable: searchFilters.isAvailable,
    sortBy: searchFilters.sortBy,
    sortOrder: searchFilters.sortOrder,
    enabled: !!searchFilters.query.trim(),
  });

  // Handle search results
  useCallback(() => {
    onResults(searchQuery.data, searchQuery.isLoading, searchQuery.error);
  }, [searchQuery.data, searchQuery.isLoading, searchQuery.error, onResults]);

  const handleInputChange = (field: string, value: any) => {
    const newFilters = { ...searchFilters, [field]: value };
    setSearchFilters(newFilters);

    // Validate search parameters
    const errors = validateSearchParams({
      query: newFilters.query,
      location: newFilters.location,
      genres: newFilters.genres,
      minPrice: newFilters.minPrice ? parseInt(newFilters.minPrice) : undefined,
      maxPrice: newFilters.maxPrice ? parseInt(newFilters.maxPrice) : undefined,
    });
    setValidationErrors(errors);
  };

  const handleGenreToggle = (genre: string) => {
    const newGenres = searchFilters.genres.includes(genre)
      ? searchFilters.genres.filter(g => g !== genre)
      : [...searchFilters.genres, genre];
    handleInputChange('genres', newGenres);
  };

  const handleClearFilters = () => {
    setSearchFilters({
      query: '',
      location: '',
      genres: [],
      minPrice: '',
      maxPrice: '',
      isBookable: false,
      isAvailable: false,
      sortBy: 'name',
      sortOrder: 'asc',
    });
    setValidationErrors([]);
    onClear();
  };

  const handleSearch = () => {
    if (validationErrors.length === 0 && searchFilters.query.trim()) {
      // Search is automatically triggered by the hook
      setIsOpen(false);
    }
  };

  return (
    <div className='relative'>
      {/* Search Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors'
      >
        <Filter className='w-4 h-4' />
        Advanced Search
      </button>

      {/* Search Panel */}
      {isOpen && (
        <div className='absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-white/20 rounded-lg p-6 z-50 max-h-96 overflow-y-auto'>
          <div className='space-y-4'>
            {/* Search Query */}
            <div>
              <label className='block text-sm font-medium text-white mb-2'>
                Search Query *
              </label>
              <div className='relative'>
                <input
                  type='text'
                  value={searchFilters.query}
                  onChange={e => handleInputChange('query', e.target.value)}
                  placeholder='Search by name, bio, or genres...'
                  className='w-full px-4 py-2 bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-orange-500 focus:outline-none'
                />
                <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50' />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className='block text-sm font-medium text-white mb-2'>
                Location
              </label>
              <div className='relative'>
                <input
                  type='text'
                  value={searchFilters.location}
                  onChange={e => handleInputChange('location', e.target.value)}
                  placeholder='City, State, Country...'
                  className='w-full px-4 py-2 bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-orange-500 focus:outline-none'
                />
                <MapPin className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50' />
              </div>
            </div>

            {/* Genres */}
            <div>
              <label className='block text-sm font-medium text-white mb-2'>
                Genres
              </label>
              <div className='flex flex-wrap gap-2 max-h-32 overflow-y-auto'>
                {availableGenres.map(genre => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      searchFilters.genres.includes(genre)
                        ? 'bg-orange-500 text-black border-orange-500'
                        : 'bg-white/5 text-white border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-white mb-2'>
                  Min Price
                </label>
                <div className='relative'>
                  <input
                    type='number'
                    value={searchFilters.minPrice}
                    onChange={e =>
                      handleInputChange('minPrice', e.target.value)
                    }
                    placeholder='0'
                    min='0'
                    className='w-full px-4 py-2 bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-orange-500 focus:outline-none'
                  />
                  <DollarSign className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50' />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-white mb-2'>
                  Max Price
                </label>
                <div className='relative'>
                  <input
                    type='number'
                    value={searchFilters.maxPrice}
                    onChange={e =>
                      handleInputChange('maxPrice', e.target.value)
                    }
                    placeholder='No limit'
                    min='0'
                    className='w-full px-4 py-2 bg-white/5 border border-white/20 text-white placeholder-white/50 focus:border-orange-500 focus:outline-none'
                  />
                  <DollarSign className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50' />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className='flex gap-4'>
              <label className='flex items-center gap-2 text-white'>
                <input
                  type='checkbox'
                  checked={searchFilters.isBookable}
                  onChange={e =>
                    handleInputChange('isBookable', e.target.checked)
                  }
                  className='w-4 h-4 text-orange-500 bg-white/5 border-white/20 focus:ring-orange-500'
                />
                Bookable Only
              </label>
              <label className='flex items-center gap-2 text-white'>
                <input
                  type='checkbox'
                  checked={searchFilters.isAvailable}
                  onChange={e =>
                    handleInputChange('isAvailable', e.target.checked)
                  }
                  className='w-4 h-4 text-orange-500 bg-white/5 border-white/20 focus:ring-orange-500'
                />
                Available Only
              </label>
            </div>

            {/* Sorting */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-white mb-2'>
                  Sort By
                </label>
                <select
                  value={searchFilters.sortBy}
                  onChange={e => handleInputChange('sortBy', e.target.value)}
                  className='w-full px-4 py-2 bg-white/5 border border-white/20 text-white focus:border-orange-500 focus:outline-none'
                >
                  <option value='name'>Name</option>
                  <option value='price'>Price</option>
                  <option value='createdAt'>Date Added</option>
                  <option value='rating'>Rating</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-white mb-2'>
                  Order
                </label>
                <select
                  value={searchFilters.sortOrder}
                  onChange={e => handleInputChange('sortOrder', e.target.value)}
                  className='w-full px-4 py-2 bg-white/5 border border-white/20 text-white focus:border-orange-500 focus:outline-none'
                >
                  <option value='asc'>Ascending</option>
                  <option value='desc'>Descending</option>
                </select>
              </div>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className='bg-red-500/10 border border-red-500/20 rounded p-3'>
                <h4 className='text-red-400 font-medium mb-2'>
                  Please fix the following errors:
                </h4>
                <ul className='text-red-300 text-sm space-y-1'>
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex gap-3 pt-4'>
              <button
                onClick={handleSearch}
                disabled={
                  validationErrors.length > 0 || !searchFilters.query.trim()
                }
                className='flex-1 bg-orange-500 text-black px-4 py-2 font-semibold hover:bg-orange-600 disabled:bg-white/10 disabled:text-white/50 disabled:cursor-not-allowed transition-colors'
              >
                Search
              </button>
              <button
                onClick={handleClearFilters}
                className='px-4 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors'
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className='px-4 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
