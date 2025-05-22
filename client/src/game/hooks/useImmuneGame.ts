import { useState, useRef, useEffect, useMemo } from 'react';
import { useImmuneSystem } from '../../lib/stores/useImmuneSystem';
import { getLevel } from '../data/levels';
import { getResponseById } from '../data/immuneResponses';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export default function useImmuneGame() {
  const { 
    gamePhase, 
    currentLevel, 
    currentPathogen,
    selectedResponses,
    activateImmuneResponse,
    validateSelections,
    nextLevel,
    restartGame
  } = useImmuneSystem();
  
  // For 3D scene management
  const [immuneCells, setImmuneCells] = useState<any[]>([]);
  const [activeCellIndex, setActiveCellIndex] = useState<number | null>(null);
  const targetRef = useRef<THREE.Vector3 | null>(null);
  const animationStepRef = useRef(0);
  
  // Get current level data
  const level = useMemo(() => getLevel(currentLevel), [currentLevel]);
  
  // Update target position when pathogen changes
  useEffect(() => {
    if (currentPathogen) {
      targetRef.current = new THREE.Vector3(
        currentPathogen.position.x,
        currentPathogen.position.y,
        currentPathogen.position.z
      );
    } else {
      targetRef.current = null;
    }
  }, [currentPathogen]);
  
  // Handle response activation with visual feedback
  const handleResponseActivation = (responseId: string) => {
    console.log(`Activating immune response: ${responseId}`);
    
    const response = getResponseById(responseId);
    if (!response) return;
    
    // Only add cells for cell-type responses
    if (response.type === 'cell') {
      // Create a new immune cell
      const newCell = {
        id: `${response.id}_${Date.now()}`,
        type: response.id,
        name: response.name,
        position: {
          x: -15 + Math.random() * 30,
          y: 0.5 + Math.random() * 2,
          z: -15 + Math.random() * 30
        },
        active: true
      };
      
      setImmuneCells(prev => [...prev, newCell]);
      setActiveCellIndex(immuneCells.length);
      
      // Activate the immune response in the global state
      activateImmuneResponse(responseId);
      
      // Schedule next animation step
      animationStepRef.current += 1;
    } else {
      // For non-cell responses, just activate them without visual representation
      activateImmuneResponse(responseId);
    }
  };
  
  // Animation loop for immune cells
  useFrame((state, delta) => {
    if (gamePhase !== 'playing' || !targetRef.current) return;
    
    // Handle animations based on active cells
    if (activeCellIndex !== null && immuneCells[activeCellIndex]) {
      const activeCell = immuneCells[activeCellIndex];
      
      // Simulate cell movement toward pathogen
      // (actual movement is handled in the ImmuneCell component)
    }
  });
  
  // Reset game state when level changes
  useEffect(() => {
    setImmuneCells([]);
    setActiveCellIndex(null);
    animationStepRef.current = 0;
  }, [currentLevel]);
  
  return {
    immuneCells,
    level,
    handleResponseActivation,
    targetPosition: targetRef.current,
    gamePhase,
    currentPathogen
  };
}
