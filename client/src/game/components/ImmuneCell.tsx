import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { ImmuneCell } from "../types";

interface ImmuneCellProps {
  cell: ImmuneCell;
  isActive: boolean;
  targetPosition?: THREE.Vector3;
  onReachTarget?: () => void;
}

export default function ImmuneCellModel({ 
  cell, 
  isActive, 
  targetPosition,
  onReachTarget 
}: ImmuneCellProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Initial position for animation
  const [initialPosition] = useState(() => ({
    x: -15 + Math.random() * 30,
    y: 0.5 + Math.random() * 2,
    z: -15 + Math.random() * 30
  }));
  
  // For movement animation
  const [movementState] = useState({
    speed: 0.02 + Math.random() * 0.03,
    rotationSpeed: 0.01 + Math.random() * 0.02,
    isMovingToTarget: false,
    reachedTarget: false
  });
  
  // Handle hover state
  const onPointerOver = () => setHovered(true);
  const onPointerOut = () => setHovered(false);
  
  // Reset position when a new target is set
  useEffect(() => {
    if (targetPosition && groupRef.current && !movementState.reachedTarget) {
      movementState.isMovingToTarget = true;
    }
  }, [targetPosition]);
  
  // Animation for immune cell
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // If we have a target and should move to it
    if (targetPosition && movementState.isMovingToTarget) {
      // Move towards target
      const direction = new THREE.Vector3()
        .subVectors(targetPosition, groupRef.current.position)
        .normalize();
        
      // Move step by step
      const moveSpeed = 0.1;
      groupRef.current.position.x += direction.x * moveSpeed;
      groupRef.current.position.y += direction.y * moveSpeed;
      groupRef.current.position.z += direction.z * moveSpeed;
      
      // Rotate to face direction of movement
      groupRef.current.lookAt(targetPosition);
      
      // Check if we've reached the target (within a threshold)
      const distanceToTarget = groupRef.current.position.distanceTo(targetPosition);
      if (distanceToTarget < 0.5 && !movementState.reachedTarget) {
        movementState.reachedTarget = true;
        movementState.isMovingToTarget = false;
        if (onReachTarget) onReachTarget();
      }
    } else {
      // Normal wandering behavior
      const radius = 8;
      const height = 1 + Math.sin(time * 0.5) * 0.5;
      
      groupRef.current.position.x = Math.cos(time * movementState.speed) * radius;
      groupRef.current.position.z = Math.sin(time * movementState.speed) * radius;
      groupRef.current.position.y = height;
      
      groupRef.current.rotation.y += movementState.rotationSpeed;
    }
    
    // Pulse effect if active or hovered
    if (isActive || hovered) {
      const pulseScale = 1 + Math.sin(time * 4) * 0.1;
      groupRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    } else {
      // Reset scale if not active or hovered
      groupRef.current.scale.set(1, 1, 1);
    }
    
    // Wiggle animation for more organic movement
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 2) * 0.1;
      meshRef.current.rotation.z = Math.cos(time * 3) * 0.1;
    }
  });
  
  // Determine cell appearance based on type with brighter colors
  const getCellColor = () => {
    switch (cell.type) {
      case 'neutrophil':
        return '#ffffff'; // Pure white
      case 'macrophage':
        return '#64b5f6'; // Bright blue
      case 'dendritic':
        return '#ba68c8'; // Bright purple
      case 'nk':
        return '#4caf50'; // Bright green
      case 'bcell':
        return '#ffee58'; // Bright yellow
      case 'tcell_helper':
      case 'tcell_cytotoxic':
      case 'tcell':
        return '#ffa726'; // Bright orange
      case 'antibody':
        return '#29b6f6'; // Bright sky blue
      case 'complement':
        return '#5c6bc0'; // Bright indigo
      case 'memory_cells':
        return '#ec407a'; // Bright pink
      case 'interferons':
        return '#66bb6a'; // Bright light green
      case 'cytokines':
        return '#ab47bc'; // Bright violet
      default:
        return '#e0e0e0'; // Light gray fallback
    }
  };
  
  const getCellGeometry = () => {
    switch (cell.type) {
      case 'neutrophil':
        return <sphereGeometry args={[0.8, 24, 24]} />; // Round
      case 'macrophage':
        return <sphereGeometry args={[1, 24, 24]} />; // Larger round
      case 'dendritic':
        return <octahedronGeometry args={[0.8, 0]} />; // Star-like
      case 'nk':
        return <boxGeometry args={[0.9, 0.9, 0.9]} />; // Box shaped
      case 'bcell':
        return <icosahedronGeometry args={[0.8, 0]} />; // Spiky
      case 'tcell':
        return <sphereGeometry args={[0.8, 8, 8]} />; // Slightly angular sphere
      case 'antibody':
        return <torusGeometry args={[0.5, 0.2, 8, 16]} />; // Y-shaped (approximated)
      case 'complement':
        return <dodecahedronGeometry args={[0.6, 0]} />; // Complex shape
      default:
        return <sphereGeometry args={[0.8, 16, 16]} />; // Default sphere
    }
  };
  
  return (
    <group 
      ref={groupRef} 
      position={[initialPosition.x, initialPosition.y, initialPosition.z]}
    >
      <mesh 
        ref={meshRef}
        castShadow
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        {getCellGeometry()}
        <meshStandardMaterial 
          color={getCellColor()} 
          roughness={0.3}
          metalness={0.2}
          emissive={getCellColor()}
          emissiveIntensity={isActive || hovered ? 0.8 : 0.3}
        />
      </mesh>
      
      {/* Cell-specific features */}
      {(cell.type === 'macrophage' || cell.type === 'neutrophil') && (
        // Add pseudopods to phagocytes
        [...Array(5)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(i * Math.PI * 2 / 5) * 1.2,
              Math.sin(i * Math.PI * 2 / 5) * 1.2,
              0
            ]}
            scale={[0.2, 0.2, 0.6]}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color={getCellColor()} opacity={0.7} transparent />
          </mesh>
        ))
      )}
      
      {/* Text label on hover */}
      {hovered && (
        <group position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
          <mesh>
            <boxGeometry args={[cell.name.length * 0.6, 1, 0.1]} />
            <meshBasicMaterial color="#000000" opacity={0.7} transparent />
          </mesh>
          {/* Actual text label would be shown in 2D UI */}
        </group>
      )}
    </group>
  );
}
