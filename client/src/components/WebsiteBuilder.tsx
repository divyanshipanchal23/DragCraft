import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useIsMobile } from '../hooks/use-mobile';
import ElementsToolbox from './ElementsToolbox';
import CanvasArea from './CanvasArea';
import PropertiesPanel from './PropertiesPanel';
import Navbar from './Navbar';
import { Button } from './ui/button';
import { useBuilder } from '../context/BuilderContext';
import { PanelLeft, PanelRight, X, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function WebsiteBuilder() {
  const isMobile = useIsMobile();
  const { state, selectElement } = useBuilder();
  const { selectedElementId } = state;
  
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(!isMobile && !!selectedElementId);
  
  const toggleLeftSidebar = () => setLeftSidebarOpen(!leftSidebarOpen);
  const toggleRightSidebar = () => {
    if (!selectedElementId && !rightSidebarOpen) {
      return; // Don't open right sidebar if no element is selected
    }
    setRightSidebarOpen(!rightSidebarOpen);
  };
  
  // Close right sidebar when no element is selected
  if (rightSidebarOpen && !selectedElementId && !isMobile) {
    setRightSidebarOpen(false);
  }
  
  // Open right sidebar when an element is selected
  if (!rightSidebarOpen && selectedElementId && !isMobile) {
    setRightSidebarOpen(true);
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        <Navbar />
        
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
          {/* Mobile toggle buttons */}
          {isMobile && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary" size="sm" className="rounded-full h-10 w-10 p-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  <ElementsToolbox />
                </SheetContent>
              </Sheet>
              
              {selectedElementId && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="secondary" size="sm" className="rounded-full h-10 w-10 p-0">
                      <PanelRight className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="p-0">
                    <PropertiesPanel isMobile={true} />
                  </SheetContent>
                </Sheet>
              )}
            </div>
          )}
          
          {/* Desktop Left Sidebar */}
          {!isMobile && (
            <>
              {leftSidebarOpen ? (
                <ElementsToolbox />
              ) : (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="absolute left-4 top-4 z-10"
                  onClick={toggleLeftSidebar}
                >
                  <PanelLeft className="h-4 w-4 mr-1" />
                  Elements
                </Button>
              )}
            </>
          )}
          
          {/* Canvas Area */}
          <CanvasArea />
          
          {/* Desktop Right Sidebar */}
          {!isMobile && rightSidebarOpen && selectedElementId && (
            <PropertiesPanel isMobile={false} />
          )}
        </div>
      </div>
    </DndProvider>
  );
}
