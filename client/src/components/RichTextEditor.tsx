import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Superscript, 
  Subscript,
  List,
  ListOrdered,
  Save,
  Undo,
  Redo
} from 'lucide-react';
import { TextFormatting, ListType, FormattedRange } from '../types/element';

// Extended FormattedRange with text content for better detection
interface EnhancedFormattedRange extends FormattedRange {
  textContent: string; // The actual text content being formatted
}

interface RichTextEditorProps {
  content: string;
  textFormatting: TextFormatting;
  formattedRanges: FormattedRange[];
  listType?: ListType;
  onContentChange: (newContent: string) => void;
  onFormattingChange: (newFormatting: TextFormatting, selection: { start: number; end: number } | null) => void;
  onFormattedRangesChange: (newRanges: FormattedRange[]) => void;
  onListTypeChange?: (newListType: ListType) => void;
  onSave?: () => void;
}

// Type for history items
interface HistoryItem {
  content: string;
  formattedRanges: EnhancedFormattedRange[];
  listType: ListType;
  selection: { start: number; end: number } | null;
}

export default function RichTextEditor({ 
  content, 
  textFormatting,
  formattedRanges = [],
  listType = 'none',
  onContentChange, 
  onFormattingChange,
  onFormattedRangesChange,
  onListTypeChange,
  onSave
}: RichTextEditorProps) {
  const [selectedText, setSelectedText] = useState<{ start: number; end: number } | null>(null);
  // Using enhanced formatted ranges to track text content
  const [localFormattedRanges, setLocalFormattedRanges] = useState<EnhancedFormattedRange[]>(
    formattedRanges.map(range => ({
      ...range,
      textContent: content.substring(range.start, range.end)
    }))
  );
  const [previewContent, setPreviewContent] = useState<string>(content);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Add local list type state to track changes before saving
  const [localListType, setLocalListType] = useState<ListType>(listType);
  // Add local content state that can include list markers
  const [localContent, setLocalContent] = useState<string>(content);
  
  // Add history state for undo/redo functionality
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isUndoRedo, setIsUndoRedo] = useState(false);
  
  // Initialize or update formatted ranges when props change
  useEffect(() => {
    // Convert regular formatted ranges to enhanced ones
    const enhancedRanges = formattedRanges.map(range => ({
      ...range,
      textContent: content.substring(range.start, range.end)
    }));
    
    setLocalFormattedRanges(enhancedRanges);
    // Update local list type when props change
    setLocalListType(listType);
    // Update local content when props change
    setLocalContent(content);
    
    // Initialize history with current state if it's empty
    if (history.length === 0) {
      setHistory([{
        content,
        formattedRanges: enhancedRanges,
        listType,
        selection: null
      }]);
      setHistoryIndex(0);
    }
  }, [formattedRanges, content, listType]);
  
  // Update preview content when content or formatting changes
  useEffect(() => {
    const standardRanges = localFormattedRanges.map(({ textContent, ...rest }) => rest);
    setPreviewContent(applyAllFormattedRanges(localContent, standardRanges));
  }, [localContent, localFormattedRanges]);
  
  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for modifier key based on platform
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      
      if (modifier) {
        // Format shortcuts
        if (e.key === 'b' && selectedText) {
          e.preventDefault();
          handleFormattingChange('bold');
        } else if (e.key === 'i' && selectedText) {
          e.preventDefault();
          handleFormattingChange('italic');
        } else if (e.key === 'u' && selectedText) {
          e.preventDefault();
          handleFormattingChange('underline');
        } 
        // Undo/Redo shortcuts
        else if (e.key === 'z') {
          e.preventDefault();
          // Redo is Ctrl+Shift+Z or Ctrl+Y
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        } else if (e.key === 'y') {
          e.preventDefault();
          handleRedo();
        }
      }
    };
    
    // Add event listener to the textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown);
    }
    
    // Clean up event listener
    return () => {
      if (textarea) {
        textarea.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [selectedText, localFormattedRanges, localListType, localContent, history, historyIndex]);
  
  // Save current state to history when changes are made
  useEffect(() => {
    // Don't add to history if changes are from undo/redo
    if (isUndoRedo) {
      setIsUndoRedo(false);
      return;
    }
    
    // Don't add to history if nothing has changed
    if (history.length > 0 && historyIndex >= 0) {
      const currentState = history[historyIndex];
      if (
        currentState.content === localContent &&
        currentState.listType === localListType &&
        JSON.stringify(currentState.formattedRanges) === JSON.stringify(localFormattedRanges)
      ) {
        return;
      }
    }
    
    // Add current state to history
    const newHistoryItem: HistoryItem = {
      content: localContent,
      formattedRanges: localFormattedRanges,
      listType: localListType,
      selection: selectedText
    };
    
    // If we're not at the end of history, remove future states
    const newHistory = history.slice(0, historyIndex + 1);
    
    // Add new state and update index
    setHistory([...newHistory, newHistoryItem]);
    setHistoryIndex(newHistory.length);
  }, [localContent, localFormattedRanges, localListType, selectedText]);
  
  // Undo function
  const handleUndo = () => {
    if (historyIndex > 0) {
      setIsUndoRedo(true);
      const prevIndex = historyIndex - 1;
      const prevState = history[prevIndex];
      
      setLocalContent(prevState.content);
      setLocalFormattedRanges(prevState.formattedRanges);
      setLocalListType(prevState.listType);
      setSelectedText(prevState.selection);
      setHistoryIndex(prevIndex);
      setHasUnsavedChanges(true);
    }
  };
  
  // Redo function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedo(true);
      const nextIndex = historyIndex + 1;
      const nextState = history[nextIndex];
      
      setLocalContent(nextState.content);
      setLocalFormattedRanges(nextState.formattedRanges);
      setLocalListType(nextState.listType);
      setSelectedText(nextState.selection);
      setHistoryIndex(nextIndex);
      setHasUnsavedChanges(true);
    }
  };
  
  // Helper functions for list handling
  const isLinePartOfList = (line: string, type: ListType): boolean => {
    if (type === 'ordered') {
      return /^\d+\.\s/.test(line);
    } else if (type === 'unordered') {
      return /^[•●\-*]\s/.test(line);
    }
    return false;
  };
  
  const getLineListType = (line: string): ListType => {
    if (/^\d+\.\s/.test(line)) return 'ordered';
    if (/^[•●\-*]\s/.test(line)) return 'unordered';
    return 'none';
  };
  
  const removeListMarkers = (text: string): string => {
    return text.split('\n')
      .map(line => {
        // Remove ordered list markers (e.g., "1. ")
        if (/^\d+\.\s/.test(line)) {
          return line.replace(/^\d+\.\s/, '');
        }
        // Remove unordered list markers (e.g., "• ")
        if (/^[•●\-*]\s/.test(line)) {
          return line.replace(/^[•●\-*]\s/, '');
        }
        return line;
      })
      .join('\n');
  };
  
  const addListMarkers = (text: string, type: ListType): string => {
    // First, remove any existing list markers
    const cleanText = removeListMarkers(text);
    
    if (type === 'none') {
      return cleanText;
    }
    
    // Add new list markers based on the selected type
    return cleanText.split('\n')
      .map((line, index) => {
        if (line.trim() === '') return line; // Skip empty lines
        
        if (type === 'ordered') {
          return `${index + 1}. ${line}`;
        } else if (type === 'unordered') {
          return `• ${line}`;
        }
        
        return line;
      })
      .join('\n');
  };
  
  // Handle list type changes - modified to only update local state
  const handleListTypeChange = (newType: ListType) => {
    // Toggle list type if clicking the same button
    const toggledType = localListType === newType ? 'none' : newType;
    
    // Update the local content with list markers
    const newContent = addListMarkers(localContent, toggledType);
    
    // Update only local state, not parent component
    setLocalListType(toggledType);
    setLocalContent(newContent);
    
    // Focus on the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    
    // Mark changes as unsaved
    setHasUnsavedChanges(true);
  };
  
  // Handle content change - updated to use localContent
  const handleContentChange = (newContent: string) => {
    // Update local content instead of calling parent
    setLocalContent(newContent);
    setHasUnsavedChanges(true);
    
    // Restore logic for handling formatted ranges
    // If no formatting, nothing to reset
    if (localFormattedRanges.length === 0) return;
    
    // Case 1: Content was completely cleared
    if (newContent.trim() === '') {
      if (localFormattedRanges.length > 0) {
        // Reset local state
        setLocalFormattedRanges([]);
        return;
      }
    }
    
    // Check which formatted ranges are still valid
    const updatedRanges = localFormattedRanges.filter(range => {
      // Case 2: Check if formatted text still exists in the content
      if (!newContent.includes(range.textContent)) {
        return false;
      }
      
      // Case 3: Check if the current positions contain the same text
      if (range.end <= newContent.length) {
        const currentText = newContent.substring(range.start, range.end);
        // If text at these positions has changed completely, remove this range
        if (currentText !== range.textContent) {
          return false;
        }
      } else {
        // Range is now out of bounds
        return false;
      }
      
      return true;
    });
    
    // If any ranges were removed, update state
    if (updatedRanges.length < localFormattedRanges.length) {
      // Update local state
      setLocalFormattedRanges(updatedRanges);
    }
    
    // Check if list type needs to be updated based on content
    const lines = newContent.split('\n');
    const listTypes = lines.map(getLineListType);
    const domainType = findMostFrequentType(listTypes);
    
    if (domainType !== localListType) {
      setLocalListType(domainType);
    }
  };
  
  // Helper function to find the most frequent list type
  const findMostFrequentType = (types: ListType[]): ListType => {
    const counts = types.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<ListType, number>);
    
    // If 'none' is the most common, use it
    if (counts['none'] && counts['none'] === types.length) {
      return 'none';
    }
    
    // Filter out 'none' when counting
    // Create a new object without the 'none' entry
    const countsWithoutNone: Partial<Record<ListType, number>> = {};
    for (const [key, value] of Object.entries(counts)) {
      if (key !== 'none') {
        countsWithoutNone[key as ListType] = value;
      }
    }
    
    // If no other types, return 'none'
    if (Object.keys(countsWithoutNone).length === 0) {
      return 'none';
    }
    
    // Return the most frequent type
    return Object.entries(countsWithoutNone).sort((a, b) => b[1] - a[1])[0][0] as ListType;
  };
  
  const handleFormattingChange = (property: keyof TextFormatting) => {
    if (!selectedText) return;
    
    // Create new formatting based on current formatting
    const newFormatting = {
      ...textFormatting,
      [property]: !textFormatting[property]
    };
    
    // Add a new formatted range with the actual text content
    const selectedTextContent = content.substring(selectedText.start, selectedText.end);
    const newRange: EnhancedFormattedRange = {
      start: selectedText.start,
      end: selectedText.end,
      formatting: { ...newFormatting },
      textContent: selectedTextContent
    };
    
    // Check for overlapping ranges and merge or replace as needed
    const updatedRanges = addOrUpdateFormattedRange(localFormattedRanges, newRange);
    
    // Update local state
    setLocalFormattedRanges(updatedRanges);
    setHasUnsavedChanges(true);
    
    // Pass both the formatting and current selection state to parent
    onFormattingChange(newFormatting, selectedText);
  };
  
  const addOrUpdateFormattedRange = (ranges: EnhancedFormattedRange[], newRange: EnhancedFormattedRange): EnhancedFormattedRange[] => {
    // Filter out any completely overlapped ranges
    const filteredRanges = ranges.filter(range => 
      !(range.start >= newRange.start && range.end <= newRange.end)
    );
    
    // Check for partially overlapping ranges
    const overlappingRanges = filteredRanges.filter(range => 
      (range.start <= newRange.start && range.end > newRange.start) || 
      (range.start < newRange.end && range.end >= newRange.end)
    );
    
    // If we have overlapping ranges, we need to handle them
    if (overlappingRanges.length > 0) {
      // For simplicity, we'll just remove the overlapping ranges
      const nonOverlappingRanges = filteredRanges.filter(range => 
        !((range.start <= newRange.start && range.end > newRange.start) || 
          (range.start < newRange.end && range.end >= newRange.end))
      );
      
      // Add the new range
      return [...nonOverlappingRanges, newRange];
    }
    
    // No overlapping ranges, just add the new one
    return [...filteredRanges, newRange];
  };
  
  const handleTextSelection = (e: React.MouseEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start !== end) {
      const newSelection = { start, end };
      setSelectedText(newSelection);
      
      // Update formatting state based on what's already applied at this selection
      const existingFormatting = getFormattingAtPosition(start, end, localFormattedRanges);
      if (existingFormatting) {
        onFormattingChange(existingFormatting, newSelection);
      } else {
        // Default to current formatting if none exists
        onFormattingChange({ 
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          subscript: false,
          superscript: false 
        }, newSelection);
      }
    } else {
      setSelectedText(null);
      // Clear selection in parent
      onFormattingChange({ ...textFormatting }, null);
    }
  };
  
  const getFormattingAtPosition = (start: number, end: number, ranges: EnhancedFormattedRange[]): TextFormatting | null => {
    // Find ranges that completely overlap the current selection
    const overlappingRange = ranges.find(range => 
      range.start <= start && range.end >= end
    );
    
    return overlappingRange ? overlappingRange.formatting : null;
  };
  
  const applyAllFormattedRanges = (text: string, ranges: FormattedRange[]): string => {
    if (!ranges.length) return text;
    
    let result = text;
    // Sort ranges from end to start to avoid index shifting issues
    const sortedRanges = [...ranges].sort((a, b) => b.start - a.start);
    
    // Apply each range in order
    for (const range of sortedRanges) {
      // Skip invalid ranges
      if (range.start < 0 || range.end > text.length || range.start >= range.end) {
        continue;
      }
      
      const before = result.substring(0, range.start);
      let selected = result.substring(range.start, range.end);
      const after = result.substring(range.end);
      
      // Apply formatting to the selected text
      if (range.formatting.bold) selected = `<strong>${selected}</strong>`;
      if (range.formatting.italic) selected = `<em>${selected}</em>`;
      if (range.formatting.underline) selected = `<u>${selected}</u>`;
      if (range.formatting.strikethrough) selected = `<s>${selected}</s>`;
      if (range.formatting.subscript) selected = `<sub>${selected}</sub>`;
      if (range.formatting.superscript) selected = `<sup>${selected}</sup>`;
      
      result = before + selected + after;
    }
    
    return result;
  };
  
  // Update handleSave to include list type changes
  const handleSave = () => {
    // Convert enhanced ranges back to standard ranges for parent component
    const standardRanges: FormattedRange[] = localFormattedRanges.map(({ textContent, ...rest }) => rest);
    
    // Save all changes to parent component at once
    onContentChange(localContent);
    onFormattedRangesChange(standardRanges);
    
    // Apply list type changes if handler exists
    if (onListTypeChange) {
      onListTypeChange(localListType);
    }
    
    setHasUnsavedChanges(false);
    
    // Call the onSave callback if provided
    if (onSave) {
      onSave();
    }
  };

  // Update renderPreview to use localListType and localContent
  const renderPreview = () => {
    if (!localContent) return null;
    
    // For list type previews
    if (localListType !== 'none') {
      const standardRanges = localFormattedRanges.map(({ textContent, ...rest }) => rest);
      
      return (
        <div dangerouslySetInnerHTML={{ 
          __html: `<${localListType === 'ordered' ? 'ol' : 'ul'}>
                  ${removeListMarkers(localContent).split('\n').map(line => {
                    if (line.trim() === '') return '';
                    // Apply formatting to each line
                    const formattedLine = applyAllFormattedRanges(line, standardRanges);
                    return `<li>${formattedLine}</li>`;
                  }).filter(line => line !== '').join('')}
                 </${localListType === 'ordered' ? 'ol' : 'ul'}>` 
        }} />
      );
    }
    
    // For regular text with formatting
    return (
      <div dangerouslySetInnerHTML={{ 
        __html: previewContent.split('\n').map(line => `<p>${line || '<br>'}</p>`).join('') 
      }} />
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 mb-2 justify-between">
        <div className="flex flex-wrap gap-1">
          <Button
            size="icon"
            variant={selectedText && textFormatting.bold ? "default" : "outline"}
            className="w-8 h-8 p-0"
            onClick={() => handleFormattingChange('bold')}
            title="Bold (Ctrl+B)"
            disabled={!selectedText}
          >
            <Bold className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            variant={selectedText && textFormatting.italic ? "default" : "outline"}
            className="w-8 h-8 p-0"
            onClick={() => handleFormattingChange('italic')}
            title="Italic (Ctrl+I)"
            disabled={!selectedText}
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            variant={selectedText && textFormatting.underline ? "default" : "outline"}
            className="w-8 h-8 p-0"
            onClick={() => handleFormattingChange('underline')}
            title="Underline (Ctrl+U)"
            disabled={!selectedText}
          >
            <Underline className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            variant={selectedText && textFormatting.strikethrough ? "default" : "outline"}
            className="w-8 h-8 p-0"
            onClick={() => handleFormattingChange('strikethrough')}
            title="Strikethrough"
            disabled={!selectedText}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            variant={selectedText && textFormatting.superscript ? "default" : "outline"}
            className="w-8 h-8 p-0"
            onClick={() => handleFormattingChange('superscript')}
            title="Superscript"
            disabled={!selectedText}
          >
            <Superscript className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            variant={selectedText && textFormatting.subscript ? "default" : "outline"}
            className="w-8 h-8 p-0"
            onClick={() => handleFormattingChange('subscript')}
            title="Subscript"
            disabled={!selectedText}
          >
            <Subscript className="h-4 w-4" />
          </Button>
          
          {onListTypeChange && (
            <>
              <Button
                size="icon"
                variant={localListType === 'unordered' ? "default" : "outline"}
                className="w-8 h-8 p-0"
                onClick={() => handleListTypeChange('unordered')}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              
              <Button
                size="icon"
                variant={localListType === 'ordered' ? "default" : "outline"}
                className="w-8 h-8 p-0"
                onClick={() => handleListTypeChange('ordered')}
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {/* Undo/Redo buttons */}
          <Button
            size="icon"
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={handleUndo}
            title="Undo (Ctrl+Z)"
            disabled={historyIndex <= 0}
          >
            <Undo className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            variant="outline"
            className="w-8 h-8 p-0"
            onClick={handleRedo}
            title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Save button */}
        <Button
          size="sm"
          onClick={handleSave}
          className="flex items-center gap-1"
          variant={hasUnsavedChanges ? "default" : "outline"}
          disabled={!hasUnsavedChanges}
        >
          <Save className="h-4 w-4" />
          Apply
        </Button>
      </div>
      
      <textarea
        ref={textareaRef}
        value={localContent}
        onChange={(e) => handleContentChange(e.target.value)}
        onMouseUp={handleTextSelection}
        onKeyUp={handleTextSelection}
        className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter text here..."
      />
      
      <div className="mt-2 text-xs text-gray-500">
        <p className="font-medium"><span className="font-semibold">Ctrl+B</span> (Bold), <span className="font-semibold">Ctrl+I</span> (Italic), <span className="font-semibold">Ctrl+U</span> (Underline)</p>
        {localListType !== 'none' && (
          <p className="mt-1">
            <strong>List type:</strong> {localListType === 'ordered' ? 'Numbered List' : 'Bullet List'}
          </p>
        )}
      </div>
      
      {/* Preview of formatted content */}
      {localContent && (
        <div className="mt-3 p-3 border border-gray-200 rounded-md bg-gray-50">
          <h4 className="text-sm font-medium mb-1">Preview:</h4>
          <div className="rich-text-preview">
            {renderPreview()}
          </div>
        </div>
      )}
    </div>
  );
}