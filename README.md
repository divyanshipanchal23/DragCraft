DragCraft - Website Builder with Drag-and-Drop Interface

A modern website builder that allows users to create websites using an intuitive drag-and-drop interface combined with form-based customization.

Setup Instructions

1. Open the terminal and navigate to the project directory

2. Install Node.js dependencies:
   
   npm install

3. Start the development server:
  
   npm run dev  

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

Features

- Drag-and-drop interface for website building
- Form-based element customization
- Responsive design support
- Real-time preview
- Template-based structure
- Mobile and desktop compatibility

Assignment Objectives

This project was developed to meet the following objectives for the Frontend Developer Assignment:

1. User Experience
The interface provides an intuitive drag-and-drop experience with:
- Visual feedback during dragging with highlight effects
- Smooth animations for element placement
- Clear property panels for customization
- Template selection for different starting points
- Mobile and desktop views for testing responsiveness

2. Customization
After placing elements on the canvas, users can:
- Modify content with a rich text editor
- Adjust styling including fonts, colors, and spacing
- Resize elements with interactive handles
- Configure element-specific properties (e.g., image sources, button styles)
- Arrange elements within the layout

3. Responsiveness
The builder supports multiple device views:
- Desktop, tablet, and mobile preview modes
- Responsive layouts that adapt to different screen sizes
- Mobile-friendly UI with slide-out panels on small screens

4. Scalability
The architecture supports future expansion through:
- Component-based design for easy addition of new element types
- Template system for adding new templates
- State management that separates UI concerns from data
- Clear interfaces for extending functionality

5. Code Quality
The codebase maintains high quality through:
- TypeScript for type safety
- React functional components with hooks
- Separation of concerns (components, contexts, hooks)
- Well-documented code with clear naming conventions
- Testing for critical functionality

Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Vite
  - TailwindCSS
  - Radix UI Components
  - React DnD (Drag and Drop)
  - React Query
  - React Hook Form

- **Backend:**
  - Node.js
  - Express
  - PostgreSQL with Drizzle ORM
  - WebSocket for real-time updates

Prerequisites

- Node.js 18+ 
- PostgreSQL database (optional for local development)


Architecture

Frontend
- Component-based architecture using React
- Drag-and-drop functionality implemented using React DnD
- State management with React Query for server state
- Form handling with React Hook Form and Zod validation
- Styled using TailwindCSS with Radix UI components

Backend
- RESTful API using Express
- WebSocket server for real-time updates
- Database access through Drizzle ORM
- Session-based authentication

Drag and Drop Implementation

The drag-and-drop functionality is implemented using React DnD with the following components:

1. **DraggableElement**: Elements in the toolbox that can be dragged onto the canvas
2. **DropZone**: Areas that can receive dragged elements
3. **PlacedElement**: Elements that have been placed on the canvas and can be further customized
4. **ResizeHandles**: UI for resizing elements after placement
5. **BuilderContext**: State management for the entire builder

The workflow is:
1. User drags an element from the toolbox
2. Visual feedback shows valid drop areas
3. On drop, the element is added to the state and rendered
4. User can select the element to edit its properties
5. Properties panel shows form controls for the selected element

Project Structure


dragcraft/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # UI components including drag-and-drop elements
│   │   ├── context/         # React context providers for state management
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility libraries and configurations
│   │   ├── pages/           # Page components
│   │   ├── test/            # Test files for components and utilities
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions and helpers
│   ├── styles/              # Additional stylesheet files
│   └── index.tsx            # Entry point for the React application
├── server/                  # Backend Express server
├── shared/                  # Shared types and utilities
└── node_modules/            # Node.js dependencies


Development Workflow

1. Make changes to the codebase
2. Run type checking: `npm run check`
3. Test your changes locally
4. Build for production: `npm run build`
5. Start production server: `npm start`

Testing Strategy

This project implements a strategic minimal testing approach to validate core functionality:

- **UI Component Tests**: Verify that basic UI elements render correctly and respond to user interactions
- **Feature Tests**: Validate the rich text editor functionality which is central to the application
- **Utility Tests**: Ensure helper functions correctly create element templates
- **State Management Tests**: Verify that context providers correctly manage application state

The tests focus on critical functionality while maintaining a lean testing footprint. This approach balances code quality verification against development time constraints.

Key areas covered by tests:
- Basic UI components (Button)
- Rich text editor component
- Element creation utilities
- Builder context state management

To run tests:

npm run test


For continuous testing during development:

npm run test:watch

