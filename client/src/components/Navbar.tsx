import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBuilder } from '../context/BuilderContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Undo2, Redo2, Eye, Save, ArrowLeft, 
  Laptop, Smartphone, Tablet, Home, Menu, X, 
  BookTemplate 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const { state, togglePreviewMode, setViewMode, undo, redo, canUndo, canRedo, setTemplate } = useBuilder();
  const { isPreviewMode, viewMode } = state;
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSave = () => {
    toast({
      title: '✨ Website saved!',
      description: 'Your changes have been saved successfully.',
      variant: 'default',
    });
  };
  
  const getDeviceIcon = () => {
    switch(viewMode) {
      case 'desktop': return <Laptop className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      default: return <Laptop className="h-4 w-4" />;
    }
  };
  
  const switchTemplate = (templateId: string) => {
    setTemplate(templateId);
    toast({
      title: '🎨 Template Changed',
      description: 'Your website template has been updated.',
    });
  };

  return (
    <header className={`sticky top-0 z-50 bg-white px-4 py-3 flex items-center justify-between transition-all duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <BookTemplate className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-xl font-bold text-primary">
            Website Builder
          </h1>
        </div>
        
        {!isPreviewMode && (
          <div className="hidden md:flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 transition-all ${!canUndo ? 'opacity-50' : 'hover:bg-gray-100'}`}
              onClick={undo} 
              disabled={!canUndo}
            >
              <Undo2 className="h-4 w-4 mr-1" />
              Undo
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-8 transition-all ${!canRedo ? 'opacity-50' : 'hover:bg-gray-100'}`}
              onClick={redo} 
              disabled={!canRedo}
            >
              <Redo2 className="h-4 w-4 mr-1" />
              Redo
            </Button>
          </div>
        )}
      </div>
      
      {/* Mobile menu toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      {/* Desktop navigation */}
      <div className="hidden md:flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 px-3">
              <BookTemplate className="h-4 w-4 mr-2" />
              Templates
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem onClick={() => switchTemplate('template-1')}>
              Basic Template
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchTemplate('template-2')}>
              Portfolio Template
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => switchTemplate('template-3')}>
              Business Template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
          
        <Button 
          variant={isPreviewMode ? "default" : "outline"}
          size="sm"
          onClick={togglePreviewMode}
          className="h-9 px-4 transition-all"
        >
          {isPreviewMode ? (
            <>
              Edit Mode
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </>
          )}
        </Button>
        
        {isPreviewMode && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 w-auto px-3">
                {getDeviceIcon()}
                <span className="ml-2">{viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewMode('desktop')}>
                <Laptop className="h-4 w-4 mr-2" />
                Desktop
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('tablet')}>
                <Tablet className="h-4 w-4 mr-2" />
                Tablet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('mobile')}>
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        <Button variant="default" size="sm" className="h-9 px-4 bg-primary hover:bg-primary/90 transition-all" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Website
        </Button>
      </div>
      
      {/* Mobile navigation menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-4 border-t border-gray-200 flex flex-col space-y-2 md:hidden">
          <div className="flex justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 justify-start"
              onClick={undo} 
              disabled={!canUndo}
            >
              <Undo2 className="h-4 w-4 mr-2" />
              Undo
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-1 justify-start"
              onClick={redo} 
              disabled={!canRedo}
            >
              <Redo2 className="h-4 w-4 mr-2" />
              Redo
            </Button>
          </div>
          
          <Button 
            variant={isPreviewMode ? "default" : "outline"}
            size="sm"
            onClick={togglePreviewMode}
            className="w-full justify-start"
          >
            {isPreviewMode ? 'Switch to Edit Mode' : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview Website
              </>
            )}
          </Button>
          
          {isPreviewMode && (
            <div className="flex flex-col space-y-1">
              <p className="text-sm text-gray-500 px-2">View as:</p>
              <Button variant="ghost" size="sm" className={`justify-start ${viewMode === 'desktop' ? 'bg-gray-100' : ''}`} onClick={() => setViewMode('desktop')}>
                <Laptop className="h-4 w-4 mr-2" />
                Desktop
              </Button>
              <Button variant="ghost" size="sm" className={`justify-start ${viewMode === 'tablet' ? 'bg-gray-100' : ''}`} onClick={() => setViewMode('tablet')}>
                <Tablet className="h-4 w-4 mr-2" />
                Tablet
              </Button>
              <Button variant="ghost" size="sm" className={`justify-start ${viewMode === 'mobile' ? 'bg-gray-100' : ''}`} onClick={() => setViewMode('mobile')}>
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </Button>
            </div>
          )}
          
          <div className="flex flex-col space-y-1">
            <p className="text-sm text-gray-500 px-2">Templates:</p>
            <Button variant="ghost" size="sm" className="justify-start" onClick={() => switchTemplate('template-1')}>
              <BookTemplate className="h-4 w-4 mr-2" />
              Basic Template
            </Button>
            <Button variant="ghost" size="sm" className="justify-start" onClick={() => switchTemplate('template-2')}>
              <BookTemplate className="h-4 w-4 mr-2" />
              Portfolio Template
            </Button>
            <Button variant="ghost" size="sm" className="justify-start" onClick={() => switchTemplate('template-3')}>
              <BookTemplate className="h-4 w-4 mr-2" />
              Business Template
            </Button>
          </div>
          
          <Button variant="default" className="w-full mt-2 bg-primary hover:bg-primary/90" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Website
          </Button>
        </div>
      )}
    </header>
  );
}
