import React from 'react';
import { useDrop } from 'react-dnd';
import { useBuilder } from '../context/BuilderContext';
import PlacedElement from './PlacedElement';
import { ElementType } from '../types/element';

interface DropZoneProps {
  id: string;
  className?: string;
  placeholderText?: string;
}

export default function DropZone({ id, className = '', placeholderText = 'Drag and drop elements here' }: DropZoneProps) {
  const { state, addElement, selectDropZone } = useBuilder();
  const dropZone = state.dropZones[id];
  const isPreviewMode = state.isPreviewMode;
  const isSelected = state.selectedDropZoneId === id;
  
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'ELEMENT',
    drop: (item: { type: ElementType }) => {
      addElement(item.type, id);
      return { dropZoneId: id };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  }));
  
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
      className={`
        ${className} 
        ${isOver && !isPreviewMode ? 'bg-primary bg-opacity-10' : ''} 
        ${isSelected && !isPreviewMode ? 'ring-2 ring-primary' : ''}
        ${!hasElements && !isPreviewMode ? 'min-h-[100px] border-2 border-dashed border-gray-300 rounded-md' : ''}
        ${!isPreviewMode ? 'transition-colors' : ''}
      `}
      onClick={handleDropZoneClick}
    >
      {hasElements ? (
        dropZone.elements.map((elementId) => (
          <PlacedElement key={elementId} id={elementId} />
        ))
      ) : !isPreviewMode ? (
        <p className="text-gray-500 text-center p-4">{placeholderText}</p>
      ) : null}
    </div>
  );
}
