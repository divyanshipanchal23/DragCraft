import { useBuilder } from '../context/BuilderContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Copy, Trash } from 'lucide-react';
import { ElementType } from '../types/element';

interface PropertiesPanelProps {
  isMobile: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function PropertiesPanel({ isMobile, isOpen = true, onClose }: PropertiesPanelProps) {
  const { state, updateElement, deleteElement, selectElement, duplicateElement } = useBuilder();
  const { selectedElementId, elements, isPreviewMode } = state;
  
  if (isPreviewMode) return null;
  
  const selectedElement = selectedElementId ? elements[selectedElementId] : null;
  
  // Close properties panel
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      selectElement(null);
    }
  };
  
  // Get element-specific properties
  const renderElementProperties = () => {
    if (!selectedElement) return (
      <div className="text-center text-gray-500 p-4">
        Select an element to edit its properties
      </div>
    );

    const commonProps = (
      <>
        <div className="space-y-2">
          <Label>Margin</Label>
          <Input 
            type="number" 
            value={selectedElement.style.margin} 
            onChange={(e) => {
              updateElement(selectedElement.id, {
                style: { ...selectedElement.style, margin: parseInt(e.target.value) || 0 }
              });
            }}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Padding</Label>
          <Input 
            type="number" 
            value={selectedElement.style.padding} 
            onChange={(e) => {
              updateElement(selectedElement.id, {
                style: { ...selectedElement.style, padding: parseInt(e.target.value) || 0 }
              });
            }}
          />
        </div>
      </>
    );

    switch (selectedElement.type) {
      case 'heading':
      case 'paragraph': {
        const textElement = selectedElement;
        return (
          <>
            <div className="space-y-2">
              <Label>Text Content</Label>
              <Textarea 
                value={textElement.content} 
                onChange={(e) => {
                  updateElement(textElement.id, { content: e.target.value });
                }}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select 
                value={textElement.style.fontSize}
                onValueChange={(value) => {
                  updateElement(textElement.id, {
                    style: { ...textElement.style, fontSize: value }
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="extra-large">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Font Weight</Label>
              <div className="flex space-x-2">
                <Button 
                  variant={textElement.style.fontWeight === 'bold' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    updateElement(textElement.id, {
                      style: { ...textElement.style, fontWeight: 'bold' }
                    });
                  }}
                >
                  Bold
                </Button>
                <Button 
                  variant={textElement.style.fontWeight === 'normal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    updateElement(textElement.id, {
                      style: { ...textElement.style, fontWeight: 'normal' }
                    });
                  }}
                >
                  Normal
                </Button>
                <Button 
                  variant={textElement.style.fontWeight === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    updateElement(textElement.id, {
                      style: { ...textElement.style, fontWeight: 'light' }
                    });
                  }}
                >
                  Light
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="color" 
                  value={textElement.style.color}
                  className="w-12 h-8 p-1"
                  onChange={(e) => {
                    updateElement(textElement.id, {
                      style: { ...textElement.style, color: e.target.value }
                    });
                  }}
                />
                <Input 
                  type="text" 
                  value={textElement.style.color}
                  onChange={(e) => {
                    updateElement(textElement.id, {
                      style: { ...textElement.style, color: e.target.value }
                    });
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Alignment</Label>
              <div className="flex border border-gray-300 rounded-md overflow-hidden divide-x divide-gray-300">
                <Button 
                  variant="ghost"
                  className={`flex-1 py-1 ${textElement.style.alignment === 'left' ? 'bg-gray-100' : 'bg-white'}`}
                  onClick={() => {
                    updateElement(textElement.id, {
                      style: { ...textElement.style, alignment: 'left' }
                    });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <Button 
                  variant="ghost"
                  className={`flex-1 py-1 ${textElement.style.alignment === 'center' ? 'bg-gray-100' : 'bg-white'}`}
                  onClick={() => {
                    updateElement(textElement.id, {
                      style: { ...textElement.style, alignment: 'center' }
                    });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6h12M9 12h12M9 18h12" />
                  </svg>
                </Button>
                <Button 
                  variant="ghost"
                  className={`flex-1 py-1 ${textElement.style.alignment === 'right' ? 'bg-gray-100' : 'bg-white'}`}
                  onClick={() => {
                    updateElement(textElement.id, {
                      style: { ...textElement.style, alignment: 'right' }
                    });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h12M4 12h12M4 18h12" />
                  </svg>
                </Button>
              </div>
            </div>
            
            {commonProps}
          </>
        );
      }
      
      case 'image': {
        const imageElement = selectedElement;
        return (
          <>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input 
                type="text" 
                value={imageElement.src} 
                onChange={(e) => {
                  updateElement(imageElement.id, { src: e.target.value });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input 
                type="text" 
                value={imageElement.alt} 
                onChange={(e) => {
                  updateElement(imageElement.id, { alt: e.target.value });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Width</Label>
              <Input 
                type="text" 
                value={imageElement.style.width} 
                onChange={(e) => {
                  updateElement(imageElement.id, {
                    style: { ...imageElement.style, width: e.target.value }
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Border Radius</Label>
              <Input 
                type="number" 
                value={imageElement.style.borderRadius} 
                onChange={(e) => {
                  updateElement(imageElement.id, {
                    style: { ...imageElement.style, borderRadius: parseInt(e.target.value) || 0 }
                  });
                }}
              />
            </div>
            
            {commonProps}
          </>
        );
      }
      
      case 'button': {
        const buttonElement = selectedElement;
        return (
          <>
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input 
                type="text" 
                value={buttonElement.content} 
                onChange={(e) => {
                  updateElement(buttonElement.id, { content: e.target.value });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input 
                type="text" 
                value={buttonElement.link} 
                onChange={(e) => {
                  updateElement(buttonElement.id, { link: e.target.value });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="color" 
                  value={buttonElement.style.backgroundColor}
                  className="w-12 h-8 p-1"
                  onChange={(e) => {
                    updateElement(buttonElement.id, {
                      style: { ...buttonElement.style, backgroundColor: e.target.value }
                    });
                  }}
                />
                <Input 
                  type="text" 
                  value={buttonElement.style.backgroundColor}
                  onChange={(e) => {
                    updateElement(buttonElement.id, {
                      style: { ...buttonElement.style, backgroundColor: e.target.value }
                    });
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="color" 
                  value={buttonElement.style.color}
                  className="w-12 h-8 p-1"
                  onChange={(e) => {
                    updateElement(buttonElement.id, {
                      style: { ...buttonElement.style, color: e.target.value }
                    });
                  }}
                />
                <Input 
                  type="text" 
                  value={buttonElement.style.color}
                  onChange={(e) => {
                    updateElement(buttonElement.id, {
                      style: { ...buttonElement.style, color: e.target.value }
                    });
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Border Radius</Label>
              <Input 
                type="number" 
                value={buttonElement.style.borderRadius} 
                onChange={(e) => {
                  updateElement(buttonElement.id, {
                    style: { ...buttonElement.style, borderRadius: parseInt(e.target.value) || 0 }
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Alignment</Label>
              <div className="flex border border-gray-300 rounded-md overflow-hidden divide-x divide-gray-300">
                <Button 
                  variant="ghost"
                  className={`flex-1 py-1 ${buttonElement.style.alignment === 'left' ? 'bg-gray-100' : 'bg-white'}`}
                  onClick={() => {
                    updateElement(buttonElement.id, {
                      style: { ...buttonElement.style, alignment: 'left' }
                    });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <Button 
                  variant="ghost"
                  className={`flex-1 py-1 ${buttonElement.style.alignment === 'center' ? 'bg-gray-100' : 'bg-white'}`}
                  onClick={() => {
                    updateElement(buttonElement.id, {
                      style: { ...buttonElement.style, alignment: 'center' }
                    });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6h12M9 12h12M9 18h12" />
                  </svg>
                </Button>
                <Button 
                  variant="ghost"
                  className={`flex-1 py-1 ${buttonElement.style.alignment === 'right' ? 'bg-gray-100' : 'bg-white'}`}
                  onClick={() => {
                    updateElement(buttonElement.id, {
                      style: { ...buttonElement.style, alignment: 'right' }
                    });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h12M4 12h12M4 18h12" />
                  </svg>
                </Button>
              </div>
            </div>
            
            {commonProps}
          </>
        );
      }
      
      default:
        return commonProps;
    }
  };
  
  // Element type display name
  const getElementTypeName = (type: ElementType) => {
    switch (type) {
      case 'heading': return 'Heading';
      case 'paragraph': return 'Paragraph';
      case 'image': return 'Image';
      case 'button': return 'Button';
      case 'container': return 'Container';
      case 'two-column': return 'Two Column Layout';
      case 'form': return 'Form';
      case 'gallery': return 'Gallery';
      default: return 'Element';
    }
  };
  
  // Actions
  const handleDuplicate = () => {
    if (selectedElementId) {
      duplicateElement(selectedElementId);
    }
  };
  
  const handleDelete = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  };
  
  // Mobile view uses dialog, desktop uses sidebar
  if (isMobile) {
    return (
      <Dialog open={isOpen && !!selectedElement} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {selectedElement ? getElementTypeName(selectedElement.type) : 'Element'} Properties
              <Button variant="outline" size="icon" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
            {renderElementProperties()}
          </div>
          {selectedElement && (
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <div className="bg-white border-l border-gray-200 w-full md:w-80 md:flex-shrink-0 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">
            {selectedElement ? getElementTypeName(selectedElement.type) : 'Element'} Properties
          </h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {renderElementProperties()}
        </div>
        
        {selectedElement && (
          <>
            <Separator className="my-4" />
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
