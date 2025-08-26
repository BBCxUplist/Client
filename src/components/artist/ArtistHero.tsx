import { Star, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Artist } from "@/constants/types";

interface ArtistHeroProps {
  artist: Artist;
}

export const ArtistHero = ({ artist }: ArtistHeroProps) => {
  const navigate = useNavigate();

  const ratingStars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={cn(
        "h-4 w-4 sm:h-5 sm:w-5",
        i < Math.floor(artist.rating)
          ? "fill-yellow-400 text-yellow-400"
          : "text-gray-300"
      )}
    />
  ));

  return (
    <>
      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-600 hover:text-orange-500 transition-colors duration-200 text-sm sm:text-base"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Hero Section */}
      <div className="mb-6 sm:mb-8">
        {/* Artist Info */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          {/* Artist Avatar */}
          <div className="flex-shrink-0">
            <img
              src={
                artist.avatar ||
                `/images/userNotFound.jpeg`
              }
              alt={artist.name}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Artist Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-dm-sans text-neutral-800 mb-2 sm:mb-3">
                {artist.name}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center space-x-1">
                  {ratingStars}
                  <span className="ml-1 text-sm sm:text-base font-semibold text-neutral-700">
                    {artist.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {artist.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs sm:text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
