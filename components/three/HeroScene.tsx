import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, useCursor, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { DocType } from '../../types';

interface HeroSceneProps {
  viewMode: DocType;
}

const CodeBlock = ({ viewMode }: { viewMode: DocType }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth rotation towards mouse
      const x = (state.mouse.x * Math.PI) / 6;
      const y = (state.mouse.y * Math.PI) / 6;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -y, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x, 0.1);

      // Flip animation based on viewMode
      const targetRotationY = viewMode === DocType.DOC ? Math.PI : 0;
      // We add the mouse rotation to the base flip state
      meshRef.current.rotation.y += targetRotationY;
    }
  });

  return (
    <group ref={meshRef} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
      {/* Front: Code View */}
      <group position={[0, 0, 0.2]}>
        <RoundedBox args={[3.5, 4.5, 0.2]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color="#1e1e1e" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        <Text 
            position={[-1.2, 1.5, 0.12]} 
            fontSize={0.2} 
            color="#5739fb" 
            anchorX="left"
            font="https://fonts.gstatic.com/s/inconsolata/v31/QldNNTpLp9jw-OGI2TKhYlE8.woff"
        >
          function generate() {'{'}
        </Text>
        <Text position={[-1.0, 1.0, 0.12]} fontSize={0.15} color="#e6e6e6" anchorX="left" font="https://fonts.gstatic.com/s/inconsolata/v31/QldNNTpLp9jw-OGI2TKhYlE8.woff">
          const data = await ai.parse();
        </Text>
        <Text position={[-1.0, 0.6, 0.12]} fontSize={0.15} color="#e6e6e6" anchorX="left" font="https://fonts.gstatic.com/s/inconsolata/v31/QldNNTpLp9jw-OGI2TKhYlE8.woff">
          return format(data);
        </Text>
        <Text position={[-1.2, 0.2, 0.12]} fontSize={0.2} color="#5739fb" anchorX="left" font="https://fonts.gstatic.com/s/inconsolata/v31/QldNNTpLp9jw-OGI2TKhYlE8.woff">
          {'}'}
        </Text>
        
        {/* Decorative elements */}
        <mesh position={[0, -1, 0.11]}>
             <boxGeometry args={[2.5, 0.05, 0.05]} />
             <meshBasicMaterial color="#333" />
        </mesh>
      </group>

      {/* Back: Doc View */}
      <group rotation={[0, Math.PI, 0]} position={[0, 0, 0.2]}>
        <RoundedBox args={[3.5, 4.5, 0.2]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color="#ffffff" metalness={0.1} roughness={0.8} />
        </RoundedBox>
        <Text position={[0, 1.5, 0.12]} fontSize={0.3} color="#1F1F1F" anchorX="center" font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhriDcn5wlBACQ.woff">
          Documentation
        </Text>
        <group position={[0, 0.5, 0.12]}>
             <mesh position={[0, 0, 0]}>
                 <planeGeometry args={[2.5, 0.05]} />
                 <meshBasicMaterial color="#ccc" />
             </mesh>
             <mesh position={[0, -0.3, 0]}>
                 <planeGeometry args={[2.5, 0.05]} />
                 <meshBasicMaterial color="#ccc" />
             </mesh>
              <mesh position={[0, -0.6, 0]}>
                 <planeGeometry args={[2.5, 0.05]} />
                 <meshBasicMaterial color="#ccc" />
             </mesh>
             <mesh position={[0, -0.9, 0]}>
                 <planeGeometry args={[1.5, 0.05]} />
                 <meshBasicMaterial color="#5739fb" />
             </mesh>
        </group>
      </group>
    </group>
  );
};

export const HeroScene: React.FC<HeroSceneProps> = ({ viewMode }) => {
  return (
    <div className="w-full h-full absolute inset-0 -z-10">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#5739fb" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <CodeBlock viewMode={viewMode} />
        </Float>
      </Canvas>
    </div>
  );
};