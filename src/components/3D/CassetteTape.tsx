import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface CassetteTapeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

const CassetteTape: React.FC<CassetteTapeProps> = ({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = 1 
}) => {
  const groupRef = useRef<Group>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { scene, animations } = useGLTF('/casette_tape_recorder.glb', 
    true, // draco
    true, // ktx2
    (error) => {
      console.error('Error loading GLB:', error);
      setError('Failed to load 3D model');
    }
  );
  
  const { actions } = useAnimations(animations, groupRef);

  // Auto-rotate the object
  useFrame(() => {
    if (groupRef.current && !error) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  // Play animations if they exist
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0 && !error) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.play();
        }
      });
    }
  }, [actions, error]);

  if (error) {
    return (
      <mesh position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
};

export default CassetteTape;
