interface EmbedPlayerProps {
  url: string;
  platform: 'youtube' | 'spotify' | 'soundcloud';
}

const EmbedPlayer = ({ url, platform }: EmbedPlayerProps) => {
  const getEmbedUrl = (originalUrl: string, platform: string) => {
    switch (platform) {
      case 'youtube':
        // Convert YouTube watch URL to embed URL
        if (originalUrl.includes('youtube.com/watch?v=')) {
          const videoId = originalUrl.split('v=')[1]?.split('&')[0];
          return `https://www.youtube.com/embed/${videoId}?rel=0&cc_load_policy=1`;
        } else if (originalUrl.includes('youtu.be/')) {
          const videoId = originalUrl.split('youtu.be/')[1]?.split('?')[0];
          return `https://www.youtube.com/embed/${videoId}?rel=0&cc_load_policy=1`;
        }
        return originalUrl;

      case 'spotify':
        // Convert Spotify track/album URL to embed URL
        if (originalUrl.includes('open.spotify.com/track/')) {
          const trackId = originalUrl.split('track/')[1]?.split('?')[0];
          return `https://open.spotify.com/embed/track/${trackId}?utm_source=oembed`;
        } else if (originalUrl.includes('open.spotify.com/album/')) {
          const albumId = originalUrl.split('album/')[1]?.split('?')[0];
          return `https://open.spotify.com/embed/album/${albumId}?utm_source=oembed`;
        } else if (originalUrl.includes('open.spotify.com/playlist/')) {
          const playlistId = originalUrl.split('playlist/')[1]?.split('?')[0];
          return `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=oembed`;
        }
        return originalUrl;

      case 'soundcloud':
        // Convert SoundCloud URL to embed URL
        if (originalUrl.includes('soundcloud.com/')) {
          return `https://w.soundcloud.com/player/?visual=false&url=${encodeURIComponent(originalUrl)}&show_artwork=true&show_comments=false`;
        }
        return originalUrl;

      default:
        return originalUrl;
    }
  };

  const getContainerStyle = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return {
          left: 0,
          width: '100%',
          height: 0,
          position: 'relative' as const,
          paddingBottom: '56.25%', // 16:9 aspect ratio
        };
      case 'spotify':
        return {
          left: 0,
          width: '100%',
          height: '152px',
          position: 'relative' as const,
        };
      case 'soundcloud':
        return {
          left: 0,
          width: '100%',
          height: '166px',
          position: 'relative' as const,
        };
      default:
        return {
          left: 0,
          width: '100%',
          height: '200px',
          position: 'relative' as const,
        };
    }
  };

  const getIframeStyle = () => {
    return {
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      position: 'absolute' as const,
      border: 0,
    };
  };

  const getIframeProps = (platform: string) => {
    const baseProps = {
      style: getIframeStyle(),
      allowFullScreen: true,
    };

    switch (platform) {
      case 'youtube':
        return {
          ...baseProps,
          allow:
            'accelerometer *; clipboard-write *; encrypted-media *; gyroscope *; picture-in-picture *; web-share *;',
          scrolling: 'no' as const,
        };
      case 'spotify':
        return {
          ...baseProps,
          allow:
            'clipboard-write *; encrypted-media *; fullscreen *; picture-in-picture *;',
        };
      case 'soundcloud':
        return {
          ...baseProps,
        };
      default:
        return baseProps;
    }
  };

  const embedUrl = getEmbedUrl(url, platform);

  return (
    <div style={getContainerStyle(platform)}>
      <iframe src={embedUrl} {...getIframeProps(platform)} />
    </div>
  );
};

export default EmbedPlayer;
