import { GameLevel, Pathogen } from '../types';

export const levels: GameLevel[] = [
  // Level 1: Introduction to Innate Immunity - Bacterial Infection
  {
    id: 1,
    name: "First Line of Defense",
    objective: "Activate the innate immune response to fight a bacterial infection",
    description: "A common bacteria has entered the bloodstream. You need to activate the correct immune cells to eliminate it before it can cause harm.",
    pathogen: {
      id: 'staph',
      name: 'Staphylococcus aureus',
      type: 'bacteria',
      description: 'A common bacteria that can cause skin infections, pneumonia, and food poisoning.',
      position: { x: 0, y: 1, z: 0 },
      difficulty: 1
    },
    correctResponses: ['neutrophil', 'macrophage', 'complement'],
    hintText: "First, recruit fast-responding cells, then bring in the professional phagocytes. The complement system can help destroy bacterial cell walls.",
    learningOutcome: "You've learned how the innate immune system provides immediate defense against bacteria through phagocytosis and the complement system."
  },
  
  // Level 2: Viral Infection and Innate Response
  {
    id: 2,
    name: "Viral Invasion",
    objective: "Combat a viral infection with appropriate immune cells",
    description: "A virus has infected cells in the body. You need to identify and eliminate infected cells before the virus can spread further.",
    pathogen: {
      id: 'influenza',
      name: 'Influenza Virus',
      type: 'virus',
      description: 'A respiratory virus that causes the flu, infecting cells of the respiratory tract.',
      position: { x: 0, y: 1, z: 0 },
      difficulty: 2
    },
    correctResponses: ['interferons', 'nk', 'dendritic'],
    hintText: "Viruses replicate inside cells. Start by slowing viral replication, then eliminate infected cells. Don't forget to alert the adaptive immune system.",
    learningOutcome: "You've learned how the body's first response to viral infections involves interferons, natural killer cells, and dendritic cells that bridge to the adaptive immune system."
  },
  
  // Level 3: Adaptive Immunity Activation
  {
    id: 3,
    name: "Adaptive Response",
    objective: "Activate the adaptive immune system to fight a persistent infection",
    description: "The pathogen is evading the innate immune response. You need to activate the adaptive immune system for a more targeted response.",
    pathogen: {
      id: 'ebv',
      name: 'Epstein-Barr Virus',
      type: 'virus',
      description: 'A persistent virus that can cause mononucleosis and remains dormant in the body after infection.',
      position: { x: 0, y: 1, z: 0 },
      difficulty: 3
    },
    correctResponses: ['dendritic', 'tcell_helper', 'tcell_cytotoxic', 'bcell'],
    hintText: "Start with antigen presentation, then activate helper T cells. You'll need both cell-mediated and humoral immunity.",
    learningOutcome: "You've learned the critical role of antigen presentation in activating the adaptive immune system, including T cells and B cells for targeted responses."
  },
  
  // Level 4: Complete Immune Response
  {
    id: 4,
    name: "Coordinated Defense",
    objective: "Coordinate a full immune response against a complex pathogen",
    description: "A dangerous pathogen requires both innate and adaptive immune responses working together. Create a complete defense strategy.",
    pathogen: {
      id: 'mtb',
      name: 'Mycobacterium tuberculosis',
      type: 'bacteria',
      description: 'The bacterium that causes tuberculosis, which can evade immune responses and survive inside macrophages.',
      position: { x: 0, y: 1, z: 0 },
      difficulty: 4
    },
    correctResponses: ['macrophage', 'dendritic', 'tcell_helper', 'tcell_cytotoxic', 'inflammation'],
    hintText: "This pathogen can survive inside phagocytes. You'll need to activate cell-mediated immunity for effective clearance.",
    learningOutcome: "You've learned how persistent pathogens require coordination between innate and adaptive immunity, especially cell-mediated responses involving activated macrophages and T cells."
  },
  
  // Level 5: Memory and Immunity
  {
    id: 5,
    name: "Immunological Memory",
    objective: "Develop immunological memory for long-term protection",
    description: "After defeating a pathogen, the immune system needs to remember it for faster response in future encounters. Develop immunological memory.",
    pathogen: {
      id: 'measles',
      name: 'Measles Virus',
      type: 'virus',
      description: 'A highly contagious virus that causes measles, but infection or vaccination provides lifelong immunity.',
      position: { x: 0, y: 1, z: 0 },
      difficulty: 5
    },
    correctResponses: ['dendritic', 'tcell_helper', 'bcell', 'antibody', 'memory_cells'],
    hintText: "Focus on developing both antibody production and memory cells for long-lasting protection.",
    learningOutcome: "You've learned how the immune system creates memory B and T cells that provide rapid responses to subsequent infections, forming the basis of vaccination."
  }
];

// Helper function to get a level by ID
export const getLevel = (id: number): GameLevel | undefined => {
  return levels.find(level => level.id === id);
};

// Helper function to get the pathogen for a specific level
export const getPathogenForLevel = (levelId: number): Pathogen | undefined => {
  const level = getLevel(levelId);
  return level?.pathogen;
};
