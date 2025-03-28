import { useBuilder } from '../context/BuilderContext';
import DropZone from './DropZone';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { defaultTemplateId, template2Id, template3Id } from '../utils/element-templates';
import { Laptop, Tablet, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CanvasArea() {
  const { state, setTemplate } = useBuilder();
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
  
  // Get template name
  const getTemplateName = () => {
    switch (state.currentTemplateId) {
      case template2Id: return 'Portfolio Template';
      case template3Id: return 'Business Template';
      default: return 'Basic Template';
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
  
  // Get device icon
  const getDeviceIcon = () => {
    switch (viewMode) {
      case 'mobile': return <Smartphone className="h-5 w-5" />;
      case 'tablet': return <Tablet className="h-5 w-5" />;
      default: return <Laptop className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="flex-1 overflow-y-auto relative bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Canvas Header */}
      {!isPreviewMode && (
        <div className="bg-white p-3 border-b border-gray-200 shadow-sm flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h2 className="font-medium text-gray-800">Canvas</h2>
            <Badge variant="outline" className="ml-2 font-normal">
              {getTemplateName()}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Select 
              value={getTemplateValue()} 
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger className="text-xs h-8 w-36">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Template 1">Basic Template</SelectItem>
                <SelectItem value="Template 2">Portfolio Template</SelectItem>
                <SelectItem value="Template 3">Business Template</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {/* Canvas with background */}
      <div className="p-6 min-h-[calc(100vh-120px)] flex flex-col items-center">
        {/* Device viewport indicator */}
        <div className="sticky top-4 z-10 mb-4">
          <Badge variant="secondary" className="px-3 py-1 text-xs">
            {getDeviceIcon()}
            <span className="ml-1.5">
              {viewMode === 'mobile' ? 'Mobile View' : 
               viewMode === 'tablet' ? 'Tablet View' : 'Desktop View'}
            </span>
          </Badge>
        </div>
        
        {/* Device frame with website content */}
        <div className={`${getContainerClass()} mx-auto bg-white shadow-md border border-gray-200 rounded overflow-hidden`}>
          {/* Template Structure */}
          {currentTemplate && (
            <>
              {currentTemplate.id === defaultTemplateId && (
                <>
                  <header className="relative p-8 bg-gray-100 border-b border-gray-200 text-center">
                    <DropZone 
                      id={currentTemplate.dropZones[0].id} 
                      className="min-h-[120px] flex items-center justify-center" 
                      placeholderText="Drag and drop header elements here"
                    />
                  </header>
                  
                  <main className="p-8">
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <DropZone 
                        id={currentTemplate.dropZones[1].id} 
                        className="min-h-[200px] flex flex-col justify-center p-4" 
                        placeholderText="Drag and drop content elements here"
                      />
                      
                      <DropZone 
                        id={currentTemplate.dropZones[2].id} 
                        className="min-h-[200px] flex items-center justify-center p-4" 
                        placeholderText="Drag and drop content elements here"
                      />
                    </div>
                    
                    <DropZone 
                      id={currentTemplate.dropZones[3].id} 
                      className="min-h-[120px] flex items-center justify-center p-4 mb-8" 
                      placeholderText="Drag and drop elements here"
                    />
                    
                    <DropZone 
                      id={currentTemplate.dropZones[4].id} 
                      className="min-h-[150px] flex items-center justify-center" 
                      placeholderText="Drag and drop elements here"
                    />
                  </main>
                  
                  <footer className="p-8 bg-gray-800 text-white">
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
                    <DropZone 
                      id={currentTemplate.dropZones[0].id} 
                      className="min-h-[200px] flex flex-col items-center justify-center" 
                      placeholderText="Portfolio hero section"
                    />
                  </header>
                  
                  <section className="p-8 bg-white">
                    <DropZone 
                      id={currentTemplate.dropZones[1].id} 
                      className="min-h-[150px] flex flex-col items-center justify-center p-4 mb-8" 
                      placeholderText="About section"
                    />
                  </section>
                  
                  <section className="p-8 bg-gray-50">
                    <DropZone 
                      id={currentTemplate.dropZones[2].id} 
                      className="min-h-[400px] flex flex-col items-center justify-center p-4 mb-8" 
                      placeholderText="Portfolio gallery section"
                    />
                  </section>
                  
                  <section className="p-8 bg-white">
                    <DropZone 
                      id={currentTemplate.dropZones[3].id} 
                      className="min-h-[250px] flex flex-col items-center justify-center p-4 mb-8" 
                      placeholderText="Contact form section"
                    />
                  </section>
                  
                  <footer className="p-8 bg-gray-800 text-white">
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
                    <DropZone 
                      id={currentTemplate.dropZones[0].id} 
                      className="min-h-[60px] flex items-center" 
                      placeholderText="Business logo and navigation"
                    />
                  </header>
                  
                  <section className="p-12 bg-gray-50 text-center">
                    <DropZone 
                      id={currentTemplate.dropZones[1].id} 
                      className="min-h-[200px] flex flex-col items-center justify-center p-4" 
                      placeholderText="Hero section"
                    />
                  </section>
                  
                  <section className="p-12 bg-white">
                    <DropZone 
                      id={currentTemplate.dropZones[2].id} 
                      className="min-h-[150px] flex flex-col items-center justify-center p-4 mb-8" 
                      placeholderText="Features section"
                    />
                  </section>
                  
                  <section className="p-12 bg-gray-50">
                    <DropZone 
                      id={currentTemplate.dropZones[3].id} 
                      className="min-h-[250px] flex flex-col items-center justify-center p-4" 
                      placeholderText="Pricing section"
                    />
                  </section>
                  
                  <section className="p-12 bg-blue-600 text-white">
                    <DropZone 
                      id={currentTemplate.dropZones[4].id} 
                      className="min-h-[150px] flex flex-col items-center justify-center p-4" 
                      placeholderText="Call-to-action section"
                    />
                  </section>
                  
                  <footer className="p-8 bg-gray-800 text-white">
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