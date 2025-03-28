import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ElementType } from '../types/element';
import { 
  Heading1, 
  Type, 
  Image, 
  MousePointerClick, 
  Box, 
  Columns2, 
  FileSpreadsheet, 
  LayoutGrid
} from 'lucide-react';

interface DraggableElementProps {
  type: ElementType;
  label: string;
}

export default function DraggableElement({ type, label }: DraggableElementProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ELEMENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));
  
  // Get the right icon based on element type
  const getIcon = () => {
    switch (type) {
      case 'heading':
        return <Heading1 className="h-5 w-5" />;
      case 'paragraph':
        return <Type className="h-5 w-5" />;
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'button':
        return <MousePointerClick className="h-5 w-5" />;
      case 'container':
        return <Box className="h-5 w-5" />;
      case 'two-column':
        return <Columns2 className="h-5 w-5" />;
      case 'form':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'gallery':
        return <LayoutGrid className="h-5 w-5" />;
      default:
        return <Box className="h-5 w-5" />;
    }
  };

  return (
    <div
      ref={drag}
      className={`border border-gray-200 hover:border-primary rounded-md p-2 bg-white shadow-sm flex flex-col items-center justify-center text-sm cursor-grab ${isDragging ? 'opacity-50' : ''}`}
      data-element-type={type}
    >
      <div className="text-gray-500 mb-1">
        {getIcon()}
      </div>
      <span>{label}</span>
    </div>
  );
}
