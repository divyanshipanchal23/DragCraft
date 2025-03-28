import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Heading1, Type, Image, MousePointerClick, Box, Columns2, 
  FileSpreadsheet, LayoutGrid, Video, Link, Table, Search,
  Clock, History
} from 'lucide-react';
import DraggableElement from './DraggableElement';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useBuilder } from '../context/BuilderContext';
import { ElementType } from '../types/element';
import { getElementsToolboxItems } from '../utils/element-templates';
import { cn } from '@/lib/utils';

export default function ElementsToolbox() {
  const { state } = useBuilder();
  const { isPreviewMode } = state;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredElements, setFilteredElements] = useState<{
    basicElements: ElementType[],
    mediaElements: ElementType[],
    componentElements: ElementType[]
  }>({
    basicElements: [],
    mediaElements: [],
    componentElements: []
  });
  
  // Group elements by category
  const basicElements: ElementType[] = ['heading', 'paragraph', 'image', 'button', 'link'];
  const mediaElements: ElementType[] = ['video', 'table'];
  const componentElements: ElementType[] = ['form', 'gallery'];
  
  // Map element types to friendly names for search
  const elementNameMap: Record<ElementType, string> = {
    'heading': 'Heading Title Text H1 H2 H3',
    'paragraph': 'Paragraph Text Content Body',
    'image': 'Image Picture Photo',
    'button': 'Button CTA Action',
    'link': 'Link Hyperlink URL',
    'video': 'Video Media Player',
    'table': 'Table Grid Data Spreadsheet',
    'form': 'Form Contact Input Fields',
    'gallery': 'Gallery Photos Collection',
    'container': 'Container Box Wrapper',
    'two-column': 'Two Column Layout'
  };
  
  // Filter elements based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredElements({
        basicElements,
        mediaElements,
        componentElements
      });
      return;
    }
    
    const query = searchQuery.toLowerCase();
    
    const filterElementsByQuery = (elements: ElementType[]) => {
      return elements.filter(element => 
        element.toLowerCase().includes(query) || 
        elementNameMap[element].toLowerCase().includes(query)
      );
    };
    
    setFilteredElements({
      basicElements: filterElementsByQuery(basicElements),
      mediaElements: filterElementsByQuery(mediaElements),
      componentElements: filterElementsByQuery(componentElements)
    });
  }, [searchQuery]);
  
  if (isPreviewMode) return null;
  
  const hasFilteredElements = 
    filteredElements.basicElements.length > 0 || 
    filteredElements.mediaElements.length > 0 || 
    filteredElements.componentElements.length > 0;
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-full md:w-64 md:flex-shrink-0 overflow-y-auto">
        <div className="p-4 space-y-4">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Elements</h2>
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="text"
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
            {searchQuery && (
              <div 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer"
                onClick={() => setSearchQuery('')}
              >
                ×
              </div>
            )}
          </div>
          
          {!hasFilteredElements && searchQuery && (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <p>No elements match your search</p>
              <p className="text-xs mt-1">Try a different keyword</p>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Recent Elements */}
            {!searchQuery && state.recentElements.length > 0 && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium mb-2 flex items-center justify-between">
                  <span className="flex items-center">
                    <History className="h-3 w-3 mr-1" />
                    Recently Used
                  </span>
                  <Badge variant="outline" className="ml-2 text-xs font-normal">
                    {state.recentElements.length}
                  </Badge>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {state.recentElements.map((type, index) => (
                    <div key={`recent-${type}`} className="relative">
                      <DraggableElement 
                        type={type} 
                        label={type.charAt(0).toUpperCase() + type.slice(1)} 
                      />
                      <div className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-primary rounded-full text-[10px] text-white font-bold shadow-sm recent-badge">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {!searchQuery && state.recentElements.length > 0 && (
              <Separator className="my-2" />
            )}
            
            {/* Basic Elements */}
            {filteredElements.basicElements.length > 0 && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium mb-2 flex items-center justify-between">
                  Basic
                  <Badge variant="outline" className="ml-2 text-xs font-normal">
                    {filteredElements.basicElements.length}
                  </Badge>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {filteredElements.basicElements.map(type => (
                    <DraggableElement key={type} type={type} label={type.charAt(0).toUpperCase() + type.slice(1)} />
                  ))}
                </div>
              </div>
            )}
            
            {filteredElements.basicElements.length > 0 && (filteredElements.mediaElements.length > 0 || filteredElements.componentElements.length > 0) && (
              <Separator className="my-2" />
            )}
            
            {/* Media Elements */}
            {filteredElements.mediaElements.length > 0 && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium mb-2 flex items-center justify-between">
                  Media
                  <Badge variant="outline" className="ml-2 text-xs font-normal">
                    {filteredElements.mediaElements.length}
                  </Badge>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {filteredElements.mediaElements.map(type => (
                    <DraggableElement key={type} type={type} label={type.charAt(0).toUpperCase() + type.slice(1)} />
                  ))}
                </div>
              </div>
            )}
            
            {filteredElements.mediaElements.length > 0 && filteredElements.componentElements.length > 0 && (
              <Separator className="my-2" />
            )}
            
            {/* Components */}
            {filteredElements.componentElements.length > 0 && (
              <div className="animate-in fade-in duration-300">
                <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-medium mb-2 flex items-center justify-between">
                  Components
                  <Badge variant="outline" className="ml-2 text-xs font-normal">
                    {filteredElements.componentElements.length}
                  </Badge>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {filteredElements.componentElements.map(type => (
                    <DraggableElement 
                      key={type} 
                      type={type} 
                      label={type === 'form' ? 'Contact Form' : type.charAt(0).toUpperCase() + type.slice(1)} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
