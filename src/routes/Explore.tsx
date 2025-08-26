import { useMemo } from "react";
import { artists } from "@/constants/artists";
import TopArtists from "@/components/cards/TopArtists";
import AllArtists from "@/components/cards/AllArtists";

export const Explore = () => {
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

  return (
    <div className="h-full bg-white pb-20">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Top 10 Artists Section */}
        <div className="max-w-6xl mx-auto pt-8">
          <TopArtists artists={topArtists} />
        </div>

        {/* All Artists Section */}
        <div className="max-w-6xl mx-auto">
          <AllArtists />
        </div>
      </div>
    </div>
  );
};
