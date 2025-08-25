import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { artists } from "@/constants/artists";
import { EmptyState } from "@/components/common/EmptyState";
import { StaggerContainer } from "@/components/common/StaggerContainer";
import ArtistCard from "@/components/cards/ArtistCard";
import TopArtists from "@/components/cards/TopArtists";
import { genres } from "@/constants/genres";

export const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "price">(
    "popular"
  );
  const [showFilters, setShowFilters] = useState(false);

  // Get top 10 artists (sorted by rating and featured status)
  const topArtists = useMemo(() => {
    return artists
      .sort((a, b) => {
        // First sort by featured status, then by rating
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      })
      .slice(0, 10);
  }, []);

  // Filter and sort all artists
  const filteredArtists = useMemo(() => {
    const filtered = artists.filter((artist) => {
      const matchesQuery =
        artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesGenre =
        !selectedGenre || artist.tags.includes(selectedGenre);

      return matchesQuery && matchesGenre;
    });

    // Sort filtered artists
    switch (sortBy) {
      case "rating":
        return filtered.sort((a, b) => b.rating - a.rating);
      case "price":
        return filtered.sort((a, b) => a.price - b.price);
      case "popular":
      default:
        return filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }
  }, [searchQuery, selectedGenre, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("");
  };

  const hasActiveFilters = searchQuery || selectedGenre;

  return (
    <div className="h-full bg-white pb-20">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Top 10 Artists Section */}
        <div className="max-w-6xl mx-auto pt-8">
          <TopArtists artists={topArtists} />
        </div>

        {/* All Artists Section */}
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold font-dm-sans text-neutral-800">
                All <span className="text-orange-500">Artists</span>
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Discover and filter through our complete collection of talented
                performers
              </p>
            </div>
            <span className="text-sm font-medium text-neutral-600 bg-neutral-100 px-3 py-1 rounded-2xl">
              {filteredArtists.length} artist
              {filteredArtists.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Filter Toggle Button */}
          <div className="mb-6">
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
                className="mb-6"
              >
                <div className="bg-white border-2 border-neutral-200 rounded-3xl p-6 shadow-md">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Search Input */}
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Search
                      </label>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search artists, genres, or descriptions..."
                        className="w-full px-4 py-2 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200"
                      />
                    </div>

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

          {/* Results */}
          {filteredArtists.length > 0 ? (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtists.map((artist) => (
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
    </div>
  );
};
