import { motion } from "framer-motion";

interface ArtistPhotosProps {
  photos: string[];
  artistName: string;
}

export const ArtistPhotos = ({ photos, artistName }: ArtistPhotosProps) => {
  if (photos.length === 0) return null;

  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold font-dm-sans text-neutral-800 mb-3 sm:mb-4">
        Photos
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="aspect-square rounded-xl overflow-hidden shadow-md"
          >
            <img
              src={photo}
              alt={`${artistName} photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
