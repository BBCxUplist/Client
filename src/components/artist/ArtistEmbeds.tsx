import { Play, Youtube, Music } from "lucide-react";

interface ArtistEmbedsProps {
  embeds: {
    youtube?: string;
    spotify?: string;
    soundcloud?: string;
  };
}

export const ArtistEmbeds = ({ embeds }: ArtistEmbedsProps) => {
  if (!embeds || Object.keys(embeds).length === 0) return null;

  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold font-dm-sans text-neutral-800 mb-3 sm:mb-4">
        Music & Videos
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {embeds.youtube && (
          <div>
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <Youtube className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              <span className="font-semibold text-neutral-700 text-sm sm:text-base">
                YouTube
              </span>
            </div>
            <div className="aspect-video bg-neutral-100 rounded-xl flex items-center justify-center shadow-md">
              <Play className="h-8 w-8 sm:h-12 sm:w-12 text-neutral-400" />
            </div>
          </div>
        )}

        {embeds.spotify && (
          <div>
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <Music className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              <span className="font-semibold text-neutral-700 text-sm sm:text-base">
                Spotify
              </span>
            </div>
            <div className="aspect-video bg-neutral-100 rounded-xl flex items-center justify-center shadow-md">
              <Play className="h-8 w-8 sm:h-12 sm:w-12 text-neutral-400" />
            </div>
          </div>
        )}

        {embeds.soundcloud && (
          <div>
            <div className="flex items-center space-x-2 mb-2 sm:mb-3">
              <Music className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
              <span className="font-semibold text-neutral-700 text-sm sm:text-base">
                SoundCloud
              </span>
            </div>
            <div className="aspect-video bg-neutral-100 rounded-xl flex items-center justify-center shadow-md">
              <Play className="h-8 w-8 sm:h-12 sm:w-12 text-neutral-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
