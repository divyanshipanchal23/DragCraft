import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Heading1, Type, Image, MousePointerClick, Box, Columns2, 
  FileSpreadsheet, LayoutGrid, Video, Link, Table 
} from 'lucide-react';
import DraggableElement from './DraggableElement';
import { Separator } from '@/components/ui/separator';
import { useBuilder } from '../context/BuilderContext';
import { ElementType } from '../types/element';
import { getElementsToolboxItems } from '../utils/element-templates';

export default function ElementsToolbox() {
  const { state } = useBuilder();
  const { isPreviewMode } = state;
  
  // Group elements by category
  const basicElements: ElementType[] = ['heading', 'paragraph', 'image', 'button', 'link'];
  const mediaElements: ElementType[] = ['video', 'table'];
  const componentElements: ElementType[] = ['form', 'gallery'];
  
  if (isPreviewMode) return null;
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-white border-r border-gray-200 w-full md:w-64 md:flex-shrink-0 overflow-y-auto">
        <div className="p-4">
          <h2 className="font-semibold text-gray-700 mb-3">Elements</h2>
          
          <div className="space-y-4">
            {/* Basic Elements */}
            <div>
              <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">Basic</h3>
              <div className="grid grid-cols-2 gap-2">
                <DraggableElement type="heading" label="Heading" />
                <DraggableElement type="paragraph" label="Paragraph" />
                <DraggableElement type="image" label="Image" />
                <DraggableElement type="button" label="Button" />
                <DraggableElement type="link" label="Link" />
              </div>
            </div>
            
            <Separator />
            
            {/* Media Elements */}
            <div>
              <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">Media</h3>
              <div className="grid grid-cols-2 gap-2">
                <DraggableElement type="video" label="Video" />
                <DraggableElement type="table" label="Table" />
              </div>
            </div>
            
            <Separator />
            
            {/* Components */}
            <div>
              <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">Components</h3>
              <div className="grid grid-cols-2 gap-2">
                <DraggableElement type="form" label="Contact Form" />
                <DraggableElement type="gallery" label="Gallery" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
