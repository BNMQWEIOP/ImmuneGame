# Immune Defense: An Educational 3D Game

## Overview

This project is an educational 3D game called "Immune Defense" that teaches users about the human immune system. Players defend against pathogens by selecting appropriate immune responses. The application is built with a React frontend using Three.js for 3D rendering, and an Express backend. It uses Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a client-server architecture:

1. **Frontend**: React application with Three.js for 3D rendering via React Three Fiber
2. **Backend**: Express.js server handling API requests and serving static files
3. **Database**: PostgreSQL database (configured through Drizzle ORM)
4. **State Management**: Custom Zustand stores for game state

The application is structured as a monorepo with clear separation between client, server, and shared code. The frontend uses Vite for development and building.

## Key Components

### Frontend

1. **3D Game Environment**:
   - Built with React Three Fiber and Drei
   - Features 3D models of immune cells and pathogens
   - Implements camera controls, lighting, and physics

2. **Game Logic**:
   - Level-based progression system
   - Different pathogen types (viruses, bacteria, fungi, parasites)
   - Multiple immune response mechanisms (cells, molecules, processes)

3. **User Interface**:
   - Built with Radix UI components and styled with Tailwind CSS
   - Includes response selector, feedback system, and game controls
   - Responsive design with mobile considerations

4. **State Management**:
   - Uses Zustand for global state management
   - Separate stores for game state, immune system, and audio

### Backend

1. **Express Server**:
   - Serves the frontend application
   - Provides API endpoints for game data and user progress
   - Includes development tools like Vite's HMR integration

2. **Data Storage**:
   - Implements a storage interface that can use different backends
   - Currently uses an in-memory storage implementation
   - Prepared for database integration via Drizzle ORM

### Shared

1. **Database Schema**:
   - Defined with Drizzle ORM
   - Includes user model with authentication fields
   - Prepared for game progress tracking

## Data Flow

1. **Game Initialization**:
   - User starts the game
   - Frontend loads game assets (3D models, textures, audio)
   - Initial level data is loaded from local data structures

2. **Gameplay Loop**:
   - Player selects immune responses to combat pathogens
   - Selection validation occurs client-side
   - Feedback is provided to the player
   - 3D visualization updates to show immune cells attacking pathogens

3. **Level Progression**:
   - Upon successful completion, player advances to the next level
   - New pathogens and challenges are introduced
   - Learning outcomes are presented to reinforce educational content

4. **Persistence** (to be implemented):
   - User progress will be saved to the database
   - Authentication system will allow returning to saved progress

## External Dependencies

### Frontend Libraries
- React and React DOM for UI
- React Three Fiber and Drei for 3D rendering
- Radix UI for accessible component primitives
- Tailwind CSS for styling
- Zustand for state management
- React Query for potential API data fetching

### Backend Libraries
- Express for the server
- Drizzle ORM for database operations
- Zod for schema validation

### Development Tools
- Vite for development server and building
- TypeScript for type safety
- ESBuild for server-side code bundling
- PostCSS and Autoprefixer for CSS processing

## Deployment Strategy

The application is configured for deployment to Replit's cloud run service:

1. **Build Process**:
   - Frontend is built with Vite
   - Server is bundled with ESBuild
   - Static assets are served from the dist directory

2. **Database**:
   - Currently using in-memory storage
   - Prepared for PostgreSQL integration via DATABASE_URL environment variable
   - Drizzle migrations will be used for schema changes

3. **Development Workflow**:
   - Development server runs with `npm run dev`
   - Production build created with `npm run build`
   - Database migrations applied with `npm run db:push`

## Getting Started

1. Ensure a PostgreSQL database is provisioned and the DATABASE_URL environment variable is set
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Access the application at http://localhost:5000

## Future Enhancements

1. Complete the authentication system
2. Implement game progress saving
3. Add more levels and pathogen types
4. Enhance 3D visualizations and effects
5. Add multiplayer capabilities