import React, { useState, useEffect } from 'react';
import { useImmuneSystem } from '../../lib/stores/useImmuneSystem';
import ResponseSelector from './ResponseSelector';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { AlertCircle, Info, Award, Play, RotateCcw } from 'lucide-react';
import Feedback from './Feedback';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getLevel } from '../data/levels';
import { useAudio } from '@/lib/stores/useAudio';

export default function GameUI() {
  const { 
    gamePhase, 
    currentLevel, 
    score, 
    currentPathogen,
    selectedResponses,
    responseHistory,
    startGame,
    restartGame,
    nextLevel
  } = useImmuneSystem();
  
  const { toggleMute, isMuted } = useAudio();
  const [showInstructions, setShowInstructions] = useState(true);
  
  const level = getLevel(currentLevel);
  
  // Handle UI instructions auto-hide
  useEffect(() => {
    if (gamePhase === 'playing') {
      const timer = setTimeout(() => {
        setShowInstructions(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [gamePhase]);
  
  // Render different UI based on game phase
  if (gamePhase === 'ready' || gamePhase === 'menu') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center z-10 bg-background/80 backdrop-blur-sm">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold mb-4">Immune Defense</CardTitle>
            <CardDescription className="text-xl">
              An educational journey through the human immune system
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">How to Play:</h3>
              <p>In this game, you'll help the immune system fight off various pathogens by selecting the correct sequence of immune responses.</p>
              
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Study each pathogen carefully</li>
                <li>Select the immune cells and substances in the correct order</li>
                <li>Incorrect choices will allow the pathogen to multiply</li>
                <li>Complete all levels to become an immunity expert!</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button 
              size="lg"
              onClick={() => startGame()}
              className="px-8 py-6 text-xl"
            >
              <Play className="mr-2 h-6 w-6" /> Start Game
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (gamePhase === 'ended') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center z-10 bg-background/80 backdrop-blur-sm">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold mb-4">Game Complete!</CardTitle>
            <CardDescription className="text-xl">
              You've mastered the immune system!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 text-center">
            <Award className="h-24 w-24 mx-auto text-primary" />
            <h3 className="text-2xl font-semibold">Final Score: {score}</h3>
            <p className="text-lg">You've successfully defeated all pathogens and learned how the immune system works!</p>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button 
              size="lg"
              onClick={() => restartGame()}
              className="px-8 py-6 text-xl"
            >
              <RotateCcw className="mr-2 h-6 w-6" /> Play Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (gamePhase === 'level_complete') {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center z-10 bg-background/80 backdrop-blur-sm">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold mb-4">Level {currentLevel} Complete!</CardTitle>
            <CardDescription className="text-xl">
              You've successfully defeated the {currentPathogen?.name}!
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">What you learned:</h3>
              <p>{level?.learningOutcome}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Correct sequence:</h4>
              <div className="flex flex-wrap gap-2">
                {level?.correctResponses.map((response, index) => (
                  <span key={index} className="px-3 py-1 bg-primary/20 rounded-full text-sm">
                    {index + 1}. {response}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button 
              size="lg"
              onClick={() => nextLevel()}
              className="px-8 py-6 text-xl"
            >
              {currentLevel < 5 ? 'Next Level' : 'Complete Game'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Playing UI
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top bar with level info and objective below */}
      <div className="absolute top-0 left-0 right-0">
        <div className="bg-background/90 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground font-semibold">
              Level {currentLevel}
            </div>
            <div className="font-medium">
              Score: {score}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => toggleMute()} className="pointer-events-auto">
              {isMuted ? 'Unmute' : 'Mute'} 
            </Button>
          </div>
        </div>
        
        {/* Objective bar as fixed position element */}
        <div className="fixed top-[60px] left-0 right-0 z-20 bg-white py-5 px-6 border-b-2 border-blue-200 shadow-md">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex-1">
              <h3 className="font-bold text-blue-700 flex items-center gap-2 mb-2">
                <Info className="h-5 w-5" /> Current Objective:
              </h3>
              <p className="text-xl font-medium text-gray-800 mb-2">{level?.objective}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowInstructions(!showInstructions)} 
              className="pointer-events-auto whitespace-nowrap ml-4 h-10"
            >
              {showInstructions ? 'Hide Hint' : 'Show Hint'}
            </Button>
          </div>
          
          {/* Hint text that can be toggled */}
          {showInstructions && (
            <div className="mt-3 p-4 bg-blue-50 rounded-md border border-blue-100 max-w-4xl mx-auto">
              <p className="text-sm text-gray-700">{level?.hintText}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Removed the duplicate instructions overlay */}
      
      {/* Pathogen info - positioned differently */}
      {currentPathogen && (
        <div className="fixed top-[160px] right-4 w-80 bg-white p-4 rounded-lg shadow-md border border-blue-200 z-50">
          <h3 className="font-semibold text-red-600 mb-1 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> Pathogen Detected
          </h3>
          <div className="mb-2">
            <span className="font-semibold">{currentPathogen.name}</span> 
            <span className="text-sm text-muted-foreground ml-1">({currentPathogen.type})</span>
          </div>
          <p className="text-sm">{currentPathogen.description}</p>
        </div>
      )}
      
      {/* Feedback area for selection responses */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-full max-w-xl">
        <Feedback />
      </div>
      
      {/* Response selector at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
        <ResponseSelector />
      </div>
    </div>
  );
}
