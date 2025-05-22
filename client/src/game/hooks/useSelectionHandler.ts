import { useCallback } from 'react';
import { useImmuneSystem } from '../../lib/stores/useImmuneSystem';
import { getResponseById } from '../data/immuneResponses';
import { ImmuneResponse } from '../types';
import { useAudio } from '@/lib/stores/useAudio';

export default function useSelectionHandler() {
  const { 
    selectedResponses, 
    addResponse, 
    removeResponse,
    validateSelections,
    getResponseStatus,
    currentLevel
  } = useImmuneSystem();
  
  const { playHit } = useAudio();
  
  // Handle selection of an immune response
  const handleSelection = useCallback((response: ImmuneResponse) => {
    console.log("Selection handler called for:", response.name);
    
    // Check if this response is already selected
    const isAlreadySelected = selectedResponses.includes(response.id);
    
    // Get current status of the response
    const currentStatus = getResponseStatus(response.id);
    
    // Don't allow selection if disabled or already correct
    if (currentStatus === 'disabled' || currentStatus === 'correct') {
      console.log("Response is disabled or already correct, ignoring selection");
      return;
    }
    
    // If already selected (and pending), remove it
    if (isAlreadySelected && currentStatus === 'pending') {
      console.log("Removing response from selection:", response.name);
      removeResponse(response.id);
      return;
    }
    
    // Check prerequisites
    const hasPrerequisites = checkPrerequisites(response);
    if (!hasPrerequisites) {
      console.log("Prerequisites not met for:", response.name);
      playHit(); // Play error sound
      return;
    }
    
    // Add the response
    console.log("Adding response to selection:", response.name);
    addResponse(response.id);
  }, [selectedResponses, addResponse, removeResponse, getResponseStatus, playHit]);
  
  // Helper to check if prerequisites are met
  const checkPrerequisites = useCallback((response: ImmuneResponse): boolean => {
    // If no prerequisites, always allow
    if (!response.requires || response.requires.length === 0) {
      return true;
    }
    
    // Check if all required responses are already selected
    return response.requires.every(requiredId => {
      // Consider the prerequisite met if it's either in the selection or was already validated as correct
      const isSelected = selectedResponses.includes(requiredId);
      const isCorrect = getResponseStatus(requiredId) === 'correct';
      return isSelected || isCorrect;
    });
  }, [selectedResponses, getResponseStatus]);
  
  // Handle validation of the current selections
  const handleValidate = useCallback(() => {
    console.log("Validating current selections");
    validateSelections();
  }, [validateSelections]);
  
  return {
    handleSelection,
    handleValidate
  };
}
