import Navbar from "@/components/landing/Navbar";
import Sidebar from "@/components/explore/Sidebar";
import { artists } from "@/constants/artists";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

interface FilterState {
  activeTab: "all" | "bookable";
  categories: string[];
  tags: string[];
  priceRange: [number, number];
  rating: number;
}

const Explore = () => {
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [showImageDirectly, setShowImageDirectly] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    activeTab: "all",
    categories: [],
    tags: [],
    priceRange: [0, 5000000],
    rating: 0,
  });

  // Filter artists based on current filters
  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      // Filter by bookable status
      if (filters.activeTab === "bookable" && !artist.isBookable) {
        return false;
      }

      // Filter by categories
      if (filters.categories.length > 0) {
        const hasMatchingCategory = artist.categories.some((category) =>
          filters.categories.includes(category)
        );
        if (!hasMatchingCategory) return false;
      }

      // Filter by tags
      if (filters.tags.length > 0) {
        const hasMatchingTag = artist.tags.some((tag) =>
          filters.tags.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }

      // Filter by price range
      if (
        artist.price < filters.priceRange[0] ||
        artist.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Filter by rating
      if (artist.rating < filters.rating) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="w-full p-4 md:p-6 lg:p-8">
        <h2 className="font-bold text-white text-3xl md:text-4xl lg:text-7xl mb-6 md:mb-8 lg:mb-12">
          Explore
        </h2>

        {/* Mobile/Tablet: Filters on top */}
        <div className="lg:hidden mb-6">
          <Sidebar onFilterChange={handleFilterChange} isMobile={true} />
        </div>

        <div className="flex flex-col lg:flex-row h-full gap-4">
          {/* Desktop: Sidebar on left */}
          <div className="hidden lg:block">
            <Sidebar onFilterChange={handleFilterChange} isMobile={false} />
          </div>

          <div className="w-full">
            {/* Results count and image toggle */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-white text-sm">
                Showing {filteredArtists.length} of {artists.length} artists
              </div>

              {/* Image display toggle - only on lg+ screens */}
              <div className="hidden lg:flex items-center gap-3">
                <span className="text-white text-xs">Image Display:</span>
                <button
                  onClick={() => setShowImageDirectly(false)}
                  className={`px-3 py-1 text-xs border transition-all duration-300 ${
                    !showImageDirectly
                      ? "bg-orange-500 text-black border-black"
                      : "text-orange-500 border-orange-500 hover:bg-orange-500/10"
                  }`}
                >
                  On Hover
                </button>
                <button
                  onClick={() => setShowImageDirectly(true)}
                  className={`px-3 py-1 text-xs border transition-all duration-300 ${
                    showImageDirectly
                      ? "bg-orange-500 text-black border-black"
                      : "text-orange-500 border-orange-500 hover:bg-orange-500/10"
                  }`}
                >
                  Always Show
                </button>
              </div>
            </div>

            {/* Artists grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 divide-y divide-dashed divide-white">
              {filteredArtists.map((artist, index) => (
                <div
                  key={artist.id}
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                  className="mx-2 p-4 [&:nth-child(-n+1)]:border-t sm:[&:nth-child(-n+2)]:border-t lg:[&:nth-child(-n+3)]:border-t border-dashed border-white relative group"
                >
                  {/* Mobile: Image always visible */}
                  <div className="lg:hidden mb-3">
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-full aspect-square object-cover rounded"
                    />
                  </div>

                  {/* Desktop: Always show image (like mobile style) */}
                  {showImageDirectly && (
                    <div className="hidden lg:block mb-4">
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-full aspect-square object-cover rounded"
                      />
                    </div>
                  )}

                  {/* Desktop: Hover overlay image (only when not always showing) */}
                  {!showImageDirectly && (
                    <motion.img
                      src={artist.avatar}
                      alt={artist.name}
                      initial={{
                        opacity: 0,
                        filter: "blur(8px)",
                      }}
                      animate={{
                        opacity: isHovered === index ? 1 : 0,
                        filter: isHovered === index ? "blur(0px)" : "blur(8px)",
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 hidden lg:group-hover:block aspect-square w-4/5 object-cover z-10"
                    />
                  )}

                  {/* Content section */}
                  <div
                    className={`flex ${
                      showImageDirectly
                        ? "flex-col sm:flex-row sm:items-center sm:justify-between"
                        : "flex-col sm:flex-row sm:items-center sm:justify-between"
                    }`}
                  >
                    <div className="flex-grow pr-2 overflow-hidden">
                      <p className="text-white text-2xl sm:text-3xl lg:text-5xl font-bold font-mondwest truncate">
                        {artist.name}
                      </p>
                      <p className="text-white text-xs font-thin truncate max-w-full">
                        {artist.tags.join(", ")}
                      </p>
                    </div>
                    <img
                      src="/icons/plus.svg"
                      alt="plus"
                      className="w-5 h-5 sm:w-6 sm:h-6 mt-2 sm:mt-0 self-end sm:self-center"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* No results message */}
            {filteredArtists.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white text-lg">
                  No artists found matching your filters
                </p>
                <p className="text-white/60 text-sm mt-2">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
