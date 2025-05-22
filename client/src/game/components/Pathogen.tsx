import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Pathogen } from "../types";

interface PathogenProps {
  pathogen: Pathogen;
  isActive: boolean;
  isDefeated: boolean;
}

export default function PathogenModel({ pathogen, isActive, isDefeated }: PathogenProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { size } = useThree();
  
  // Random movement parameters
  const [movementParams] = useState(() => ({
    speed: 0.01 + Math.random() * 0.01,
    rotationSpeed: 0.005 + Math.random() * 0.01,
    amplitude: 0.5 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
    radius: 5 + Math.random() * 5,
    height: Math.random() * 1.5,
  }));
  
  // Handle hover state
  const onPointerOver = () => setHovered(true);
  const onPointerOut = () => setHovered(false);
  
  // Animation for pathogen
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // If defeated, make the pathogen shrink and disappear
    if (isDefeated) {
      if (groupRef.current.scale.x > 0.01) {
        groupRef.current.scale.x -= 0.01;
        groupRef.current.scale.y -= 0.01;
        groupRef.current.scale.z -= 0.01;
        groupRef.current.position.y += 0.02;
      }
      return;
    }
    
    // Update position for living pathogens
    const time = state.clock.getElapsedTime();
    
    // Circular movement with some vertical bobbing
    groupRef.current.position.x = Math.cos(time * movementParams.speed) * movementParams.radius;
    groupRef.current.position.z = Math.sin(time * movementParams.speed) * movementParams.radius;
    groupRef.current.position.y = Math.sin(time * movementParams.speed * 2) * movementParams.amplitude + movementParams.height;
    
    // Rotation
    groupRef.current.rotation.y += movementParams.rotationSpeed;
    
    // Pulsate if active or hovered
    if (isActive || hovered) {
      const scale = 1 + Math.sin(time * 5) * 0.05;
      groupRef.current.scale.set(scale, scale, scale);
    }
  });
  
  // Set up visual appearance based on pathogen type
  const getPathogenColor = () => {
    switch (pathogen.type) {
      case 'virus':
        return '#ff5252'; // Brighter red
      case 'bacteria':
        return '#9cff57'; // Brighter green
      case 'fungus':
        return '#ea80fc'; // Brighter purple
      case 'parasite':
        return '#ffab40'; // Brighter orange
      default:
        return '#e0e0e0'; // Light gray fallback
    }
  };
  
  const getPathogenGeometry = () => {
    switch (pathogen.type) {
      case 'virus':
        return <dodecahedronGeometry args={[1, 0]} />; // Spiky virus shape
      case 'bacteria':
        return <capsuleGeometry args={[0.5, 1.5, 4, 8]} />; // Rod-shaped bacteria
      case 'fungus':
        return <sphereGeometry args={[1, 12, 12]} />; // Round fungus
      case 'parasite':
        return <torusGeometry args={[0.7, 0.3, 16, 32]} />; // Worm-like parasite
      default:
        return <boxGeometry args={[1, 1, 1]} />; // Fallback
    }
  };
  
  return (
    <group ref={groupRef} position={[pathogen.position.x, pathogen.position.y, pathogen.position.z]}>
      {/* Main pathogen body */}
      <mesh 
        ref={meshRef}
        castShadow
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        {getPathogenGeometry()}
        <meshStandardMaterial 
          color={getPathogenColor()} 
          roughness={0.3} 
          metalness={0.7}
          emissive={getPathogenColor()}
          emissiveIntensity={isActive || hovered ? 0.8 : 0.3}
        />
      </mesh>
      
      {/* Add some decoration to make it more interesting */}
      {pathogen.type === 'virus' && (
        <group>
          {[...Array(6)].map((_, i) => (
            <mesh 
              key={i} 
              position={[
                Math.cos(i * Math.PI / 3) * 1.2,
                Math.sin(i * Math.PI / 3) * 1.2,
                0
              ]}
              scale={0.3}
            >
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial color={getPathogenColor()} />
            </mesh>
          ))}
        </group>
      )}
      
      {/* Text label to show pathogen type */}
      {hovered && (
        <group position={[0, 2, 0]} rotation={[0, 0, 0]}>
          <mesh>
            <boxGeometry args={[pathogen.name.length * 0.6, 1, 0.1]} />
            <meshBasicMaterial color="#000000" opacity={0.7} transparent />
          </mesh>
          {/* We can't use actual text in Three.js here, but the label would be shown in the 2D UI */}
        </group>
      )}
    </group>
  );
}
