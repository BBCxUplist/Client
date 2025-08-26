import React, { useState, useMemo } from "react";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { artists } from "@/constants/artists";
import { EmptyState } from "@/components/common/EmptyState";
import { StaggerContainer } from "@/components/common/StaggerContainer";
import ArtistCard from "@/components/cards/ArtistCard";
import { genres } from "@/constants/genres";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const AllArtists = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "price">(
    "popular"
  );

  // Filter and sort all artists
  const filteredArtists = useMemo(() => {
    const filtered = artists.filter((artist) => {
      const matchesQuery = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          artist.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          artist.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesGenre = !selectedGenre || artist.tags.includes(selectedGenre);
      
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

  const getSortLabel = () => {
    switch (sortBy) {
      case "rating": return "Rating";
      case "price": return "Price";
      default: return "Popular";
    }
  };

  return (
    <div className="w-full">
      {/* Section Header with Search */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-dm-sans text-neutral-800">
            All <span className="text-orange-500">Artists</span>
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-1">
            Discover and filter through our complete collection of talented performers
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artists..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 sm:py-3 border-2 border-neutral-200 rounded-2xl bg-white text-neutral-800 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-sm sm:text-base"
            />
          </div>
          
          {/* Filters Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 sm:w-64 mt-2">
              {/* Genre Filter */}
              <div className="p-2 sm:p-3">
                <label className="text-sm font-medium text-neutral-700 mb-2 block">
                  Genre
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between text-sm">
                      {selectedGenre || "All Genres"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedGenre("")}>
                      All Genres
                    </DropdownMenuItem>
                    {genres.map((genre) => (
                      <DropdownMenuItem 
                        key={genre.id} 
                        onClick={() => setSelectedGenre(genre.name)}
                      >
                        {genre.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Sort Filter */}
              <div className="p-2 sm:p-3">
                <label className="text-sm font-medium text-neutral-700 mb-2 block">
                  Sort by
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between text-sm">
                      {getSortLabel()}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy("popular")}>
                      Popular
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("rating")}>
                      Rating
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price")}>
                      Price
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="p-2 sm:p-3 border-t">
                  <Button 
                    variant="ghost" 
                    onClick={clearFilters}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 text-sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <span className="text-sm sm:text-base font-medium text-neutral-600 bg-neutral-100 px-3 sm:px-4 py-1 sm:py-2 rounded-2xl">
          {filteredArtists.length} artist
          {filteredArtists.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Results */}
      {filteredArtists.length > 0 ? (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
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
  );
};

export default AllArtists;
