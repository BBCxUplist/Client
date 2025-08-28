interface ArtistBioProps {
  bio: string;
}

export const ArtistBio = ({ bio }: ArtistBioProps) => {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-bold font-dm-sans text-neutral-800 mb-3 sm:mb-4">
        About
      </h2>
      <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-4xl">
        {bio || "No bio available."}
      </p>
    </div>
  );
};
