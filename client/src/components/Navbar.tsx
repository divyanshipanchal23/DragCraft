import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBuilder } from '../context/BuilderContext';
import { useToast } from '@/hooks/use-toast';
import { Undo2, Redo2, Eye, Save, ArrowLeft } from 'lucide-react';

export default function Navbar() {
  const { state, togglePreviewMode, setViewMode } = useBuilder();
  const { isPreviewMode, viewMode } = state;
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: 'Website saved!',
      description: 'Your changes have been saved successfully.',
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-primary">Websites.co.in Builder</h1>
        
        {!isPreviewMode && (
          <div className="hidden md:flex space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <Undo2 className="h-4 w-4 mr-1" />
              Undo
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Redo2 className="h-4 w-4 mr-1" />
              Redo
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="hidden md:flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={togglePreviewMode}
            className="h-8"
          >
            {isPreviewMode ? 'Edit' : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </>
            )}
          </Button>
          
          <Select 
            value={viewMode}
            onValueChange={(value: 'desktop' | 'tablet' | 'mobile') => setViewMode(value)}
            disabled={!isPreviewMode}
          >
            <SelectTrigger className="h-8 w-28">
              <SelectValue placeholder="Device" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="default" size="sm" className="h-8" onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>
    </header>
  );
}
