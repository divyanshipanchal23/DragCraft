import { createContext, useContext, useReducer, useState, ReactNode, useCallback } from 'react';
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
  | { type: 'MOVE_ELEMENT'; payload: { elementId: string; sourceDropZoneId: string; destinationDropZoneId: string; index?: number } };

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
}

// Create context
const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

// Provider component
export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(builderReducer, initialState);
  
  const addElement = useCallback((elementType: ElementType, dropZoneId: string) => {
    const newElement = createNewElement(elementType, dropZoneId);
    dispatch({ 
      type: 'ADD_ELEMENT', 
      payload: { element: newElement, dropZoneId } 
    });
  }, []);
  
  const updateElement = useCallback((elementId: string, updates: Partial<Element>) => {
    dispatch({ 
      type: 'UPDATE_ELEMENT', 
      payload: { elementId, updates } 
    });
  }, []);
  
  const deleteElement = useCallback((elementId: string) => {
    dispatch({ 
      type: 'DELETE_ELEMENT', 
      payload: { elementId } 
    });
  }, []);
  
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
    dispatch({ 
      type: 'DUPLICATE_ELEMENT', 
      payload: { elementId } 
    });
  }, []);
  
  const moveElement = useCallback((elementId: string, sourceDropZoneId: string, destinationDropZoneId: string, index?: number) => {
    dispatch({
      type: 'MOVE_ELEMENT',
      payload: { elementId, sourceDropZoneId, destinationDropZoneId, index }
    });
  }, []);
  
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
    moveElement
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
