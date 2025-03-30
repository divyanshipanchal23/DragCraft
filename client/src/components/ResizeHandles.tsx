import React from 'react';

export type HandlePosition = 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left';

interface ResizeHandlesProps {
  onResizeStart: (handle: HandlePosition, e: React.MouseEvent) => void;
  isSelected: boolean;
  aspectRatio?: number; // Optional aspect ratio to maintain during resize
  showAllHandles?: boolean; // Whether to show all handles or just corners
}

const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  onResizeStart,
  isSelected,
  showAllHandles = false
}) => {
  if (!isSelected) return null;

  // Define all possible handles
  const handles: HandlePosition[] = showAllHandles
    ? ['top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left']
    : ['top-left', 'top-right', 'bottom-right', 'bottom-left'];

  // Map handle positions to CSS classes
  const handlePositionClasses: Record<HandlePosition, string> = {
    'top-left': 'top-0 left-0 cursor-nwse-resize',
    'top': 'top-0 left-1/2 -translate-x-1/2 cursor-ns-resize',
    'top-right': 'top-0 right-0 cursor-nesw-resize',
    'right': 'top-1/2 right-0 -translate-y-1/2 cursor-ew-resize',
    'bottom-right': 'bottom-0 right-0 cursor-nwse-resize', 
    'bottom': 'bottom-0 left-1/2 -translate-x-1/2 cursor-ns-resize',
    'bottom-left': 'bottom-0 left-0 cursor-nesw-resize',
    'left': 'top-1/2 left-0 -translate-y-1/2 cursor-ew-resize',
  };

  return (
    <div className="resize-handles-container">
      {handles.map((handle) => (
        <div
          key={handle}
          className={`absolute w-4 h-4 bg-primary border border-white rounded-sm z-10 ${handlePositionClasses[handle]}`}
          style={{
            // Create a larger hit area than the visible handle
            margin: '-4px',
            boxShadow: '0 0 0 4px rgba(255,255,255,0.0)'
          }}
          onMouseDown={(e) => {
            e.stopPropagation(); // Prevent element selection when clicking on handle
            onResizeStart(handle, e);
          }}
          data-handle={handle}
        />
      ))}
    </div>
  );
};

export default ResizeHandles; 