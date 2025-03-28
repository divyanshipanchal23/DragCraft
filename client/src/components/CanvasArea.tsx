import { useDrop } from 'react-dnd';
import { useBuilder } from '../context/BuilderContext';
import DropZone from './DropZone';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ElementType } from '../types/element';

export default function CanvasArea() {
  const { state, addElement } = useBuilder();
  const { isPreviewMode, viewMode } = state;
  
  // Get the current template
  const currentTemplate = state.templates.find(t => t.id === state.currentTemplateId);
  
  // Get container classes based on view mode
  const getContainerClass = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-5xl';
    }
  };
  
  return (
    <div className="flex-1 overflow-y-auto relative bg-gray-50">
      {/* Template Header */}
      <div className="bg-white p-4 border-b border-gray-200 shadow-sm flex justify-between items-center">
        <h2 className="font-medium">Canvas</h2>
        {!isPreviewMode && (
          <div className="hidden md:flex space-x-2">
            <Select defaultValue="Template 1">
              <SelectTrigger className="text-xs h-8 w-36">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Template 1">Template 1</SelectItem>
                <SelectItem value="Template 2">Template 2</SelectItem>
                <SelectItem value="Template 3">Template 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      {/* Canvas with grid background */}
      <div className={`p-4 ${!isPreviewMode ? 'grid-guide' : ''}`} id="canvas-dropzone">
        <div className={`${getContainerClass()} mx-auto min-h-screen bg-white shadow-md border border-gray-200 rounded-md overflow-hidden`}>
          {/* Template Structure */}
          {currentTemplate && (
            <>
              <header className="relative p-8 bg-gray-100 border-b border-gray-200 text-center">
                {/* Header drop zone */}
                <DropZone 
                  id={currentTemplate.dropZones[0].id} 
                  className="min-h-[120px] flex items-center justify-center" 
                  placeholderText="Drag and drop header elements here"
                />
              </header>
              
              <main className="p-8">
                {/* Main content area with grid layout */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Left column */}
                  <DropZone 
                    id={currentTemplate.dropZones[1].id} 
                    className="min-h-[200px] flex flex-col justify-center p-4" 
                    placeholderText="Drag and drop content elements here"
                  />
                  
                  {/* Right column */}
                  <DropZone 
                    id={currentTemplate.dropZones[2].id} 
                    className="min-h-[200px] flex items-center justify-center p-4" 
                    placeholderText="Drag and drop content elements here"
                  />
                </div>
                
                {/* Second row */}
                <DropZone 
                  id={currentTemplate.dropZones[3].id} 
                  className="min-h-[120px] flex items-center justify-center p-4 mb-8" 
                  placeholderText="Drag and drop elements here"
                />
                
                {/* Third row */}
                <DropZone 
                  id={currentTemplate.dropZones[4].id} 
                  className="min-h-[150px] flex items-center justify-center" 
                  placeholderText="Drag and drop elements here"
                />
              </main>
              
              <footer className="p-8 bg-gray-800 text-white">
                {/* Footer drop zone */}
                <DropZone 
                  id={currentTemplate.dropZones[5].id} 
                  className="min-h-[100px] flex items-center justify-center" 
                  placeholderText="Drag and drop footer elements here"
                />
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
