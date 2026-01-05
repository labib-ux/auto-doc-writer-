import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Sphere, Cylinder, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface WorkflowSceneProps {
  activeStep: number;
}

const positions = [
  new THREE.Vector3(-4, 0, 0),
  new THREE.Vector3(-1.33, 0, 0),
  new THREE.Vector3(1.33, 0, 0),
  new THREE.Vector3(4, 0, 0),
];

// Added NodeProps interface and used React.FC to fix "Property 'key' does not exist" error
interface NodeProps {
  position: THREE.Vector3;
  active: boolean;
  label: string;
  index: number;
}

const Node: React.FC<NodeProps> = ({ position, active, label, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
        // Pulse effect for active nodes
        const t = state.clock.getElapsedTime();
        const scale = active ? 1 + Math.sin(t * 3) * 0.1 : 1;
        meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      {/* Label */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.35}
        color={active ? "#ffffff" : "#666666"}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inconsolata/v31/QldNNTpLp9jw-OGI2TKhYlE8.woff"
      >
        {label}
      </Text>
      
      {/* Node Number */}
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.2}
        color={active ? "#5739fb" : "#333333"}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhriDcn5wlBACQ.woff"
      >
        {`0${index + 1}`}
      </Text>

      {/* Core Sphere */}
      <Float speed={active ? 2 : 0} rotationIntensity={active ? 1 : 0} floatIntensity={0}>
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial 
                color={active ? "#5739fb" : "#2a2a2a"} 
                emissive={active ? "#5739fb" : "#000000"}
                emissiveIntensity={active ? 2 : 0}
                roughness={0.2}
                metalness={0.8}
            />
        </mesh>
      </Float>

      {/* Outer Glass Shell (Static) */}
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshPhysicalMaterial 
            color={active ? "#a0a0ff" : "#ffffff"}
            transmission={0.9}
            opacity={0.5}
            transparent
            roughness={0.1}
            ior={1.5}
            thickness={0.5}
        />
      </mesh>
    </group>
  );
};

const ConnectionTube = () => {
    return (
        <group rotation={[0, 0, Math.PI / 2]}>
            <mesh>
                <cylinderGeometry args={[0.2, 0.2, 9, 32, 1, true]} />
                <meshPhysicalMaterial 
                    color="#ffffff"
                    transmission={0.95}
                    opacity={0.3}
                    transparent
                    roughness={0.1}
                    ior={1.5}
                    side={THREE.DoubleSide}
                />
            </mesh>
            {/* Inner "wire" */}
            <mesh>
                 <cylinderGeometry args={[0.02, 0.02, 9, 16]} />
                 <meshBasicMaterial color="#333" />
            </mesh>
        </group>
    )
}

const DataPacket = ({ activeStep }: { activeStep: number }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const targetPos = useMemo(() => new THREE.Vector3(), []);
    
    useFrame((state) => {
        if (meshRef.current) {
            // Calculate target position based on activeStep (1-indexed)
            // We want the packet to be at the active node
            const targetIndex = Math.min(Math.max(activeStep - 1, 0), positions.length - 1);
            targetPos.copy(positions[targetIndex]);
            
            // Lerp towards target
            meshRef.current.position.lerp(targetPos, 0.05);

            // Rotate for visual interest
            meshRef.current.rotation.x += 0.1;
            meshRef.current.rotation.z += 0.1;
        }
    });

    return (
        <mesh ref={meshRef} position={[-4, 0, 0]}>
            <octahedronGeometry args={[0.25, 0]} />
            <meshBasicMaterial color="#00ffcc" />
            <pointLight distance={3} intensity={5} color="#00ffcc" />
        </mesh>
    );
}

export const WorkflowScene: React.FC<WorkflowSceneProps> = ({ activeStep }) => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 40 }}>
        <color attach="background" args={['#1F1F1F']} /> {/* Match bg-dark */}
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={1} color="#5739fb" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="white" />

        <group position={[0, 0.5, 0]}>
            <ConnectionTube />
            
            {positions.map((pos, idx) => (
                <Node 
                    key={idx} 
                    index={idx}
                    position={pos} 
                    active={activeStep >= idx + 1} 
                    label={['Push', 'Analyze', 'Generate', 'Review'][idx]} 
                />
            ))}

            <DataPacket activeStep={activeStep} />
        </group>
        
        {/* Subtle Environment Particles */}
         <Float speed={1} rotationIntensity={1} floatIntensity={1}>
             <mesh position={[3, 2, -2]}>
                 <boxGeometry args={[0.5, 0.5, 0.5]} />
                 <MeshDistortMaterial color="#333" speed={2} />
             </mesh>
         </Float>

      </Canvas>
    </div>
  );
};