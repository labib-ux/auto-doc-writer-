import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, TorusKnot } from '@react-three/drei';
import * as THREE from 'three';

const ChaosKnot = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
        const t = state.clock.getElapsedTime();
        // Constant chaotic rotation
        meshRef.current.rotation.x = t * 0.2;
        meshRef.current.rotation.y = t * 0.3;
        
        // Mouse interaction for parallax
        const mouseX = state.mouse.x * 0.5;
        const mouseY = state.mouse.y * 0.5;
        meshRef.current.rotation.x += mouseY;
        meshRef.current.rotation.y += mouseX;
    }
  });

  return (
    <Float speed={3} rotationIntensity={1.5} floatIntensity={1.5}>
      <TorusKnot args={[1, 0.3, 128, 16]} ref={meshRef}>
        <MeshDistortMaterial
          color="#5739fb"
          emissive="#2a1a8a"
          roughness={0.1}
          metalness={1}
          distort={0.6}
          speed={3}
          wireframe
        />
      </TorusKnot>
    </Float>
  );
};

export const ProblemScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#5739fb" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />
        <ChaosKnot />
      </Canvas>
    </div>
  );
};