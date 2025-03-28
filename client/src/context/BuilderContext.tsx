import { createContext, useContext, useReducer, useState, ReactNode, useCallback, useRef } from 'react';
import { BuilderState, Element, ElementType, DropZone } from '../types/element';
import { createDefaultTemplate, createNewElement, defaultTemplateId } from '../utils/element-templates';

// Initial state setup with default template
const [defaultTemplate, initialDropZones, initialElements] = createDefaultTemplate();

const initialState: BuilderState = {
  elements: initialElements,
  dropZones: initialDropZones,
  selectedElementId: null,
  selectedDropZoneId: null,
  templates: [defaultTemplate],
  currentTemplateId: defaultTemplateId,
  isDragging: false,
  isPreviewMode: false,
  viewMode: 'desktop'
};

// Action types
type BuilderAction =
  | { type: 'ADD_ELEMENT'; payload: { element: Element; dropZoneId: string } }
  | { type: 'UPDATE_ELEMENT'; payload: { elementId: string; updates: Partial<Element> } }
  | { type: 'DELETE_ELEMENT'; payload: { elementId: string } }
  | { type: 'SELECT_ELEMENT'; payload: { elementId: string | null } }
  | { type: 'SELECT_DROP_ZONE'; payload: { dropZoneId: string | null } }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'TOGGLE_PREVIEW_MODE' }
  | { type: 'SET_VIEW_MODE'; payload: 'desktop' | 'tablet' | 'mobile' }
  | { type: 'DUPLICATE_ELEMENT'; payload: { elementId: string } }
  | { type: 'MOVE_ELEMENT'; payload: { elementId: string; sourceDropZoneId: string; destinationDropZoneId: string; index?: number } }
  | { type: 'SET_STATE'; payload: BuilderState };

