import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Html } from '@react-three/drei';
import CassetteTape from './CassetteTape';
import { CassetteTapePreloader } from './ModelPreloader';

interface Scene3DProps {
  className?: string;
}

const LoadingFallback = () => (
  <Html center>
    <div className='text-orange-500 text-lg font-semibold'>
      Loading 3D Model...
    </div>
  </Html>
);

const Scene3D = ({ className = '' }: Scene3DProps) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 35 }}
        style={{ background: 'transparent' }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 0, 12]} />

        {/* Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[20, 20, 15]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-20, -20, -20]} intensity={0.5} />

        {/* Preloader - loads the model in background */}
        <CassetteTapePreloader />

        {/* 3D Object with Suspense */}
        <Suspense fallback={<LoadingFallback />}>
          <CassetteTape
            position={[0, 1, 0]}
            rotation={[20, 0, 0]}
            scale={100}
          />
        </Suspense>

        {/* Controls */}
        {/* <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          autoRotateSpeed={0.5}
          minDistance={8}
          maxDistance={25}
        /> */}

        {/* Environment */}
        <Environment preset='city' />
      </Canvas>
    </div>
  );
};

export default Scene3D;
