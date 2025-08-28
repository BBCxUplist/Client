import { Instagram, Youtube, Music, ExternalLink } from "lucide-react";

interface ArtistSocialsProps {
  socials: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
  };
}

export const ArtistSocials = ({ socials }: ArtistSocialsProps) => {
  if (!socials || Object.keys(socials).length === 0) return null;

  return (
    <div className="mb-4 sm:mb-6">
      <h3 className="text-base sm:text-lg font-bold font-dm-sans text-neutral-800 mb-3 sm:mb-4">
        Follow
      </h3>
      <div className="space-y-2 sm:space-y-3">
        {socials.instagram && (
          <a
            href={socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-neutral-600 hover:text-orange-500 transition-colors duration-200 text-sm sm:text-base font-medium"
          >
            <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Instagram</span>
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
          </a>
        )}
        {socials.youtube && (
          <a
            href={socials.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-neutral-600 hover:text-orange-500 transition-colors duration-200 text-sm sm:text-base font-medium"
          >
            <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>YouTube</span>
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
          </a>
        )}
        {socials.spotify && (
          <a
            href={socials.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-neutral-600 hover:text-orange-500 transition-colors duration-200 text-sm sm:text-base font-medium"
          >
            <Music className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Spotify</span>
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-auto" />
          </a>
        )}
      </div>
    </div>
  );
};
