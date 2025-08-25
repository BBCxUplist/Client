import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Star, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFilteredArtists } from "@/hooks/useArtists";
import { EmptyState } from "@/components/common/EmptyState";
import { StaggerContainer } from "@/components/common/StaggerContainer";
import { genres } from "@/constants/genres";

export const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "price">(
    "popular"
  );
  const [showFilters, setShowFilters] = useState(false);

  const filters = {
    query: searchQuery,
    genre: selectedGenre,
  };

  const filteredArtists = useFilteredArtists(filters);

  const sortedArtists = useMemo(() => {
    const sorted = [...filteredArtists];
    switch (sortBy) {
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "price":
        return sorted.sort((a, b) => a.price - b.price);
      case "popular":
      default:
        return sorted.sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        );
    }
  }, [filteredArtists, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("");
  };

  const hasActiveFilters = searchQuery || selectedGenre;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Filter Toggle Button */}
        <div className="max-w-6xl mx-auto mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-orange-50 text-neutral-700 hover:text-orange-500 rounded-2xl transition-all duration-200 ${
              showFilters ? "bg-orange-50 text-orange-500" : ""
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-6xl mx-auto mb-6"
            >
              <div className="bg-white border-2 border-neutral-200 rounded-3xl p-6 shadow-md">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Genre Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Genre
                    </label>
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="px-4 py-2 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                    >
                      <option value="">All Genres</option>
                      {genres.map((genre) => (
                        <option key={genre.id} value={genre.name}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Sort by
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(
                          e.target.value as "popular" | "rating" | "price"
                        )
                      }
                      className="px-4 py-2 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                    >
                      <option value="popular">Popular</option>
                      <option value="rating">Rating</option>
                      <option value="price">Price</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-orange-500 bg-neutral-50 hover:bg-orange-50 rounded-2xl transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                        <span>Clear</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Header */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-dm-sans text-neutral-800">
              Discover <span className="text-orange-500">Artists</span>
            </h2>
            <span className="text-sm font-medium text-neutral-600 bg-neutral-100 px-3 py-1 rounded-2xl">
              {sortedArtists.length} artist
              {sortedArtists.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-6xl mx-auto">
          {sortedArtists.length > 0 ? (
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {sortedArtists.map((artist) => (
                <SquareArtistCard key={artist.id} artist={artist} />
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
    </div>
  );
};

// Square Artist Card Component
interface Artist {
  id: string;
  name: string;
  slug: string;
  avatar?: string;
  photos?: string[];
  rating: number;
  price: number;
  tags?: string[];
  isBookable?: boolean;
  featured?: boolean;
}

const SquareArtistCard: React.FC<{ artist: Artist }> = ({ artist }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/artist/${artist.slug}`)}
      className="cursor-pointer"
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white border-2 border-neutral-200">
        {/* Artist Image */}
        <img
          src={
            artist.avatar ||
            artist.photos?.[0] ||
            `https://ui-avatars.com/api/?name=${artist.name}&size=200&background=random`
          }
          alt={artist.name}
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-bold text-white text-sm sm:text-base font-dm-sans mb-1 truncate">
            {artist.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-xs font-medium">
                {artist.rating.toFixed(1)}
              </span>
            </div>

            <span className="text-orange-400 text-xs font-bold">
              ${artist.price}
            </span>
          </div>

          {/* Genre Tag */}
          {artist.tags?.[0] && (
            <div className="mt-2">
              <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-xl">
                {artist.tags[0]}
              </span>
            </div>
          )}
        </div>

        {/* Available Badge */}
        {artist.isBookable && (
          <div className="absolute top-2 right-2">
            <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
