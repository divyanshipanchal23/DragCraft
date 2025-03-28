import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Superscript, 
  Subscript,
  List,
  ListOrdered
} from 'lucide-react';
import { TextFormatting, ListType } from '../types/element';

interface RichTextEditorProps {
  content: string;
  textFormatting: TextFormatting;
  listType?: ListType;
  onContentChange: (newContent: string) => void;
  onFormattingChange: (newFormatting: TextFormatting) => void;
  onListTypeChange?: (newListType: ListType) => void;
}

export default function RichTextEditor({ 
  content, 
  textFormatting,
  listType = 'none',
  onContentChange, 
  onFormattingChange,
  onListTypeChange
}: RichTextEditorProps) {
  const [selectedText, setSelectedText] = useState<{ start: number; end: number } | null>(null);
  
  const handleFormattingChange = (property: keyof TextFormatting) => {
    onFormattingChange({
      ...textFormatting,
      [property]: !textFormatting[property]
    });
  };
  
  const handleListTypeChange = (type: ListType) => {
    if (onListTypeChange) {
      onListTypeChange(listType === type ? 'none' : type);
    }
  };
  
  const handleTextSelection = (e: React.MouseEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start !== end) {
      setSelectedText({ start, end });
    } else {
      setSelectedText(null);
    }
  };

  const renderContent = () => {
    let displayContent = content;
    
    // Apply formatting based on selected text for preview purposes
    if (selectedText && selectedText.start !== selectedText.end) {
      const beforeSelection = displayContent.substring(0, selectedText.start);
      const selection = displayContent.substring(selectedText.start, selectedText.end);
      const afterSelection = displayContent.substring(selectedText.end);
      
      let formattedSelection = selection;
      
      if (textFormatting.bold) {
        formattedSelection = `<strong>${formattedSelection}</strong>`;
      }
      
      if (textFormatting.italic) {
        formattedSelection = `<em>${formattedSelection}</em>`;
      }
      
      if (textFormatting.underline) {
        formattedSelection = `<u>${formattedSelection}</u>`;
      }
      
      if (textFormatting.strikethrough) {
        formattedSelection = `<s>${formattedSelection}</s>`;
      }
      
      if (textFormatting.subscript) {
        formattedSelection = `<sub>${formattedSelection}</sub>`;
      }
      
      if (textFormatting.superscript) {
        formattedSelection = `<sup>${formattedSelection}</sup>`;
      }
      
      displayContent = beforeSelection + formattedSelection + afterSelection;
    }
    
    return displayContent;
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 mb-2">
        <Button
          size="icon"
          variant={textFormatting.bold ? "default" : "outline"}
          className="w-8 h-8 p-0"
          onClick={() => handleFormattingChange('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          size="icon"
          variant={textFormatting.italic ? "default" : "outline"}
          className="w-8 h-8 p-0"
          onClick={() => handleFormattingChange('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          size="icon"
          variant={textFormatting.underline ? "default" : "outline"}
          className="w-8 h-8 p-0"
          onClick={() => handleFormattingChange('underline')}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <Button
          size="icon"
          variant={textFormatting.strikethrough ? "default" : "outline"}
          className="w-8 h-8 p-0"
          onClick={() => handleFormattingChange('strikethrough')}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        
        <Button
          size="icon"
          variant={textFormatting.superscript ? "default" : "outline"}
          className="w-8 h-8 p-0"
          onClick={() => handleFormattingChange('superscript')}
          title="Superscript"
        >
          <Superscript className="h-4 w-4" />
        </Button>
        
        <Button
          size="icon"
          variant={textFormatting.subscript ? "default" : "outline"}
          className="w-8 h-8 p-0"
          onClick={() => handleFormattingChange('subscript')}
          title="Subscript"
        >
          <Subscript className="h-4 w-4" />
        </Button>
        
        {onListTypeChange && (
          <>
            <Button
              size="icon"
              variant={listType === 'unordered' ? "default" : "outline"}
              className="w-8 h-8 p-0"
              onClick={() => handleListTypeChange('unordered')}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            
            <Button
              size="icon"
              variant={listType === 'ordered' ? "default" : "outline"}
              className="w-8 h-8 p-0"
              onClick={() => handleListTypeChange('ordered')}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        onMouseUp={handleTextSelection}
        onKeyUp={handleTextSelection}
        className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter text here..."
      />
      
      <div className="mt-2 text-xs text-gray-500">
        <p>Formatting will be applied to selected text when saved.</p>
        {listType !== 'none' && (
          <p className="mt-1">
            <strong>List type:</strong> {listType === 'ordered' ? 'Numbered List' : 'Bullet List'}
          </p>
        )}
      </div>
      
      {/* Preview of formatted content */}
      {content && (
        <div className="mt-3 p-3 border border-gray-200 rounded-md bg-gray-50">
          <h4 className="text-sm font-medium mb-1">Preview:</h4>
          <div 
            className="rich-text-preview"
            dangerouslySetInnerHTML={{ 
              __html: listType !== 'none' 
                ? `<${listType === 'ordered' ? 'ol' : 'ul'}>
                    ${content.split('\n').map(line => `<li>${line}</li>`).join('')}
                   </${listType === 'ordered' ? 'ol' : 'ul'}>` 
                : renderContent().split('\n').map(line => `<p>${line}</p>`).join('')
            }} 
          />
        </div>
      )}
    </div>
  );
}