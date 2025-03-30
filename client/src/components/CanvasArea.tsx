import { useBuilder } from '../context/BuilderContext';
import DropZone from './DropZone';
import { defaultTemplateId, template2Id, template3Id } from '../utils/element-templates';
import { Laptop, Tablet, Smartphone, Zap, Info, Hand, MousePointer } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { cn } from '../lib/utils';

// CSS variables to force light mode for the canvas content
const canvasThemeStyles = {
  '--background': '0 0% 100%',
  '--foreground': '222.2 84% 4.9%',
  '--card': '0 0% 100%',
  '--card-foreground': '222.2 84% 4.9%',
  '--popover': '0 0% 100%',
  '--popover-foreground': '222.2 84% 4.9%',
  '--primary': '222.2 47.4% 11.2%',
  '--primary-foreground': '210 40% 98%',
  '--secondary': '210 40% 96.1%',
  '--secondary-foreground': '222.2 47.4% 11.2%',
  '--muted': '210 40% 96.1%',
  '--muted-foreground': '215.4 16.3% 46.9%',
  '--accent': '210 40% 96.1%',
  '--accent-foreground': '222.2 47.4% 11.2%',
  '--destructive': '0 84.2% 60.2%',
  '--destructive-foreground': '210 40% 98%',
  '--border': '214.3 31.8% 91.4%',
  '--input': '214.3 31.8% 91.4%',
  '--ring': '222.2 84% 4.9%',
} as React.CSSProperties;

export default function CanvasArea() {
  const { state, setTemplate } = useBuilder();
  const { isPreviewMode, viewMode } = state;
  const [showControlsTip, setShowControlsTip] = useState(false);
  const [showFirstTimeTips, setShowFirstTimeTips] = useState(true);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(true);
  const [showHelpButton, setShowHelpButton] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);
  const welcomeDialogShownRef = useRef(false);
  
  // Show tips briefly when entering edit mode
  useEffect(() => {
    if (!isPreviewMode) {
      setShowControlsTip(true);
      const timer = setTimeout(() => {
        setShowControlsTip(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isPreviewMode]);
  
  // Check if it's the first time opening the editor - with a delay
  useEffect(() => {
    // Only check once and use a delay to ensure component is fully loaded
    if (!welcomeDialogShownRef.current) {
      welcomeDialogShownRef.current = true;
      
      // Delay checking localStorage to ensure the component is fully mounted
      setTimeout(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeGuide');
        if (hasSeenWelcome) {
          setShowWelcomeDialog(false);
        }
      }, 1000);
    }
  }, []);

  // Add scroll listener to hide help button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      if (canvasRef.current) {
        // Hide the button when scrolled down more than 200px
        const scrollPosition = canvasRef.current.scrollTop;
        setShowHelpButton(scrollPosition < 200);
      }
    };
    
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      canvasElement.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
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
  
  // Handle the welcome dialog closing
  const closeWelcomeDialog = () => {
    setShowWelcomeDialog(false);
    localStorage.setItem('hasSeenWelcomeGuide', 'true');
  };
  
  return (
    <div ref={canvasRef} className="flex-1 overflow-y-auto relative bg-slate-50 dark:bg-slate-900">
      {/* Welcome Dialog for first-time users */}
      <Dialog 
        open={showWelcomeDialog} 
        onOpenChange={(isOpen) => {
          // If closing, save the preference
          if (!isOpen) {
            closeWelcomeDialog();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Welcome to Website Builder!</DialogTitle>
            <DialogDescription className="text-center">
              Create beautiful websites with our easy-to-use drag-and-drop editor
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Hand className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Drag & Drop Editor</h3>
              <p className="text-sm text-center text-gray-600">
                Simply drag elements from the toolbox onto your canvas to build your website.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
                <div className="rounded-full bg-primary/10 p-2 mb-2">
                  <MousePointer className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-medium mb-1">Easy Customization</h3>
                <p className="text-xs text-center text-gray-600">
                  Click any element to customize its appearance and content.
                </p>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
                <div className="rounded-full bg-primary/10 p-2 mb-2">
                  <Laptop className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-medium mb-1">Responsive Preview</h3>
                <p className="text-xs text-center text-gray-600">
                  Check how your site looks on different devices with our preview modes.
                </p>
              </div>
            </div>
          </div>
          
          <Button onClick={closeWelcomeDialog} className="w-full">
            Get Started
          </Button>
        </DialogContent>
      </Dialog>
      
      {/* Canvas Header */}
      {!isPreviewMode && (
        <div className="bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h2 className="font-medium text-gray-800 dark:text-gray-200">Canvas</h2>
            <Badge variant="outline" className="ml-2 font-normal">
              {getTemplateName()}
            </Badge>
          </div>
        </div>
      )}
      
      {/* Canvas with background */}
      <div className="p-6 min-h-[calc(100vh-120px)] flex flex-col items-center">
        {/* Device viewport indicator + Help */}
        <div className="sticky top-4 z-10 mb-4 flex justify-center items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1 text-xs">
            {getDeviceIcon()}
            <span className="ml-1.5">
              {viewMode === 'mobile' ? 'Mobile View' : 
               viewMode === 'tablet' ? 'Tablet View' : 'Desktop View'}
            </span>
          </Badge>
          
          {/* Help tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-7 w-7 rounded-full">
                  <Info className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[250px]">
                <p className="text-xs">In {viewMode} view, your content is shown as it would appear on a {viewMode} device.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Editor tips - only shown in edit mode */}
        {!isPreviewMode && showControlsTip && (
          <div className="absolute top-20 right-4 z-30 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 shadow-lg rounded-lg p-3 max-w-[250px] text-sm animate-in fade-in slide-in-from-right-5 duration-500">
            <div className="flex items-start gap-2">
              <Zap className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">Quick Tip</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">
                  Drag elements from the toolbox and drop them into any drop zone. 
                  Click any element to edit its properties.
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2 text-xs h-7"
              onClick={() => setShowControlsTip(false)}
            >
              Got it
            </Button>
          </div>
        )}
        
        {/* Help dialog trigger with smooth fade effect */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "absolute bottom-4 right-4 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm transition-all duration-300 ease-in-out",
                // Show button only when not in preview mode and when near the top of the page
                (isPreviewMode || !showHelpButton) 
                  ? "opacity-0 pointer-events-none" 
                  : "opacity-100 pointer-events-auto"
              )}
            >
              <Info className="h-4 w-4 mr-1.5" />
              How it works
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Website Builder Guide</DialogTitle>
              <DialogDescription>
                Learn how to use the drag-and-drop website builder
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Hand className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">Drag and Drop</h3>
                  <p className="text-sm text-muted-foreground">Drag elements from the toolbox on the left and drop them into highlighted zones.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MousePointer className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">Edit Properties</h3>
                  <p className="text-sm text-muted-foreground">Click on any element to select it and edit its properties in the right panel.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Laptop className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">Preview Modes</h3>
                  <p className="text-sm text-muted-foreground">Toggle between desktop, tablet, and mobile views to see how your site looks on different devices.</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Device frame with website content - Theme independent wrapper */}
        <div 
          className={`relative ${getContainerClass()} mx-auto bg-white shadow-md border border-gray-200 rounded overflow-hidden`}
          style={canvasThemeStyles} // Apply consistent light theme
        >
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
                  
                  <main className="p-8 bg-white text-gray-900">
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