// Reducer function
const builderReducer = (state: BuilderState, action: BuilderAction): BuilderState => {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const { element, dropZoneId } = action.payload;
      const dropZone = state.dropZones[dropZoneId];
      
      if (!dropZone) return state;
      
      return {
        ...state,
        elements: {
          ...state.elements,
          [element.id]: {
            ...element,
            parentId: dropZoneId
          }
        },
        dropZones: {
          ...state.dropZones,
          [dropZoneId]: {
            ...dropZone,
            elements: [...dropZone.elements, element.id]
          }
        },
        selectedElementId: element.id
      };
    }
    
    case 'UPDATE_ELEMENT': {
      const { elementId, updates } = action.payload;
      const element = state.elements[elementId];
      
      if (!element) return state;
      
      return {
        ...state,
        elements: {
          ...state.elements,
          [elementId]: {
            ...element,
            ...updates,
            style: {
              ...element.style,
              ...(updates.style || {})
            }
          } as Element
        }
      };
    }
    
    case 'DELETE_ELEMENT': {
      const { elementId } = action.payload;
      const element = state.elements[elementId];
      
      if (!element || !element.parentId) return state;
      
      const parentDropZone = state.dropZones[element.parentId];
      if (!parentDropZone) return state;
      
      const newElements = { ...state.elements };
      delete newElements[elementId];
      
      return {
        ...state,
        elements: newElements,
        dropZones: {
          ...state.dropZones,
          [element.parentId]: {
            ...parentDropZone,
            elements: parentDropZone.elements.filter(id => id !== elementId)
          }
        },
        selectedElementId: null
      };
    }
    
    case 'SELECT_ELEMENT': {
      return {
        ...state,
        selectedElementId: action.payload.elementId,
        selectedDropZoneId: null
      };
    }
    
    case 'SELECT_DROP_ZONE': {
      return {
        ...state,
        selectedDropZoneId: action.payload.dropZoneId,
        selectedElementId: null
      };
    }
    
    case 'SET_DRAGGING': {
      return {
        ...state,
        isDragging: action.payload
      };
    }
    
    case 'TOGGLE_PREVIEW_MODE': {
      return {
        ...state,
        isPreviewMode: !state.isPreviewMode,
        selectedElementId: null,
        selectedDropZoneId: null
      };
    }
    
    case 'SET_VIEW_MODE': {
      return {
        ...state,
        viewMode: action.payload
      };
    }
    
    case 'DUPLICATE_ELEMENT': {
      const { elementId } = action.payload;
      const element = state.elements[elementId];
      
      if (!element || !element.parentId) return state;
      
      const parentDropZone = state.dropZones[element.parentId];
      if (!parentDropZone) return state;
      
      // Create a new element with a new ID but same properties
      const newElement = {
        ...element,
        id: `${element.id}-copy-${Date.now()}`
      };
      
      return {
        ...state,
        elements: {
          ...state.elements,
          [newElement.id]: newElement
        },
        dropZones: {
          ...state.dropZones,
          [element.parentId]: {
            ...parentDropZone,
            elements: [...parentDropZone.elements, newElement.id]
          }
        },
        selectedElementId: newElement.id
      };
    }
    
    case 'MOVE_ELEMENT': {
      const { elementId, sourceDropZoneId, destinationDropZoneId, index } = action.payload;
      const element = state.elements[elementId];
      const sourceDropZone = state.dropZones[sourceDropZoneId];
      const destinationDropZone = state.dropZones[destinationDropZoneId];
      
      if (!element || !sourceDropZone || !destinationDropZone) return state;
      
      // Remove from source
      const sourceElements = sourceDropZone.elements.filter(id => id !== elementId);
      
      // Add to destination at specific index or end
      let destElements = [...destinationDropZone.elements];
      if (typeof index === 'number') {
        destElements.splice(index, 0, elementId);
      } else {
        destElements.push(elementId);
      }
      
      return {
        ...state,
        elements: {
          ...state.elements,
          [elementId]: {
            ...element,
            parentId: destinationDropZoneId
          }
        },
        dropZones: {
          ...state.dropZones,
          [sourceDropZoneId]: {
            ...sourceDropZone,
            elements: sourceElements
          },
          [destinationDropZoneId]: {
            ...destinationDropZone,
            elements: destElements
          }
        }
      };
    }
    
    case 'SET_STATE': {
      // Preserve UI-only state properties like selection and preview mode
      return {
        ...action.payload,
        selectedElementId: state.selectedElementId,
        selectedDropZoneId: state.selectedDropZoneId,
        isPreviewMode: state.isPreviewMode,
        viewMode: state.viewMode,
        isDragging: state.isDragging
      };
    }
    
    default:
      return state;
  }
};

// Context type
interface BuilderContextType {
  state: BuilderState;
  addElement: (elementType: ElementType, dropZoneId: string) => void;
  updateElement: (elementId: string, updates: Partial<Element>) => void;
  deleteElement: (elementId: string) => void;
  selectElement: (elementId: string | null) => void;
  selectDropZone: (dropZoneId: string | null) => void;
  setDragging: (isDragging: boolean) => void;
  togglePreviewMode: () => void;
  setViewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  duplicateElement: (elementId: string) => void;
  moveElement: (elementId: string, sourceDropZoneId: string, destinationDropZoneId: string, index?: number) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

// Create context
const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

// Provider component
export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(builderReducer, initialState);
  
  // History tracking
  const historyRef = useRef<{
    past: BuilderState[];
    future: BuilderState[];
    present: BuilderState;
  }>({
    past: [],
    future: [],
    present: initialState
  });
  
  // Update history when state changes
  const saveToHistory = useCallback((newState: BuilderState) => {
    historyRef.current = {
      past: [...historyRef.current.past, historyRef.current.present],
      present: newState,
      future: []
    };
  }, []);
  
