import { useState, useEffect } from 'react';
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
  LayoutGrid,
  Video,
  Link,
  Table,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useBuilder } from '../context/BuilderContext';

interface DraggableElementProps {
  type: ElementType;
  label: string;
}

export default function DraggableElement({ type, label }: DraggableElementProps) {
  const { addToRecentElements } = useBuilder();
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ELEMENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));
  
  const [isHovering, setIsHovering] = useState(false);
  const [animate, setAnimate] = useState(false);
  
  // Apply entrance animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get the right icon based on element type
  const getIcon = () => {
    switch (type) {
      case 'heading':
        return <Heading1 className={cn("h-5 w-5 transition-transform", { "scale-110": isHovering })} />;
      case 'paragraph':
        return <Type className={cn("h-5 w-5 transition-transform", { "scale-110": isHovering })} />;
      case 'image':
        return <Image className={cn("h-5 w-5 transition-transform", { "scale-110": isHovering })} />;
      case 'button':
        return <MousePointerClick className={cn("h-5 w-5 transition-transform", { "scale-110": isHovering })} />;
      case 'container':
        return <Box className={cn("h-5 w-5 transition-transform", { "scale-110": isHovering })} />;
      case 'two-column':
        return <Columns2 className={cn("h-5 w-5 transition-transform", { "scale-110": isHovering })} />;
      case 'form':
        return <FileSpreadsheet className={cn("h-5 w-5 transition-transform", { "scale-110": isHovering })} />;
      case 'gallery':
        return <LayoutGrid className={cn("h-5 w-5 transition-transform", { "scale-110": isHovering })} />;
      case 'video':
        return <Video className={cn("h-5 w-5 transition-transform", { "scale-110": isHovering })} />;
      case 'link':
        return <Link className={cn("h-5 w-5 transition-transform", { "scale-110": isHovering })} />;
      case 'table':
        return <Table className={cn("h-5 w-5 transition-transform", { "scale-110": isHovering })} />;
      default:
        return <Box className={cn("h-5 w-5 transition-transform", { "scale-110": isHovering })} />;
    }
  };

  return (
    <div
      ref={drag}
      className={cn(
        "element-enter border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm",
        "flex flex-col items-center justify-center text-sm cursor-grab",
        "transition-all duration-300 ease-out",
        "hover:border-primary hover:shadow-md dark:hover:border-primary",
        "active:scale-95 active:shadow-inner",
        "bg-card dark:bg-gray-800",
        { 
          "dragging-element": isDragging,
          "opacity-0 translate-y-4": !animate,
          "opacity-100 translate-y-0": animate 
        }
      )}
      data-element-type={type}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        transitionDelay: `${parseInt(type.charCodeAt(0).toString()) % 5 * 50}ms`
      }}
    >
      <div className={cn(
        "text-muted-foreground mb-2 transition-all duration-300",
        "rounded-full p-1.5 bg-primary/10 dark:bg-primary/20",
        { "text-primary": isHovering }
      )}>
        {getIcon()}
      </div>
      <span className={cn(
        "font-medium transition-all duration-300",
        { "text-primary": isHovering }
      )}>
        {label}
      </span>
    </div>
  );
}
