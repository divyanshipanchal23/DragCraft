import { useDrop } from 'react-dnd';
import { useBuilder } from '../context/BuilderContext';
import DropZone from './DropZone';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ElementType } from '../types/element';
import { defaultTemplateId, template2Id, template3Id } from '../utils/element-templates';

export default function CanvasArea() {
  const { state, addElement, setTemplate } = useBuilder();
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
  
  // Get template value for the Select component
  const getTemplateValue = () => {
    switch (state.currentTemplateId) {
      case template2Id: return 'Template 2';
      case template3Id: return 'Template 3';
      default: return 'Template 1';
    }
  };
  
  // Handle template change
  const handleTemplateChange = (value: string) => {
    switch (value) {
      case 'Template 2': 
        setTemplate(template2Id);
        break;
      case 'Template 3':
        setTemplate(template3Id);
        break;
      default:
        setTemplate(defaultTemplateId);
    }
  };
  
  return (
    <div className="flex-1 overflow-y-auto relative bg-gray-50">
      {/* Template Header */}
      <div className="bg-white p-4 border-b border-gray-200 shadow-sm flex justify-between items-center">
        <h2 className="font-medium">Canvas</h2>
        {!isPreviewMode && (
          <div className="hidden md:flex space-x-2">
            <Select 
              value={getTemplateValue()} 
              onValueChange={handleTemplateChange}
            >
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
              {currentTemplate.id === defaultTemplateId && (
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
              
              {currentTemplate.id === template2Id && (
                <>
                  <header className="relative p-12 bg-blue-600 border-b border-gray-200 text-center">
                    {/* Hero drop zone */}
                    <DropZone 
                      id={currentTemplate.dropZones[0].id} 
                      className="min-h-[200px] flex flex-col items-center justify-center" 
                      placeholderText="Portfolio hero section"
                    />
                  </header>
                  
                  <section className="p-8 bg-white">
                    {/* About drop zone */}
                    <DropZone 
                      id={currentTemplate.dropZones[1].id} 
                      className="min-h-[150px] flex flex-col items-center justify-center p-4 mb-8" 
                      placeholderText="About section"
                    />
                  </section>
                  
                  <section className="p-8 bg-gray-50">
                    {/* Portfolio drop zone */}
                    <DropZone 
                      id={currentTemplate.dropZones[2].id} 
                      className="min-h-[400px] flex flex-col items-center justify-center p-4 mb-8" 
                      placeholderText="Portfolio gallery section"
                    />
                  </section>
                  
                  <section className="p-8 bg-white">
                    {/* Contact drop zone */}
                    <DropZone 
                      id={currentTemplate.dropZones[3].id} 
                      className="min-h-[250px] flex flex-col items-center justify-center p-4 mb-8" 
                      placeholderText="Contact form section"
                    />
                  </section>
                  
                  <footer className="p-8 bg-gray-800 text-white">
                    {/* Footer drop zone */}
                    <DropZone 
                      id={currentTemplate.dropZones[4].id} 
                      className="min-h-[100px] flex items-center justify-center" 
                      placeholderText="Footer section"
                    />
                  </footer>
                </>
              )}
              
              {currentTemplate.id === template3Id && (
                <>
                  <header className="relative p-4 bg-white border-b border-gray-200">
                    {/* Header drop zone */}
                    <DropZone 
                      id={currentTemplate.dropZones[0].id} 
                      className="min-h-[60px] flex items-center" 
                      placeholderText="Business logo and navigation"
                    />
                  </header>
                  
                  <section className="p-12 bg-gray-50 text-center">
                    {/* Hero drop zone */}
                    <DropZone 
                      id={currentTemplate.dropZones[1].id} 
                      className="min-h-[200px] flex flex-col items-center justify-center p-4" 
                      placeholderText="Hero section"
                    />
                  </section>
                  
                  <section className="p-12 bg-white">
                    {/* Features drop zone */}
                    <DropZone 
                      id={currentTemplate.dropZones[2].id} 
                      className="min-h-[150px] flex flex-col items-center justify-center p-4 mb-8" 
                      placeholderText="Features section"
                    />
                  </section>
                  
                  <section className="p-12 bg-gray-50">
                    {/* Pricing drop zone */}
                    <DropZone 
                      id={currentTemplate.dropZones[3].id} 
                      className="min-h-[250px] flex flex-col items-center justify-center p-4" 
                      placeholderText="Pricing section"
                    />
                  </section>
                  
                  <section className="p-12 bg-blue-600 text-white">
                    {/* CTA drop zone */}
                    <DropZone 
                      id={currentTemplate.dropZones[4].id} 
                      className="min-h-[150px] flex flex-col items-center justify-center p-4" 
                      placeholderText="Call-to-action section"
                    />
                  </section>
                  
                  <footer className="p-8 bg-gray-800 text-white">
                    {/* Footer drop zone */}
                    <DropZone 
                      id={currentTemplate.dropZones[5].id} 
                      className="min-h-[100px] flex items-center justify-center" 
                      placeholderText="Footer information"
                    />
                  </footer>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