  // Custom dispatch that tracks history
  const dispatchWithHistory = useCallback((action: BuilderAction) => {
    // Skip history for view-only actions
    const isViewOnlyAction = 
      action.type === 'SELECT_ELEMENT' || 
      action.type === 'SELECT_DROP_ZONE' || 
      action.type === 'SET_DRAGGING' || 
      action.type === 'TOGGLE_PREVIEW_MODE' ||
      action.type === 'SET_VIEW_MODE';
    
    const prevState = state;
    dispatch(action);
    
    // Only save to history for actions that modify the canvas
    if (!isViewOnlyAction) {
      // Note: We access the current state outside of the callback,
      // but React guarantees the dispatch call is synchronous
      // so we can update our history right after
      setTimeout(() => {
        saveToHistory(state);
      }, 0);
    }
  }, [state, saveToHistory]);
  
  // Undo/Redo functionality
  const undo = useCallback(() => {
    const { past, present, future } = historyRef.current;
    
    if (past.length === 0) return;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    historyRef.current = {
      past: newPast,
      present: previous,
      future: [present, ...future]
    };
    
    dispatch({ type: 'SET_STATE', payload: previous } as any);
  }, []);
  
  const redo = useCallback(() => {
    const { past, present, future } = historyRef.current;
    
    if (future.length === 0) return;
    
    const next = future[0];
    const newFuture = future.slice(1);
    
    historyRef.current = {
      past: [...past, present],
      present: next,
      future: newFuture
    };
    
    dispatch({ type: 'SET_STATE', payload: next } as any);
  }, []);
  
  // Derived properties
  const canUndo = historyRef.current.past.length > 0;
  const canRedo = historyRef.current.future.length > 0;
  
  // Action creators
  const addElement = useCallback((elementType: ElementType, dropZoneId: string) => {
    const newElement = createNewElement(elementType, dropZoneId);
    dispatchWithHistory({ 
      type: 'ADD_ELEMENT', 
      payload: { element: newElement, dropZoneId } 
    });
  }, [dispatchWithHistory]);
  
  const updateElement = useCallback((elementId: string, updates: Partial<Element>) => {
    dispatchWithHistory({ 
      type: 'UPDATE_ELEMENT', 
      payload: { elementId, updates } 
    });
  }, [dispatchWithHistory]);
  
  const deleteElement = useCallback((elementId: string) => {
    dispatchWithHistory({ 
      type: 'DELETE_ELEMENT', 
      payload: { elementId } 
    });
  }, [dispatchWithHistory]);
  
  const selectElement = useCallback((elementId: string | null) => {
    dispatch({ 
      type: 'SELECT_ELEMENT', 
      payload: { elementId } 
    });
  }, []);
  
  const selectDropZone = useCallback((dropZoneId: string | null) => {
    dispatch({ 
      type: 'SELECT_DROP_ZONE', 
      payload: { dropZoneId } 
    });
  }, []);
  
  const setDragging = useCallback((isDragging: boolean) => {
    dispatch({ 
      type: 'SET_DRAGGING', 
      payload: isDragging 
    });
  }, []);
  
  const togglePreviewMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_PREVIEW_MODE' });
  }, []);
  
  const setViewMode = useCallback((mode: 'desktop' | 'tablet' | 'mobile') => {
    dispatch({ 
      type: 'SET_VIEW_MODE', 
      payload: mode 
    });
  }, []);
  
  const duplicateElement = useCallback((elementId: string) => {
    dispatchWithHistory({ 
      type: 'DUPLICATE_ELEMENT', 
      payload: { elementId } 
    });
  }, [dispatchWithHistory]);
  
  const moveElement = useCallback((elementId: string, sourceDropZoneId: string, destinationDropZoneId: string, index?: number) => {
    dispatchWithHistory({
      type: 'MOVE_ELEMENT',
      payload: { elementId, sourceDropZoneId, destinationDropZoneId, index }
    });
  }, [dispatchWithHistory]);
  
  const value = {
    state,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    selectDropZone,
    setDragging,
    togglePreviewMode,
    setViewMode,
    duplicateElement,
    moveElement,
    undo,
    redo,
    canUndo,
    canRedo
  };
  
  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
}

// Custom hook to use the context
export function useBuilder() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}
