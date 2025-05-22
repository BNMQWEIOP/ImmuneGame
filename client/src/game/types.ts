export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Pathogen {
  id: string;
  name: string;
  type: 'virus' | 'bacteria' | 'fungus' | 'parasite';
  description: string;
  position: Position;
  difficulty: number;
}

export interface ImmuneCell {
  id: string;
  name: string;
  type: string;
  position: Position;
  active: boolean;
}

export interface ImmuneResponse {
  id: string;
  name: string;
  type: 'cell' | 'molecule' | 'process';
  category: 'innate' | 'adaptive' | 'molecules';
  shortDescription: string;
  description: string;
  effectiveAgainst: ('virus' | 'bacteria' | 'fungus' | 'parasite')[];
  requires: string[]; // IDs of prerequisite responses
}

export interface ResponseFeedback {
  responseId: string;
  correct: boolean;
  message: string;
  timestamp: number;
}

export type GamePhase = 
  | 'menu' 
  | 'ready'
  | 'playing'
  | 'level_complete'
  | 'ended';

export type ResponseStatus = 
  | 'pending' 
  | 'correct' 
  | 'incorrect' 
  | 'disabled';

export interface GameLevel {
  id: number;
  name: string;
  objective: string;
  description: string;
  pathogen: Pathogen;
  correctResponses: string[]; // IDs of responses in correct order
  hintText: string;
  learningOutcome: string;
}
