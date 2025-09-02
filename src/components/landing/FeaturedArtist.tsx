import { artists } from "@/constants/artists";

const FeaturedArtist = () => {
  // Get the first 8 artists
  const topArtists = artists.slice(0, 8);

  return (
    <div className="w-full p-6 md:p-8 lg:p-10 border-t border-dashed border-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bold text-white text-4xl md:text-5xl lg:text-7xl mb-8 md:mb-12">
          Featured Artists
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {topArtists.map((artist) => (
            <div key={artist.id} className="relative group">
              <div className="relative mb-4 overflow-hidden">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-full aspect-[9/16] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 text-xs">
                  ⭐ {artist.rating}
                </div>
              </div>

              <div className="p-4 absolute bottom-4 left-0 right-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent">
                <h3 className="text-3xl font-semibold text-white mb-2 truncate font-mondwest">
                  {artist.name}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {artist.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-white/20 text-white px-3 py-1 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedArtist;
