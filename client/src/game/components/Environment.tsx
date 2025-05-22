import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

export default function Environment() {
  const floorRef = useRef<THREE.Mesh>(null);
  
  // Use available textures for environment
  const floorTexture = useTexture("/textures/asphalt.png");
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(10, 10);
  floorTexture.anisotropy = 16;
  
  return (
    <group>
      {/* Ambient light to provide base illumination */}
      <ambientLight intensity={1.2} />
      
      {/* Main directional light for shadows and highlights */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={2.0} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Additional light sources for better visibility */}
      <pointLight position={[-5, 8, -5]} intensity={1.0} color="#ffffff" />
      <pointLight position={[5, 8, 5]} intensity={1.0} color="#f0f8ff" />
      
      {/* Floor/base of the environment */}
      <mesh 
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          map={floorTexture} 
          color="#ffffff" 
          roughness={0.5}
          metalness={0.1}
          emissive="#d0e0ff"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Create a cylindrical "petri dish" boundary */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[20, 20, 1, 64, 1, true]} />
        <meshStandardMaterial 
          color="#c0dfff" 
          transparent={true} 
          opacity={0.3} 
          side={THREE.BackSide}
          emissive="#80b0ff"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Add a hemisphere light to simulate ambient bounced light */}
      <hemisphereLight args={["#ffffff", "#e0f0ff", 1.0]} />
    </group>
  );
}
