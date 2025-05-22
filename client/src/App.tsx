import { Canvas } from "@react-three/fiber";
import { KeyboardControls, PointerLockControls } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import "@fontsource/inter";
import Scene from "./game/Scene";
import GameUI from "./game/components/GameUI";
import { useImmuneSystem } from "./lib/stores/useImmuneSystem";
import { useAudio } from "./lib/stores/useAudio";

// Define controls for the game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "interact", keys: ["KeyE"] },
  { name: "zoom", keys: ["KeyZ"] }
];

// Main App component
function App() {
  const [showCanvas, setShowCanvas] = useState(false);
  const { gamePhase } = useImmuneSystem();
  const [isLoading, setIsLoading] = useState(true);
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  // Load audio resources
  useEffect(() => {
    // Load background music
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    setBackgroundMusic(bgMusic);

    // Load hit sound for incorrect selections
    const hit = new Audio("/sounds/hit.mp3");
    hit.volume = 0.4;
    setHitSound(hit);

    // Load success sound for correct selections
    const success = new Audio("/sounds/success.mp3");
    success.volume = 0.6;
    setSuccessSound(success);

    // Mark loading as complete
    setIsLoading(false);
    
    // Show the canvas once everything is loaded
    setShowCanvas(true);
    
    // Clean up audio resources on unmount
    return () => {
      bgMusic.pause();
      hit.pause();
      success.pause();
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // Render loading state if still loading
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black">
        <div className="text-white text-2xl">Loading Immune System Game...</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen">
      {showCanvas && (
        <KeyboardControls map={controls}>
          <Canvas
            shadows
            camera={{
              position: [0, 5, 10],
              fov: 60,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "default"
            }}
          >
            <color attach="background" args={["#e6f0ff"]} />
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
            {/* We're not using PointerLockControls for this game, but keeping it as a reference */}
            {/* <PointerLockControls /> */}
          </Canvas>
          <GameUI />
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
