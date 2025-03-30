import { useRef, useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useBuilder } from '../context/BuilderContext';
import { 
  Element, 
  FormattedRange, 
  TextFormatting, 
  ListType, 
  ImageElement, 
  ContainerElement, 
  VideoElement, 
  TableElement, 
  HeadingElement, 
  ParagraphElement, 
  ButtonElement, 
  LinkElement 
} from '../types/element';
import ResizeHandles, { HandlePosition } from './ResizeHandles';
import { addYouTubeParams, getImagePlaceholder, processImageUrl } from '../utils/url-helpers';
import { Video, Image as ImageIcon } from 'lucide-react';

interface PlacedElementProps {
  id: string;
}

export default function PlacedElement({ id }: PlacedElementProps) {
  const { state, selectElement, moveElement, updateElement } = useBuilder();
  const element = state.elements[id] as Element;
  const isSelected = state.selectedElementId === id;
  const isPreviewMode = state.isPreviewMode;
  
  const ref = useRef<HTMLDivElement>(null);
  
  // Add state for resizing
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<HandlePosition | null>(null);
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [startMousePosition, setStartMousePosition] = useState({ x: 0, y: 0 });
  
  // Set up drag and drop
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PLACED_ELEMENT',
    item: { id, parentId: element.parentId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
    canDrag: !isPreviewMode && !isResizing
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
  
  // Resize handlers
  const handleResizeStart = (handle: HandlePosition, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!ref.current) return;
    
    // Immediately set resizing state to provide instant feedback
    setIsResizing(true);
    setActiveHandle(handle);
    
    // Get element's current dimensions and position
    const rect = ref.current.getBoundingClientRect();
    setStartSize({ 
      width: rect.width, 
      height: rect.height 
    });
    setStartPosition({ 
      x: element.position.x, 
      y: element.position.y 
    });
    setStartMousePosition({
      x: e.clientX,
      y: e.clientY
    });
    
    // Add class to body to disable transitions during resize
    document.body.classList.add('is-resizing');
    
    // Store initial position to use in move handler
    const initialMousePosition = { x: e.clientX, y: e.clientY };
    const initialElementSize = { width: rect.width, height: rect.height };
    
    // Variables to store the resize state across frames
    let frameId: number | null = null;
    let lastX = initialMousePosition.x;
    let lastY = initialMousePosition.y;
    
    // Use a more efficient resize move handler
    const optimizedResizeMove = (moveEvent: MouseEvent) => {
      lastX = moveEvent.clientX;
      lastY = moveEvent.clientY;
      
      // If no animation frame is scheduled, request one
      if (frameId === null) {
        frameId = requestAnimationFrame(() => {
          frameId = null;
          if (!ref.current) return;
          
          const deltaX = lastX - initialMousePosition.x;
          const deltaY = lastY - initialMousePosition.y;
          
          // Apply changes based on which handle is being dragged
          if (handle.includes('right')) {
            const newWidth = Math.max(100, initialElementSize.width + deltaX);
            ref.current.style.width = `${newWidth}px`;
          }
          if (handle.includes('bottom')) {
            const newHeight = Math.max(50, initialElementSize.height + deltaY);
            ref.current.style.height = `${newHeight}px`;
          }
          if (handle.includes('left')) {
            const newWidth = Math.max(100, initialElementSize.width - deltaX);
            ref.current.style.width = `${newWidth}px`;
          }
          if (handle.includes('top')) {
            const newHeight = Math.max(50, initialElementSize.height - deltaY);
            ref.current.style.height = `${newHeight}px`;
          }
        });
      }
    };
    
    // Resize end handler
    const optimizedResizeEnd = (e: MouseEvent) => {
      // Clean up event listeners
      document.removeEventListener('mousemove', optimizedResizeMove);
      document.removeEventListener('mouseup', optimizedResizeEnd);
      
      // Cancel any pending animation frame
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
      
      // Remove body class
      document.body.classList.remove('is-resizing');
      
      if (!ref.current) {
        setIsResizing(false);
        setActiveHandle(null);
        return;
      }
      
      // Get final dimensions
      const rect = ref.current.getBoundingClientRect();
      
      // Apply updates based on element type
      let updates: Partial<Element> = { };
      
      // Different element types need different style updates
      switch (element.type) {
        case 'image':
          updates = {
            style: {
              ...element.style,
              width: `${rect.width}px`,
              height: `${rect.height}px`
            }
          } as Partial<ImageElement>;
          break;
        
        case 'container':
          updates = {
            style: {
              ...element.style,
              minHeight: rect.height
            }
          } as Partial<ContainerElement>;
          break;
          
        case 'video':
          updates = {
            style: {
              ...element.style,
              width: `${rect.width}px`
            }
          } as Partial<VideoElement>;
          break;
          
        case 'table':
          updates = {
            style: {
              ...element.style,
              width: `${rect.width}px`
            }
          } as Partial<TableElement>;
          break;
          
        default:
          // For text elements, adjust padding to control width
          if (element.type === 'heading' || element.type === 'paragraph') {
            const textElement = element as HeadingElement | ParagraphElement;
            updates = {
              style: {
                ...textElement.style,
                padding: Math.max(8, textElement.style.padding + (rect.width - initialElementSize.width) / 10)
              }
            };
          } else if (element.type === 'button') {
            const buttonElement = element as ButtonElement;
            updates = {
              style: {
                ...buttonElement.style,
                padding: Math.max(8, buttonElement.style.padding + (rect.width - initialElementSize.width) / 10)
              }
            };
          } else if (element.type === 'link') {
            const linkElement = element as LinkElement;
            updates = {
              style: {
                ...linkElement.style,
                padding: Math.max(8, linkElement.style.padding + (rect.width - initialElementSize.width) / 10)
              }
            };
          }
      }
      
      // Update the element
      updateElement(id, updates);
      
      // Reset resize state
      setIsResizing(false);
      setActiveHandle(null);
      
      // Reset inline styles
      if (ref.current) {
        ref.current.style.width = '';
        ref.current.style.height = '';
      }
    };
    
    // Add event listeners
    document.addEventListener('mousemove', optimizedResizeMove, { passive: true });
    document.addEventListener('mouseup', optimizedResizeEnd);
  };
  
  // Clean up event listeners if component unmounts while resizing
  useEffect(() => {
    // No need for cleanup here since our event listeners are now local to the handleResizeStart function
    return () => {
      // Just make sure to remove the body class if component unmounts during resize
      if (isResizing) {
        document.body.classList.remove('is-resizing');
      }
    };
  }, [isResizing]);
  
  // Render element based on type
  const renderElement = () => {
    switch (element.type) {
      case 'heading': {
        const headingLevel = getFontSizeHeadingLevel(element.style.fontSize);
        const HeadingTag = `h${headingLevel}` as keyof JSX.IntrinsicElements;
        const formattedContent = element.richText
          ? applyFormattedRanges(element.content, element.formattedRanges || [])
          : element.content;

        return (
          <HeadingTag
            style={{
              ...element.style,
              fontWeight: getFontWeight(element.style.fontWeight),
              fontSize: getFontSize(element.style.fontSize),
              fontFamily: getFontFamily(element.style.fontFamily || 'Arial'),
              textAlign: element.style.alignment,
              color: element.style.color,
            }}
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        );
      }
      
      case 'paragraph': {
        let finalContent = element.content;

        // Apply formatted ranges first
        if (element.richText) {
          finalContent = applyFormattedRanges(element.content, element.formattedRanges || []);
        }

        // Then handle list type formatting after ranges have been applied
        if (element.listType && element.listType !== 'none') {
          const listItems = finalContent.split('\n').map(line => `<li>${line}</li>`).join('');
          finalContent = `<${element.listType === 'ordered' ? 'ol' : 'ul'}>${listItems}</${element.listType === 'ordered' ? 'ol' : 'ul'}>`;
        }

        return (
          <p
            style={{
              ...element.style,
              fontWeight: getFontWeight(element.style.fontWeight),
              fontSize: getFontSize(element.style.fontSize),
              fontFamily: getFontFamily(element.style.fontFamily || 'Arial'),
              textAlign: element.style.alignment,
              color: element.style.color,
            }}
            dangerouslySetInnerHTML={{ __html: finalContent }}
          />
        );
      }
      
      case 'image':
        const processedImageSrc = processImageUrl(element.src);
        return (
          <div className="image-container relative">
            {element.src ? (
              <img
                src={processedImageSrc}
                alt={element.alt}
                style={{
                  width: element.style.width,
                  height: element.style.height,
                  borderRadius: `${element.style.borderRadius}px`,
                  margin: `${element.style.margin}px 0`,
                  padding: `${element.style.padding}px`
                }}
                className="max-w-full"
                onError={(e) => {
                  // If image fails to load, replace with placeholder
                  const target = e.target as HTMLImageElement;
                  console.error(`Failed to load image from: ${processedImageSrc}`);
                  target.src = getImagePlaceholder();
                  target.alt = "Image failed to load";
                }}
              />
            ) : (
              <div 
                className="bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center" 
                style={{
                  width: element.style.width || '100%',
                  height: element.style.height || '200px',
                  borderRadius: `${element.style.borderRadius}px`,
                  margin: `${element.style.margin}px 0`,
                  padding: `${element.style.padding}px`
                }}
              >
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
        );
      
      case 'button': {
        return (
          <button
            style={{
              backgroundColor: element.style.backgroundColor,
              color: element.style.color,
              fontSize: getFontSize(element.style.fontSize),
              fontWeight: getFontWeight(element.style.fontWeight),
              fontFamily: getFontFamily(element.style.fontFamily || 'Arial'),
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
      }
      
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
            {element.images.length > 0 ? (
              element.images.map(image => {
                const processedGallerySrc = processImageUrl(image.src);
                return (
                  <div key={image.id} className="gallery-image-container relative">
                    <img 
                      src={processedGallerySrc} 
                      alt={image.alt}
                      className="w-full h-auto rounded-md" 
                      onError={(e) => {
                        // If image fails to load, replace with placeholder
                        const target = e.target as HTMLImageElement;
                        console.error(`Failed to load gallery image from: ${processedGallerySrc}`);
                        target.src = getImagePlaceholder(300, 200);
                        target.alt = "Image failed to load";
                      }}
                    />
                  </div>
                );
              })
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 flex items-center justify-center col-span-full">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No gallery images</p>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'video':
        // Process YouTube URL to support autoplay, controls, loop, and muted
        const videoElement = element as VideoElement;
        let videoSrc = videoElement.src;
        
        // Add appropriate parameters to the video source URL
        if (videoSrc.includes('youtube.com/embed/')) {
          videoSrc = addYouTubeParams(videoSrc, {
            controls: videoElement.controls,
            autoplay: videoElement.autoplay,
            loop: videoElement.loop,
            muted: videoElement.muted
          });
        }
        
        return (
          <div
            style={{
              margin: `${element.style.margin}px 0`,
              padding: `${element.style.padding}px`,
              textAlign: getTextAlignment(element.style.alignment)
            }}
          >
            {videoSrc ? (
              <iframe
                src={videoSrc}
                title={videoElement.title || 'Embedded video'}
                width={videoElement.style.width}
                height="315"
                style={{
                  borderRadius: `${videoElement.style.borderRadius}px`,
                  maxWidth: '100%'
                }}
                allowFullScreen
                frameBorder="0"
                allow={`accelerometer; ${videoElement.autoplay ? 'autoplay; ' : ''}clipboard-write; encrypted-media; gyroscope; picture-in-picture`}
              ></iframe>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center" style={{ height: '200px', width: '100%' }}>
                <Video className="h-12 w-12 text-gray-400" />
              </div>
            )}
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
  const applyRichTextFormatting = (
    content: string, 
    textFormatting?: TextFormatting, 
    listType?: ListType,
    selection?: { start: number; end: number }
  ) => {
    if (!content) return content;
    
    // Handle list formatting
    if (listType && listType !== 'none') {
      const lines = content.split('\n');
      const formattedLines = lines.map(line => {
        let formattedLine = line;
        if (textFormatting) {
          formattedLine = applyInlineFormatting(formattedLine, textFormatting);
        }
        return `<li>${formattedLine}</li>`;
      }).join('');
      
      return `<${listType === 'ordered' ? 'ol' : 'ul'}>${formattedLines}</${listType === 'ordered' ? 'ol' : 'ul'}>`;
    }
    
    // Handle selected text formatting
    if (selection && textFormatting) {
      const before = content.slice(0, selection.start);
      const selected = content.slice(selection.start, selection.end);
      const after = content.slice(selection.end);
      
      // Apply formatting only to selected text
      const formattedSelection = applyInlineFormatting(selected, textFormatting);
      return before + formattedSelection + after;
    }
    
    // Handle full text formatting (backward compatibility)
    return textFormatting ? applyInlineFormatting(content, textFormatting) : content;
  };

  // Helper function to apply inline formatting
  const applyInlineFormatting = (text: string, formatting: TextFormatting): string => {
    let result = text;
    
    // Apply each formatting option
    // Order matters to ensure proper nesting of tags
    if (formatting.bold) result = `<strong>${result}</strong>`;
    if (formatting.italic) result = `<em>${result}</em>`;
    if (formatting.underline) result = `<u>${result}</u>`;
    if (formatting.strikethrough) result = `<s>${result}</s>`;
    if (formatting.subscript) result = `<sub>${result}</sub>`;
    if (formatting.superscript) result = `<sup>${result}</sup>`;
    
    return result;
  };

  const getFontSize = (size: string) => {
    // Check if size is one of the legacy enum values
    switch (size) {
      case 'small': return '0.875rem';
      case 'medium': return '1rem';
      case 'large': return '1.5rem';
      case 'extra-large': return '2rem';
    }
    
    // If it's a numeric value with units, return as is
    if (/^[\d.]+(px|rem|em|%|pt|vw|vh)$/.test(size)) {
      return size;
    }
    
    // If it's just a number, assume pixels
    if (/^\d+$/.test(size)) {
      return `${size}px`;
    }
    
    // Default fallback
    return '1rem';
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

  const getFontFamily = (family: string) => {
    // If font name has spaces, wrap in quotes
    return family.includes(' ') ? `"${family}"` : family;
  };

  // Apply formatted ranges to content
  const applyFormattedRanges = (content: string, ranges: FormattedRange[]): string => {
    // If there are no ranges or content is empty, return as is
    if (!ranges.length || !content) return content;
    
    // Sort ranges from last to first by start position
    // This ensures we apply formatting from the end of the string first
    // to avoid affecting the indices of other ranges
    const sortedRanges = [...ranges].sort((a, b) => b.start - a.start);
    
    let result = content;

    // Apply formatting from last to first to handle nested formats
    for (const range of sortedRanges) {
      // Skip invalid ranges
      if (range.start < 0 || range.end > content.length || range.start >= range.end) {
        continue;
      }
      
      const before = result.slice(0, range.start);
      const formatted = applyFormatting(
        result.slice(range.start, range.end),
        range.formatting
      );
      const after = result.slice(range.end);
      result = before + formatted + after;
    }

    return result;
  };

  const applyFormatting = (text: string, formatting: TextFormatting): string => {
    let result = text;
    if (formatting.bold) result = `<strong>${result}</strong>`;
    if (formatting.italic) result = `<em>${result}</em>`;
    if (formatting.underline) result = `<u>${result}</u>`;
    if (formatting.strikethrough) result = `<s>${result}</s>`;
    if (formatting.subscript) result = `<sub>${result}</sub>`;
    if (formatting.superscript) result = `<sup>${result}</sup>`;
    return result;
  };

  // Add the missing getFontSizeHeadingLevel function
  const getFontSizeHeadingLevel = (size: string) => {
    // Convert font size to appropriate heading level (h1-h6)
    const numericSize = parseFloat(size);
    
    if (size.includes('px')) {
      if (numericSize >= 32) return 1;
      if (numericSize >= 24) return 2;
      if (numericSize >= 20) return 3;
      if (numericSize >= 18) return 4;
      if (numericSize >= 16) return 5;
      return 6;
    }
    
    if (size.includes('rem') || size.includes('em')) {
      if (numericSize >= 2) return 1;
      if (numericSize >= 1.5) return 2;
      if (numericSize >= 1.25) return 3;
      if (numericSize >= 1.125) return 4;
      if (numericSize >= 1) return 5;
      return 6;
    }
    
    // Handle legacy values
    switch (size) {
      case 'extra-large': return 1;
      case 'large': return 2;
      case 'medium': return 3;
      case 'small': return 4;
      default: return 2; // Default to h2
    }
  };

  return (
    <div 
      ref={ref}
      className={`
        relative element-enter
        ${isSelected && !isPreviewMode ? 'element-selected' : ''}
        ${isDragging ? 'dragging-element' : 'opacity-100'}
        ${isResizing ? 'resize-active no-select' : ''}
        p-2 rounded-md transition-all duration-200 hover:shadow-sm
      `}
      onClick={handleClick}
      style={{ 
        cursor: isPreviewMode ? 'default' : isResizing ? 'move' : 'pointer',
        userSelect: isResizing ? 'none' : 'auto' // Prevent text selection during resize
      }}
    >
      {renderElement()}
      
      {/* Add ResizeHandles component instead of the simple divs */}
      {!isPreviewMode && (
        <ResizeHandles 
          isSelected={isSelected}
          onResizeStart={handleResizeStart}
          showAllHandles={element.type === 'container' || element.type === 'image'}
        />
      )}
    </div>
  );
}
