import { ImmuneResponse } from '../types';

export const immuneResponses: ImmuneResponse[] = [
  // Innate Immune Responses
  {
    id: 'neutrophil',
    name: 'Neutrophil',
    type: 'cell',
    category: 'innate',
    shortDescription: 'Fast-responding phagocytes',
    description: 'Neutrophils are the most abundant type of white blood cells and are among the first immune cells to travel to the site of an infection. They kill pathogens by phagocytosis and by releasing antimicrobial substances.',
    effectiveAgainst: ['bacteria', 'fungus'],
    requires: []
  },
  {
    id: 'macrophage',
    name: 'Macrophage',
    type: 'cell',
    category: 'innate',
    shortDescription: 'Efficient phagocyte & antigen presenter',
    description: 'Macrophages are specialized cells involved in the detection, phagocytosis and destruction of bacteria and other harmful organisms. They can also present antigens to T cells and initiate inflammation by releasing cytokines.',
    effectiveAgainst: ['bacteria', 'fungus', 'parasite'],
    requires: []
  },
  {
    id: 'dendritic',
    name: 'Dendritic Cell',
    type: 'cell',
    category: 'innate',
    shortDescription: 'Professional antigen presenter',
    description: 'Dendritic cells are antigen-presenting cells that function as messengers between the innate and adaptive immune systems. They process antigen material and present it on their surface to T cells.',
    effectiveAgainst: [],
    requires: []
  },
  {
    id: 'nk',
    name: 'Natural Killer Cell',
    type: 'cell',
    category: 'innate',
    shortDescription: 'Kills virus-infected & cancer cells',
    description: 'Natural killer cells provide rapid responses to virus-infected cells and respond to tumor formation. They kill cells by releasing cytotoxic granules that cause the target cell to die by apoptosis.',
    effectiveAgainst: ['virus'],
    requires: []
  },
  {
    id: 'inflammation',
    name: 'Inflammation',
    type: 'process',
    category: 'innate',
    shortDescription: 'Increased blood flow & immune cell recruitment',
    description: 'Inflammation is a protective response involving immune cells, blood vessels, and molecular mediators to eliminate the initial cause of cell injury, clear out damaged cells, and initiate tissue repair.',
    effectiveAgainst: [],
    requires: []
  },
  
  // Adaptive Immune Responses
  {
    id: 'bcell',
    name: 'B Cell',
    type: 'cell',
    category: 'adaptive',
    shortDescription: 'Produces antibodies',
    description: 'B cells are responsible for producing antibodies. When a B cell encounters its matching antigen and receives additional signals from helper T cells, it proliferates and differentiates into plasma cells.',
    effectiveAgainst: [],
    requires: ['dendritic']
  },
  {
    id: 'tcell_helper',
    name: 'Helper T Cell',
    type: 'cell',
    category: 'adaptive',
    shortDescription: 'Activates B cells & other immune cells',
    description: 'Helper T cells are a type of T cell that assist other white blood cells in immunologic processes, including maturation of B cells into plasma cells and activation of cytotoxic T cells and macrophages.',
    effectiveAgainst: [],
    requires: ['dendritic']
  },
  {
    id: 'tcell_cytotoxic',
    name: 'Cytotoxic T Cell',
    type: 'cell',
    category: 'adaptive',
    shortDescription: 'Destroys infected cells',
    description: 'Cytotoxic T cells destroy virus-infected cells and tumor cells, and are also implicated in transplant rejection. They recognize their targets by binding to antigen associated with MHC class I molecules.',
    effectiveAgainst: ['virus'],
    requires: ['dendritic', 'tcell_helper']
  },
  {
    id: 'memory_cells',
    name: 'Memory Cells',
    type: 'cell',
    category: 'adaptive',
    shortDescription: 'Provides long-term immunity',
    description: 'Memory cells are a subset of T and B cells that have been exposed to antigens and can mount a much faster and stronger immune response when encountering the same pathogen again.',
    effectiveAgainst: [],
    requires: ['bcell', 'tcell_helper']
  },
  
  // Molecules and other components
  {
    id: 'antibody',
    name: 'Antibodies',
    type: 'molecule',
    category: 'molecules',
    shortDescription: 'Tags pathogens for destruction',
    description: 'Antibodies are Y-shaped proteins produced by plasma cells that neutralize pathogens by binding to specific antigens on their surface, marking them for destruction by other immune cells.',
    effectiveAgainst: ['virus', 'bacteria', 'parasite'],
    requires: ['bcell', 'tcell_helper']
  },
  {
    id: 'complement',
    name: 'Complement System',
    type: 'molecule',
    category: 'molecules',
    shortDescription: 'Creates holes in pathogen membranes',
    description: 'The complement system is a part of the immune system that enhances the ability of antibodies and phagocytic cells to clear pathogens. It can directly lyse pathogens by creating holes in their cell membranes.',
    effectiveAgainst: ['bacteria'],
    requires: []
  },
  {
    id: 'cytokines',
    name: 'Cytokines',
    type: 'molecule',
    category: 'molecules',
    shortDescription: 'Signaling molecules for immune coordination',
    description: 'Cytokines are small proteins that are crucial in cell signaling. They modulate the balance between humoral and cell-based immune responses and regulate the maturation, growth, and responsiveness of particular cell populations.',
    effectiveAgainst: [],
    requires: []
  },
  {
    id: 'interferons',
    name: 'Interferons',
    type: 'molecule',
    category: 'molecules',
    shortDescription: 'Inhibits viral replication',
    description: 'Interferons are proteins made and released by host cells in response to the presence of pathogens such as viruses, bacteria, parasites, or tumor cells. They allow communication between cells to trigger protective defenses.',
    effectiveAgainst: ['virus'],
    requires: []
  }
];

// Helper function to find a response by ID
export const getResponseById = (id: string): ImmuneResponse | undefined => {
  return immuneResponses.find(response => response.id === id);
};

// Helper function to get all responses effective against a specific pathogen type
export const getResponsesForPathogen = (pathogenType: string): ImmuneResponse[] => {
  return immuneResponses.filter(response => 
    response.effectiveAgainst.includes(pathogenType as any)
  );
};
