import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  description?: string;
}

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard = ({ artist }: ArtistCardProps) => {
  const navigate = useNavigate();

  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle message functionality
    console.log("Message artist:", artist.name);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/artist/${artist.slug}`)}
      className="cursor-pointer"
    >
      <div className="w-full p-2 border border-neutral-200 rounded-3xl inset-shadow-sm shadow-sm shadow-orange-600/5 bg-white hover:shadow-lg transition-all duration-300">
        {/* Artist Image - Large Square */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-sm">
            <img
              src={
                artist.avatar ||
                artist.photos?.[0] ||
                "/images/userNotFound.jpeg"
              }
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Rating Badge */}
          {/* <div className="absolute top-2 right-2 flex items-center space-x-1 px-2 py-1 bg-white rounded-xl shadow-sm border border-neutral-200">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-neutral-700">
              {artist.rating.toFixed(1)}
            </span>
          </div> */}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 p-2">
          {/* Name */}
          <h3 className="text-lg font-bold font-dm-sans text-neutral-800 truncate">
            {artist.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-neutral-600 line-clamp-2">
            {artist.description ||
              `Professional ${artist.tags?.[0] || "musician"} with ${
                artist.rating
              } star rating. Available for bookings and events.`}
          </p>

          {/* Genre Tag and Message Button */}
          {artist.tags?.[0] && (
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-xl">
                {artist.tags[0]}
              </span>

              {/* Message Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMessageClick}
                className="flex items-center space-x-1 px-3 py-1 bg-neutral-100 hover:bg-orange-100 text-neutral-600 hover:text-orange-600 rounded-xl transition-all duration-200"
              >
                <MessageCircle className="h-3 w-3" />
                <span className="text-xs font-medium">Message</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ArtistCard;
