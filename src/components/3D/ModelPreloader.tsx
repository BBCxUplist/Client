import { useGLTF } from '@react-three/drei';

// Preload the cassette tape model
export const useCassetteTapePreloader = () => {
  return useGLTF('/casette_tape_recorder.glb');
};

// Preload function that can be called early in the app lifecycle
export const preloadCassetteTape = () => {
  useGLTF.preload('/casette_tape_recorder.glb');
};

// Component to trigger preloading
export const CassetteTapePreloader = () => {
  useCassetteTapePreloader();
  return null; // This component doesn't render anything
};
