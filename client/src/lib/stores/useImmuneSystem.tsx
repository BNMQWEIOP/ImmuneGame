import { create } from "zustand";
import { getLevel, getPathogenForLevel } from "../../game/data/levels";
import { getResponseById } from "../../game/data/immuneResponses";
import { 
  GamePhase, 
  Pathogen, 
  ResponseStatus, 
  ResponseFeedback 
} from "../../game/types";

interface ImmuneSystemState {
  // Game state
  gamePhase: GamePhase;
  currentLevel: number;
  score: number;
  
  // Level data
  currentPathogen: Pathogen | null;
  selectedResponses: string[];
  correctResponses: string[];
  responseStatus: Record<string, ResponseStatus>;
  responseHistory: ResponseFeedback[];
  defeatedPathogens: string[];
  
  // Actions
  startGame: () => void;
  restartGame: () => void;
  nextLevel: () => void;
  addResponse: (responseId: string) => void;
  removeResponse: (responseId: string) => void;
  validateSelections: () => void;
  activateImmuneResponse: (responseId: string) => void;
  getResponseStatus: (responseId: string) => ResponseStatus;
}

export const useImmuneSystem = create<ImmuneSystemState>((set, get) => ({
  // Initial state
  gamePhase: 'menu',
  currentLevel: 1,
  score: 0,
  currentPathogen: null,
  selectedResponses: [],
  correctResponses: [],
  responseStatus: {},
  responseHistory: [],
  defeatedPathogens: [],
  
  // Start a new game
  startGame: () => {
    const level = getLevel(1);
    const pathogen = level?.pathogen || null;
    
    set({
      gamePhase: 'playing',
      currentLevel: 1,
      score: 0,
      currentPathogen: pathogen,
      selectedResponses: [],
      correctResponses: [],
      responseStatus: {},
      responseHistory: [],
      defeatedPathogens: []
    });
    
    console.log("Game started with level 1");
  },
  
  // Restart the game
  restartGame: () => {
    const level = getLevel(1);
    const pathogen = level?.pathogen || null;
    
    set({
      gamePhase: 'playing',
      currentLevel: 1,
      score: 0,
      currentPathogen: pathogen,
      selectedResponses: [],
      correctResponses: [],
      responseStatus: {},
      responseHistory: [],
      defeatedPathogens: []
    });
    
    console.log("Game restarted");
  },
  
  // Advance to the next level
  nextLevel: () => {
    const { currentLevel } = get();
    const nextLevelNum = currentLevel + 1;
    const level = getLevel(nextLevelNum);
    
    // If there's no next level, end the game
    if (!level) {
      set({ gamePhase: 'ended' });
      console.log("Game completed!");
      return;
    }
    
    // Set up the next level
    set({
      gamePhase: 'playing',
      currentLevel: nextLevelNum,
      currentPathogen: level.pathogen,
      selectedResponses: [],
      correctResponses: [],
      responseStatus: {},
      responseHistory: []
    });
    
    console.log(`Advanced to level ${nextLevelNum}`);
  },
  
  // Add a response to the selected responses
  addResponse: (responseId: string) => {
    // Don't add if already selected
    if (get().selectedResponses.includes(responseId)) return;
    
    // Don't add if status is not pending
    if (get().getResponseStatus(responseId) !== 'pending') return;
    
    set(state => ({
      selectedResponses: [...state.selectedResponses, responseId]
    }));
    
    console.log(`Added response: ${responseId}`);
  },
  
  // Remove a response from the selected responses
  removeResponse: (responseId: string) => {
    set(state => ({
      selectedResponses: state.selectedResponses.filter(id => id !== responseId)
    }));
    
    console.log(`Removed response: ${responseId}`);
  },
  
  // Validate the current selection against the correct sequence
  validateSelections: () => {
    const { currentLevel, selectedResponses } = get();
    const level = getLevel(currentLevel);
    
    if (!level) return;
    
    // Get the correct sequence for this level
    const correctSequence = level.correctResponses;
    
    // Get the last selected response for feedback
    const lastResponseId = selectedResponses[selectedResponses.length - 1];
    const lastResponse = getResponseById(lastResponseId);
    
    // Prepare feedback
    let feedbackMessage = '';
    let newScore = get().score;
    let isCorrectSequence = false;
    
    // Check if the current selection is the next correct step
    const nextCorrectIndex = get().correctResponses.length;
    if (nextCorrectIndex < correctSequence.length) {
      // Check if the last selected response matches the next expected one
      if (lastResponseId === correctSequence[nextCorrectIndex]) {
        isCorrectSequence = true;
      }
    }
    
    if (isCorrectSequence) {
      // The sequence so far is correct
      feedbackMessage = `Good choice! ${lastResponse?.name} is effective here.`;
      newScore += 10;
      
      // Update status of selected responses to correct
      const newStatus = {...get().responseStatus};
      newStatus[lastResponseId] = 'correct';
      
      // Add to correct responses
      const newCorrectResponses = [...get().correctResponses, lastResponseId];
      
      // Check if this completes the level
      if (newCorrectResponses.length === correctSequence.length) {
        // Level completed!
        set({
          gamePhase: 'level_complete',
          score: newScore + 50, // Bonus for completing level
          responseStatus: newStatus,
          correctResponses: newCorrectResponses,
          defeatedPathogens: [...get().defeatedPathogens, get().currentPathogen?.id || '']
        });
        
        console.log("Level completed!");
        return;
      }
      
      // Level not complete yet, but correct so far
      set({
        score: newScore,
        responseStatus: newStatus,
        correctResponses: newCorrectResponses,
        selectedResponses: [] // Clear current selections after correct choice
      });
    } else {
      // Incorrect sequence
      feedbackMessage = `${lastResponse?.name} is not the right choice at this stage. Try a different immune response.`;
      
      // Mark incorrect selections
      const newStatus = {...get().responseStatus};
      newStatus[lastResponseId] = 'incorrect';
      
      set({ 
        responseStatus: newStatus,
        selectedResponses: [] // Clear selections after incorrect choice
      });
    }
    
    // Add feedback to history
    const feedback: ResponseFeedback = {
      responseId: lastResponseId,
      correct: isCorrectSequence,
      message: feedbackMessage,
      timestamp: Date.now()
    };
    
    set(state => ({
      responseHistory: [...state.responseHistory, feedback]
    }));
    
    console.log(`Validation result: ${isCorrectSequence ? 'Correct' : 'Incorrect'}`);
  },
  
  // Mark an immune response as active (for visualization)
  activateImmuneResponse: (responseId: string) => {
    // This would trigger animations or other visual effects
    console.log(`Activated immune response: ${responseId}`);
  },
  
  // Get the status of a response
  getResponseStatus: (responseId: string): ResponseStatus => {
    const { responseStatus, selectedResponses } = get();
    
    // If we have an explicit status, return it
    if (responseId in responseStatus) {
      return responseStatus[responseId];
    }
    
    // Check if this response is in the current selection
    if (selectedResponses.includes(responseId)) {
      return 'pending';
    }
    
    // Check if this response has prerequisites that aren't met
    const response = getResponseById(responseId);
    if (response && response.requires && response.requires.length > 0) {
      const prereqsMet = response.requires.every(req => 
        get().correctResponses.includes(req) || selectedResponses.includes(req)
      );
      
      if (!prereqsMet) {
        return 'disabled';
      }
    }
    
    // Default status if no other conditions apply
    return 'pending';
  }
}));

// Helper function to check if an array is a valid subsequence of another
function isValidSubsequence(sequence: string[], reference: string[]): boolean {
  // If sequence is empty, it's always valid
  if (sequence.length === 0) return true;
  
  // If sequence is longer than reference, it can't be valid
  if (sequence.length > reference.length) return false;
  
  // Check if sequence matches the beginning of reference
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i] !== reference[i]) {
      return false;
    }
  }
  
  return true;
}
