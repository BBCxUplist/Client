import { motion } from "framer-motion";
import { useState } from "react";
import type { Artist } from "@/types";

interface MusicTabProps {
  artist: Artist;
}

const MusicTab = ({ artist }: MusicTabProps) => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<
    "youtube" | "soundcloud" | "spotify"
  >("youtube");

  const handlePlayTrack = (url: string) => {
    if (currentTrack === url) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(url);
      setIsPlaying(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 md:space-y-8"
    >
      <h3 className="text-2xl md:text-3xl font-semibold text-orange-500 mb-6 font-mondwest">
        Music & Tracks
      </h3>

      {/* Platform Toggle */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["youtube", "soundcloud", "spotify"].map((platform) => {
          const hasEmbed = artist?.embeds?.[platform as keyof typeof artist.embeds];
          if (!hasEmbed) return null;
          
          return (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform as "youtube" | "soundcloud" | "spotify")}
              className={`px-4 py-2 text-sm font-semibold transition-all duration-300 border ${
                selectedPlatform === platform
                  ? "bg-orange-500 text-black border-orange-500"
                  : "text-white border-white/30 hover:border-white/60"
              }`}
            >
              {platform.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Current Player */}
      {currentTrack && (
        <div className="bg-white/5 p-4 border border-white/10 mb-6">
          <div className="aspect-video max-w-2xl">
            <iframe
              src={currentTrack}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Track List */}
      <div className="grid gap-4">

        {/* Original Artist Tracks */}
        {artist?.embeds?.[selectedPlatform] ? (
          <div
            className="bg-white/5 p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
            onClick={() => handlePlayTrack(artist.embeds![selectedPlatform]!)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/20 flex items-center justify-center">
                  <span className="text-orange-500 text-xl">▶</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm md:text-base">
                    {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} Track
                  </p>
                  <p className="text-white/60 text-xs md:text-sm capitalize">
                    {selectedPlatform} • {artist?.name}
                  </p>
                </div>
              </div>
              <img
                src="/icons/plus.svg"
                alt="play"
                className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-white/60">
            <p>No tracks available on {selectedPlatform}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MusicTab;
