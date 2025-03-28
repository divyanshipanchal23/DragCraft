import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useBuilder } from '../context/BuilderContext';
import { Element } from '../types/element';

interface PlacedElementProps {
  id: string;
}

export default function PlacedElement({ id }: PlacedElementProps) {
  const { state, selectElement, moveElement } = useBuilder();
  const element = state.elements[id] as Element;
  const isSelected = state.selectedElementId === id;
  const isPreviewMode = state.isPreviewMode;
  
  const ref = useRef<HTMLDivElement>(null);
  
  // Set up drag and drop
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PLACED_ELEMENT',
    item: { id, parentId: element.parentId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
    canDrag: !isPreviewMode
  }));
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'PLACED_ELEMENT',
    hover(item: { id: string, parentId: string | null }, monitor) {
      if (!ref.current) return;
      
      const dragId = item.id;
      const hoverId = id;
      
      // Don't replace items with themselves
      if (dragId === hoverId) return;
      
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      
      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      
      // For simplicity, we're not implementing complex reordering logic in this example
    },
    drop(item: { id: string, parentId: string | null }) {
      if (item.id === id) return;
      
      if (item.parentId && element.parentId) {
        moveElement(item.id, item.parentId, element.parentId);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));
  
  // Combine drag and drop refs
  drag(drop(ref));
  
  // Handle element click
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPreviewMode) {
      selectElement(id);
    }
  };
  
  // Render element based on type
  const renderElement = () => {
    switch (element.type) {
      case 'heading':
        return (
          <h2
            style={{
              fontSize: getFontSize(element.style.fontSize),
              fontWeight: getFontWeight(element.style.fontWeight),
              color: element.style.color,
              textAlign: getTextAlignment(element.style.alignment),
              margin: `${element.style.margin}px 0`,
              padding: `${element.style.padding}px`
            }}
          >
            {element.content}
          </h2>
        );
      
      case 'paragraph':
        return (
          <p
            style={{
              fontSize: getFontSize(element.style.fontSize),
              fontWeight: getFontWeight(element.style.fontWeight),
              color: element.style.color,
              textAlign: getTextAlignment(element.style.alignment),
              margin: `${element.style.margin}px 0`,
              padding: `${element.style.padding}px`
            }}
          >
            {element.content}
          </p>
        );
      
      case 'image':
        return (
          <img
            src={element.src}
            alt={element.alt}
            style={{
              width: element.style.width,
              height: element.style.height,
              borderRadius: `${element.style.borderRadius}px`,
              margin: `${element.style.margin}px 0`,
              padding: `${element.style.padding}px`
            }}
            className="max-w-full"
          />
        );
      
      case 'button':
        return (
          <button
            style={{
              backgroundColor: element.style.backgroundColor,
              color: element.style.color,
              fontSize: getFontSize(element.style.fontSize),
              fontWeight: getFontWeight(element.style.fontWeight),
              borderRadius: `${element.style.borderRadius}px`,
              margin: `${element.style.margin}px 0`,
              padding: `${element.style.padding}px ${element.style.padding * 2}px`,
              display: 'block',
              marginLeft: element.style.alignment === 'center' ? 'auto' : 
                          element.style.alignment === 'right' ? 'auto' : '0',
              marginRight: element.style.alignment === 'center' ? 'auto' : 
                           element.style.alignment === 'left' ? 'auto' : '0'
            }}
            className="transition-colors"
          >
            {element.content}
          </button>
        );
      
      case 'container':
        return (
          <div
            style={{
              backgroundColor: element.style.backgroundColor,
              borderRadius: `${element.style.borderRadius}px`,
              borderWidth: `${element.style.borderWidth}px`,
              borderColor: element.style.borderColor,
              borderStyle: 'solid',
              margin: `${element.style.margin}px 0`,
              padding: `${element.style.padding}px`,
              minHeight: `${element.style.minHeight}px`
            }}
          >
            {/* Container children would be rendered here */}
          </div>
        );
      
      case 'two-column':
        return (
          <div 
            className="grid md:grid-cols-2 gap-4"
            style={{
              backgroundColor: element.style.backgroundColor,
              margin: `${element.style.margin}px 0`,
              padding: `${element.style.padding}px`,
              gap: `${element.style.gap}px`
            }}
          >
            <div className="border border-gray-200 p-4 rounded-md min-h-[100px]"></div>
            <div className="border border-gray-200 p-4 rounded-md min-h-[100px]"></div>
          </div>
        );
      
      case 'form':
        return (
          <div
            style={{
              backgroundColor: element.style.backgroundColor,
              margin: `${element.style.margin}px 0`,
              padding: `${element.style.padding}px`
            }}
            className="space-y-4"
          >
            {element.fields.map(field => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea 
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                ) : (
                  <input 
                    type={field.type} 
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                )}
              </div>
            ))}
            <button 
              style={{
                backgroundColor: element.submitButton.backgroundColor,
                color: element.submitButton.color
              }}
              className="px-4 py-2 rounded-md font-medium transition-colors"
            >
              {element.submitButton.text}
            </button>
          </div>
        );
      
      case 'gallery':
        return (
          <div 
            className={`grid grid-cols-1 md:grid-cols-${element.style.columns}`}
            style={{
              margin: `${element.style.margin}px 0`,
              padding: `${element.style.padding}px`,
              gap: `${element.style.gap}px`
            }}
          >
            {element.images.map(image => (
              <img 
                key={image.id}
                src={image.src} 
                alt={image.alt}
                className="w-full h-auto rounded-md" 
              />
            ))}
          </div>
        );
        
      case 'video':
        return (
          <div
            style={{
              margin: `${element.style.margin}px 0`,
              padding: `${element.style.padding}px`,
              textAlign: getTextAlignment(element.style.alignment)
            }}
          >
            <iframe
              src={element.src}
              title={element.title}
              width={element.style.width}
              height="315"
              style={{
                borderRadius: `${element.style.borderRadius}px`
              }}
              allowFullScreen
              frameBorder="0"
              allow={`accelerometer; ${element.autoplay ? 'autoplay; ' : ''}clipboard-write; encrypted-media; gyroscope; picture-in-picture`}
            ></iframe>
          </div>
        );
        
      case 'link':
        return (
          <a
            href={element.href}
            target={element.target}
            style={{
              color: element.style.color,
              fontSize: getFontSize(element.style.fontSize),
              fontWeight: getFontWeight(element.style.fontWeight),
              textDecoration: element.style.textDecoration,
              margin: `${element.style.margin}px 0`,
              padding: `${element.style.padding}px`,
              display: 'block',
              textAlign: getTextAlignment(element.style.alignment)
            }}
            onClick={(e) => {
              if (!isPreviewMode) {
                e.preventDefault();
              }
            }}
          >
            {element.content}
          </a>
        );
        
      case 'table':
        return (
          <div
            style={{
              margin: `${element.style.margin}px 0`,
              padding: `${element.style.padding}px`,
              overflowX: 'auto'
            }}
          >
            <table
              style={{
                width: element.style.width,
                borderCollapse: 'collapse',
                fontSize: getFontSize(element.style.fontSize)
              }}
              className="border-collapse"
            >
              <thead>
                <tr>
                  {element.headers.map((header, index) => (
                    <th
                      key={index}
                      style={{
                        backgroundColor: element.style.headerBackgroundColor,
                        color: element.style.headerTextColor,
                        borderWidth: `${element.style.borderWidth}px`,
                        borderColor: element.style.borderColor,
                        borderStyle: 'solid',
                        padding: '8px',
                        textAlign: 'left'
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {element.data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        style={{
                          backgroundColor: element.style.rowBackgroundColor,
                          color: element.style.rowTextColor,
                          borderWidth: `${element.style.borderWidth}px`,
                          borderColor: element.style.borderColor,
                          borderStyle: 'solid',
                          padding: '8px'
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      default:
        return <div>Unknown element type</div>;
    }
  };
  
  // Helper functions for styling
  const getFontSize = (size: string) => {
    switch (size) {
      case 'small': return '0.875rem';
      case 'medium': return '1rem';
      case 'large': return '1.5rem';
      case 'extra-large': return '2rem';
      default: return '1rem';
    }
  };
  
  const getFontWeight = (weight: string) => {
    switch (weight) {
      case 'light': return '300';
      case 'normal': return '400';
      case 'bold': return '700';
      default: return '400';
    }
  };
  
  const getTextAlignment = (alignment: string) => {
    switch (alignment) {
      case 'left': return 'left';
      case 'center': return 'center';
      case 'right': return 'right';
      default: return 'left';
    }
  };

  return (
    <div 
      ref={ref}
      className={`
        relative ${isSelected && !isPreviewMode ? 'outline outline-2 outline-primary' : ''}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        p-2 rounded transition-opacity
      `}
      onClick={handleClick}
      style={{ cursor: isPreviewMode ? 'default' : 'pointer' }}
    >
      {renderElement()}
      
      {isSelected && !isPreviewMode && (
        <>
          {/* Selection overlay */}
          <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-primary rounded pointer-events-none"></div>
          
          {/* Resize handles */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-primary rounded-full -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full translate-x-1/2 translate-y-1/2"></div>
        </>
      )}
    </div>
  );
}
