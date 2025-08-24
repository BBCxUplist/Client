import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Star, Calendar } from 'lucide-react';
import { useFilteredArtists } from '@/hooks/useArtists';
import { ArtistCard } from '@/components/cards/ArtistCard';
import { EmptyState } from '@/components/common/EmptyState';
import { StaggerContainer } from '@/components/common/StaggerContainer';
import { genres } from '@/constants/genres';
import { cn } from '@/lib/utils';

export const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [minRating, setMinRating] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [bookableOnly, setBookableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price'>('popular');

  const filters = {
    query: searchQuery,
    genre: selectedGenre,
    category: selectedCategory,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    minRating,
    date: selectedDate,
    bookableOnly,
  };

  const filteredArtists = useFilteredArtists(filters);

  const sortedArtists = useMemo(() => {
    const sorted = [...filteredArtists];
    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'price':
        return sorted.sort((a, b) => a.price - b.price);
      case 'popular':
      default:
        return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filteredArtists, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedCategory('');
    setPriceRange({ min: 0, max: 1000 });
    setMinRating(0);
    setSelectedDate('');
    setBookableOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedGenre || selectedCategory || priceRange.min > 0 || priceRange.max < 1000 || minRating > 0 || selectedDate || bookableOnly;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-dm-sans text-neutral-800 mb-2">Explore Artists</h1>
          <p className="text-neutral-600">
            Discover talented musicians for your next event
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-neutral-200 rounded-3xl p-6 mb-8 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search artists, genres, or styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                />
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.name}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
              >
                <option value="">All Categories</option>
                <option value="DJ">DJ</option>
                <option value="Classical">Classical</option>
                <option value="Jazz">Jazz</option>
                <option value="Acoustic">Acoustic</option>
                <option value="Blues">Blues</option>
                <option value="Weddings">Weddings</option>
                <option value="Corporate">Corporate</option>
                <option value="Intimate">Intimate</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                Price Range
              </label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  className="flex-1 px-4 py-3 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                />
                <span className="flex items-center text-neutral-500 font-medium">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  className="flex-1 px-4 py-3 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                Minimum Rating
              </label>
              <div className="flex items-center space-x-2">
                {[0, 1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={cn(
                      'flex items-center space-x-1 px-3 py-2 rounded-2xl text-sm font-medium transition-all duration-200',
                      minRating === rating
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    )}
                  >
                    <Star className="h-3 w-3" />
                    <span>{rating}+</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                Available Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
              />
            </div>

            {/* Bookable Only */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="bookableOnly"
                checked={bookableOnly}
                onChange={(e) => setBookableOnly(e.target.checked)}
                className="w-5 h-5 rounded-xl border-2 border-neutral-200 text-orange-500 focus:ring-orange-200 focus:ring-4"
              />
              <label htmlFor="bookableOnly" className="text-sm font-semibold text-neutral-700">
                Available for booking only
              </label>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <button
                onClick={clearFilters}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-orange-500 bg-neutral-50 hover:bg-orange-50 rounded-2xl transition-all duration-200"
              >
                <X className="h-4 w-4" />
                <span>Clear all filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Sort and Results */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <span className="text-sm font-medium text-neutral-600">
              {sortedArtists.length} artist{sortedArtists.length !== 1 ? 's' : ''} found
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-neutral-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'rating' | 'price')}
              className="px-4 py-2 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 text-sm font-medium focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
            >
              <option value="popular">Popular</option>
              <option value="rating">Rating</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {sortedArtists.length > 0 ? (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </StaggerContainer>
        ) : (
          <EmptyState
            icon={Search}
            title="No artists found"
            description={
              hasActiveFilters
                ? "Try adjusting your filters or search terms to find more artists."
                : "There are currently no artists available. Check back later!"
            }
            action={
              hasActiveFilters
                ? {
                    label: "Clear Filters",
                    onClick: clearFilters,
                    variant: "outline",
                  }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
};
