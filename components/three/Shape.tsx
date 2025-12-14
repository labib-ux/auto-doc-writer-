import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, RoundedBox, TorusKnot, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface ShapeProps {
  type: 'box' | 'sphere' | 'torus';
  color: string;
}

export const Shape: React.FC<ShapeProps> = ({ type, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      
      // Interactive mouse parallax (smooth lerp)
      const mouseX = state.mouse.x * 1.5;
      const mouseY = state.mouse.y * 1.5;

      // Rotate towards mouse + continuous idle rotation
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouseY * 0.4 + Math.cos(t / 2) * 0.1, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouseX * 0.4 + t * 0.2, 0.1);
      
      // Scale up on hover
      const targetScale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const materialProps = {
    color: color,
    roughness: 0.2,
    metalness: 0.1,
    emissive: color,
    emissiveIntensity: 0.2,
  };

  if (type === 'box') {
    return (
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
        <RoundedBox 
            ref={meshRef} 
            args={[2, 2, 2]} 
            radius={0.4} 
            smoothness={4}
            onPointerOver={() => setHover(true)} 
            onPointerOut={() => setHover(false)}
        >
           <MeshWobbleMaterial {...materialProps} factor={0.15} speed={1} />
        </RoundedBox>
      </Float>
    );
  }

  if (type === 'torus') {
    return (
      <Float speed={3} rotationIntensity={1} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
        <TorusKnot 
            ref={meshRef} 
            args={[1, 0.35, 128, 32]}
            onPointerOver={() => setHover(true)} 
            onPointerOut={() => setHover(false)}
        >
          <MeshDistortMaterial {...materialProps} distort={0.3} speed={2} />
        </TorusKnot>
      </Float>
    );
  }

  // Sphere / Blob
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
      <Sphere 
        ref={meshRef} 
        args={[1.4, 64, 64]}
        onPointerOver={() => setHover(true)} 
        onPointerOut={() => setHover(false)}
      >
        <MeshDistortMaterial 
          {...materialProps} 
          distort={0.5} 
          speed={2.5} 
        />
      </Sphere>
    </Float>
  );
};
