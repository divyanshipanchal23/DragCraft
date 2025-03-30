import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../context/BuilderContext';
import PlacedElement from './PlacedElement';
import { ElementType } from '../types/element';
import { cn } from '../lib/utils';
import { Sparkles, History } from 'lucide-react';

interface DropZoneProps {
  id: string;
  className?: string;
  placeholderText?: string;
}

export default function DropZone({ id, className = '', placeholderText = 'Drag and drop elements here' }: DropZoneProps) {
  const { state, addElement, selectDropZone, addToRecentElements } = useBuilder();
  const dropZone = state.dropZones[id];
  const isPreviewMode = state.isPreviewMode;
  const isSelected = state.selectedDropZoneId === id;
  const [showSparkle, setShowSparkle] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState(false);
  
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['ELEMENT', 'PLACED_ELEMENT'],
    drop: (item: { type: ElementType } | { id: string, parentId: string | null }) => {
      if ('type' in item) {
        // Add the element
        addElement(item.type, id);
        
        // Add to recent elements
        addToRecentElements(item.type);
        
        // Show a sparkle effect when an element is added
        setRecentlyAdded(true);
        setTimeout(() => setRecentlyAdded(false), 1500);
      }
      return { dropZoneId: id };
    },
    hover: (item, monitor) => {
      if (monitor.isOver({ shallow: true })) {
        setShowSparkle(true);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
      canDrop: !!monitor.canDrop()
    })
  }));
  
  // Hide sparkle effect when not hovering
  useEffect(() => {
    if (!isOver) {
      const timer = setTimeout(() => {
        setShowSparkle(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOver]);
  
  if (!dropZone) return null;
  
  const hasElements = dropZone.elements.length > 0;
  
  // Handle click on the dropzone (not on an element)
  const handleDropZoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPreviewMode) {
      selectDropZone(id);
    }
  };
  
  return (
    <div
      ref={drop}
      className={cn(
        className,
        'relative',
        {
          'drop-zone-hover': isOver && !isPreviewMode,
          'element-selected': isSelected && !isPreviewMode,
          'min-h-[100px] dropzone rounded-md': !hasElements && !isPreviewMode,
          'transition-all duration-300 ease-out': !isPreviewMode,
          'recently-added': recentlyAdded
        }
      )}
      onClick={handleDropZoneClick}
    >
      {/* Sparkle indicator when hovering with draggable element */}
      {showSparkle && !isPreviewMode && !hasElements && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Sparkles className="h-6 w-6 text-blue-500 animate-pulse" />
        </div>
      )}
      
      {/* Elements in the dropzone */}
      {hasElements ? (
        <div className={cn(
          'space-y-4',
          { 'p-2 transition-all duration-300': !isPreviewMode }
        )}>
          {dropZone.elements.map((elementId, index) => (
            <PlacedElement key={elementId} id={elementId} />
          ))}
        </div>
      ) : !isPreviewMode ? (
        <div className="flex flex-col items-center justify-center text-center p-4 transition-all duration-300">
          <p className={cn(
            "text-gray-500 text-sm",
            { "text-blue-600 font-medium": isOver }
          )}>
            {isOver ? "Drop to add here" : placeholderText}
          </p>
          
          {isOver && (
            <div className="mt-2 text-xs text-gray-500 animate-pulse">
              Release to place element
            </div>
          )}
        </div>
      ) : null}
      
      {/* Active drop zone indicator - shows when dragging elements */}
      {isOver && !isPreviewMode && (
        <div className="absolute inset-0 border-2 border-blue-500/50 rounded pointer-events-none z-20"></div>
      )}
    </div>
  );
}
