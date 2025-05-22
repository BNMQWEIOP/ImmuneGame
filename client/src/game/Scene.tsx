import { Suspense, useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import Environment from "./components/Environment";
import PathogenModel from "./components/Pathogen";
import ImmuneCellModel from "./components/ImmuneCell";
import { useImmuneSystem } from "../lib/stores/useImmuneSystem";
import useImmuneGame from "./hooks/useImmuneGame";

export default function Scene() {
  const { camera } = useThree();
  const { 
    gamePhase, 
    currentPathogen, 
    currentLevel,
    selectedResponses,
    correctResponses,
    defeatedPathogens
  } = useImmuneSystem();
  
  const { 
    immuneCells,
    targetPosition
  } = useImmuneGame();
  
  // Set up camera position
  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  // Determine if current pathogen is defeated
  const isPathogenDefeated = currentPathogen 
    ? defeatedPathogens.includes(currentPathogen.id)
    : false;
  
  return (
    <>
      {/* Camera controls */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={5}
        maxDistance={20}
      />
      
      {/* Environment (lighting, floor, etc.) */}
      <Environment />
      
      {/* Pathogen (if in a level) */}
      {currentPathogen && gamePhase !== 'menu' && (
        <PathogenModel 
          pathogen={currentPathogen}
          isActive={gamePhase === 'playing'} 
          isDefeated={isPathogenDefeated}
        />
      )}
      
      {/* Immune cells */}
      <Suspense fallback={null}>
        {immuneCells.map((cell, index) => (
          <ImmuneCellModel
            key={cell.id}
            cell={cell}
            isActive={selectedResponses.includes(cell.type)}
            targetPosition={targetPosition}
          />
        ))}
        
        {/* Add automatically activated cells based on correct responses */}
        {correctResponses.map((responseId, index) => {
          // Only render cell-type responses that haven't been manually added
          const isAlreadyAdded = immuneCells.some(cell => cell.type === responseId);
          if (isAlreadyAdded) return null;
          
          // Create a cell for correct responses
          const cell = {
            id: `auto_${responseId}_${index}`,
            name: responseId,
            type: responseId,
            position: {
              x: -10 + Math.random() * 20,
              y: 1,
              z: -10 + Math.random() * 20
            },
            active: true
          };
          
          return (
            <ImmuneCellModel
              key={cell.id}
              cell={cell}
              isActive={true}
              targetPosition={targetPosition}
            />
          );
        })}
      </Suspense>
    </>
  );
}
