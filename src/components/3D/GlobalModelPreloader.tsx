import { useEffect } from 'react';
import { preloadCassetteTape } from './ModelPreloader';

/**
 * Global preloader component that preloads 3D models early in the app lifecycle
 * This should be placed high in the component tree to start loading models as soon as possible
 */
const GlobalModelPreloader = () => {
  useEffect(() => {
    // Preload the cassette tape model when the component mounts
    preloadCassetteTape();
  }, []);

  // This component doesn't render anything
  return null;
};

export default GlobalModelPreloader;
