interface SocialLinksProps {
  socials: {
    spotify?: string;
    twitter?: string;
    youtube?: string;
    instagram?: string;
    soundcloud?: string;
  };
  className?: string;
}

const SocialLinks = ({ socials, className = '' }: SocialLinksProps) => {
  const getSocialUrl = (platform: string, username: string) => {
    const baseUrls: Record<string, string> = {
      instagram: 'https://instagram.com/',
      twitter: 'https://twitter.com/',
      youtube: 'https://youtube.com/@',
      spotify: 'https://open.spotify.com/artist/',
      soundcloud: 'https://soundcloud.com/',
    };
    return `${baseUrls[platform]}${username}`;
  };

  const getIconPath = (platform: string) => {
    return `/icons/embeds/${platform}.png`;
  };

  if (!socials) return null;

  return (
    <div className={`mb-6 ${className}`}>
      <h3 className='text-white/70 text-sm mb-3 font-semibold'>Follow</h3>
      <div className='flex gap-3'>
        {Object.entries(socials).map(([platform, username]) => {
          if (!username) return null;

          return (
            <a
              key={platform}
              href={getSocialUrl(platform, username)}
              target='_blank'
              rel='noopener noreferrer'
              className='group relative'
            >
              <div className='w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 group-hover:scale-110'>
                <img
                  src={getIconPath(platform)}
                  alt={platform}
                  className='w-5 h-5'
                />
              </div>
              <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap'>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinks;
