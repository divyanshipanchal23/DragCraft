import { useBuilder } from '../context/BuilderContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { X, Copy, Trash, Video, Link as LinkIcon, TableIcon, Image } from 'lucide-react';
import { ElementType, TextFormatting, ListType, FontSize, FontFamily } from '../types/element';
import RichTextEditor from './RichTextEditor';
import { Slider } from "./ui/slider";
import { convertToYouTubeEmbedURL, ensureProtocol, processImageUrl, getImagePlaceholder } from '../utils/url-helpers';
import ImageUploader from './ImageUploader';

interface PropertiesPanelProps {
  isMobile: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

// Font families available for selection
const FONT_FAMILIES: FontFamily[] = [
  'Arial',
  'Helvetica',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Courier New',
  'Brush Script MT',
  'Open Sans',
  'Roboto',
  'Lato',
  'Montserrat',
  'Poppins'
];

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
      <div className="text-center text-muted-foreground p-4">
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
                style: { ...selectedElement.style, margin: parseInt(e.target.value) || 0 } as any
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
                style: { ...selectedElement.style, padding: parseInt(e.target.value) || 0 } as any
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
              <div className="flex items-center justify-between">
                <Label>Rich Text Editing</Label>
                <Switch 
                  checked={textElement.richText}
                  onCheckedChange={(checked) => {
                    updateElement(textElement.id, { richText: checked });
                  }}
                />
              </div>
              
              {textElement.richText ? (
                <RichTextEditor 
                  content={textElement.content}
                  textFormatting={textElement.textFormatting || {
                    bold: false,
                    italic: false,
                    underline: false,
                    strikethrough: false,
                    subscript: false,
                    superscript: false
                  }}
                  formattedRanges={textElement.formattedRanges || []}
                  listType={textElement.type === 'paragraph' ? (textElement.listType || 'none') : undefined}
                  onContentChange={(newContent) => {
                    updateElement(textElement.id, { content: newContent });
                  }}
                  onFormattingChange={(newFormatting, selection) => {
                    updateElement(textElement.id, { 
                      textFormatting: newFormatting,
                      selection: selection || undefined
                    });
                  }}
                  onFormattedRangesChange={(newRanges) => {
                    updateElement(textElement.id, { formattedRanges: newRanges });
                  }}
                  onListTypeChange={textElement.type === 'paragraph' ? (listType) => {
                    updateElement(textElement.id, { listType });
                  } : undefined}
                  onSave={() => {
                    // Apply/save the changes to make sure they're reflected in the canvas
                    // This is just triggering a state update to ensure changes are applied
                    const timestamp = new Date().toISOString();
                    // Use style property for the update instead of non-existent updatedAt
                    updateElement(textElement.id, { 
                      style: { ...textElement.style }
                    });
                  }}
                />
              ) : (
                <Textarea 
                  value={textElement.content} 
                  onChange={(e) => {
                    updateElement(textElement.id, { content: e.target.value });
                  }}
                  rows={3}
                />
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Font Size</Label>
              <div className="flex gap-2 items-center">
                <Input 
                  type="number" 
                  min="8"
                  max="72"
                  value={textElement.style.fontSize.toString().replace(/[^\d]/g, '')}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      updateElement(textElement.id, {
                        style: { ...textElement.style, fontSize: `${value}px` }
                      });
                    }
                  }}
                  className="w-20"
                />
                <Select 
                  value={textElement.style.fontSize.includes('px') ? 'px' : 
                         textElement.style.fontSize.includes('rem') ? 'rem' : 
                         textElement.style.fontSize.includes('em') ? 'em' : 'px'}
                  onValueChange={(unit) => {
                    const currentSize = parseInt(textElement.style.fontSize.toString().replace(/[^\d]/g, ''));
                    if (!isNaN(currentSize)) {
                      updateElement(textElement.id, {
                        style: { ...textElement.style, fontSize: `${currentSize}${unit}` }
                      });
                    }
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="px">px</SelectItem>
                    <SelectItem value="rem">rem</SelectItem>
                    <SelectItem value="em">em</SelectItem>
                    <SelectItem value="%">%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2">
                <Label className="text-xs text-muted-foreground">Quick Sizes</Label>
                <div className="flex space-x-2 mt-1">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateElement(textElement.id, {
                        style: { ...textElement.style, fontSize: '16px' }
                      });
                    }}
                  >
                    Small
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateElement(textElement.id, {
                        style: { ...textElement.style, fontSize: '20px' }
                      });
                    }}
                  >
                    Medium
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateElement(textElement.id, {
                        style: { ...textElement.style, fontSize: '24px' }
                      });
                    }}
                  >
                    Large
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateElement(textElement.id, {
                        style: { ...textElement.style, fontSize: '32px' }
                      });
                    }}
                  >
                    XL
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select 
                value={textElement.style.fontFamily || 'Arial'}
                onValueChange={(value) => {
                  updateElement(textElement.id, {
                    style: { ...textElement.style, fontFamily: value }
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map(font => (
                    <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </SelectItem>
                  ))}
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
              <div className="flex border border-border rounded-md overflow-hidden divide-x divide-border">
                <Button 
                  variant="ghost"
                  className={`flex-1 py-1 ${textElement.style.alignment === 'left' ? 'bg-secondary' : 'bg-background'}`}
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
                  className={`flex-1 py-1 ${textElement.style.alignment === 'center' ? 'bg-secondary' : 'bg-background'}`}
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
                  className={`flex-1 py-1 ${textElement.style.alignment === 'right' ? 'bg-secondary' : 'bg-background'}`}
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
              <Label>Image</Label>
              <ImageUploader 
                onImageUploaded={(imageUrl) => {
                  updateElement(imageElement.id, { src: imageUrl });
                }}
                showPreview={true}
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
                placeholder="Describe the image for accessibility"
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
              <div className="flex border border-border rounded-md overflow-hidden divide-x divide-border">
                <Button 
                  variant="ghost"
                  className={`flex-1 py-1 ${buttonElement.style.alignment === 'left' ? 'bg-secondary' : 'bg-background'}`}
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
                  className={`flex-1 py-1 ${buttonElement.style.alignment === 'center' ? 'bg-secondary' : 'bg-background'}`}
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
                  className={`flex-1 py-1 ${buttonElement.style.alignment === 'right' ? 'bg-secondary' : 'bg-background'}`}
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
      
      case 'video': {
        const videoElement = selectedElement as any;
        return (
          <>
            <div className="space-y-2">
              <Label>Video URL (YouTube, Vimeo, etc.)</Label>
              <Input 
                type="text" 
                value={videoElement.src} 
                onChange={(e) => {
                  // Process the URL before updating the element
                  let url = ensureProtocol(e.target.value.trim());
                  
                  // Convert YouTube URLs to embed format
                  if (url.includes('youtube.com') || url.includes('youtu.be')) {
                    url = convertToYouTubeEmbedURL(url);
                  }
                  
                  updateElement(videoElement.id, { src: url });
                }}
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Supports YouTube, Vimeo, and other video platforms.
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                type="text" 
                value={videoElement.title} 
                onChange={(e) => {
                  updateElement(videoElement.id, { title: e.target.value });
                }}
              />
            </div>
            
            <div className="space-y-4 my-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoplay">Autoplay</Label>
                <Switch 
                  id="autoplay"
                  checked={videoElement.autoplay} 
                  onCheckedChange={(checked) => {
                    updateElement(videoElement.id, { autoplay: checked });
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="controls">Show Controls</Label>
                <Switch 
                  id="controls"
                  checked={videoElement.controls} 
                  onCheckedChange={(checked) => {
                    updateElement(videoElement.id, { controls: checked });
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="loop">Loop</Label>
                <Switch 
                  id="loop"
                  checked={videoElement.loop} 
                  onCheckedChange={(checked) => {
                    updateElement(videoElement.id, { loop: checked });
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="muted">Muted</Label>
                <Switch 
                  id="muted"
                  checked={videoElement.muted} 
                  onCheckedChange={(checked) => {
                    updateElement(videoElement.id, { muted: checked });
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Width</Label>
              <Input 
                type="text" 
                value={videoElement.style.width} 
                onChange={(e) => {
                  updateElement(videoElement.id, {
                    style: { ...videoElement.style, width: e.target.value }
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Border Radius</Label>
              <Input 
                type="number" 
                value={videoElement.style.borderRadius} 
                onChange={(e) => {
                  updateElement(videoElement.id, {
                    style: { ...videoElement.style, borderRadius: parseInt(e.target.value) || 0 }
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Alignment</Label>
              <div className="flex border border-border rounded-md overflow-hidden divide-x divide-border">
                <Button 
                  variant="ghost"
                  className={`flex-1 py-1 ${videoElement.style.alignment === 'left' ? 'bg-secondary' : 'bg-background'}`}
                  onClick={() => {
                    updateElement(videoElement.id, {
                      style: { ...videoElement.style, alignment: 'left' }
                    });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <Button 
                  variant="ghost"
                  className={`flex-1 py-1 ${videoElement.style.alignment === 'center' ? 'bg-secondary' : 'bg-background'}`}
                  onClick={() => {
                    updateElement(videoElement.id, {
                      style: { ...videoElement.style, alignment: 'center' }
                    });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6h12M9 12h12M9 18h12" />
                  </svg>
                </Button>
                <Button 
                  variant="ghost"
                  className={`flex-1 py-1 ${videoElement.style.alignment === 'right' ? 'bg-secondary' : 'bg-background'}`}
                  onClick={() => {
                    updateElement(videoElement.id, {
                      style: { ...videoElement.style, alignment: 'right' }
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
      
      case 'link': {
        const linkElement = selectedElement as any;
        return (
          <>
            <div className="space-y-2">
              <Label>Link Text</Label>
              <Input 
                type="text" 
                value={linkElement.content} 
                onChange={(e) => {
                  updateElement(linkElement.id, { content: e.target.value });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>URL</Label>
              <Input 
                type="text" 
                value={linkElement.href} 
                onChange={(e) => {
                  updateElement(linkElement.id, { href: e.target.value });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Open In</Label>
              <Select 
                value={linkElement.target}
                onValueChange={(value: '_self' | '_blank' | '_parent' | '_top') => {
                  updateElement(linkElement.id, { target: value });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_self">Same Window</SelectItem>
                  <SelectItem value="_blank">New Window</SelectItem>
                  <SelectItem value="_parent">Parent Frame</SelectItem>
                  <SelectItem value="_top">Top Frame</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="color" 
                  value={linkElement.style.color}
                  className="w-12 h-8 p-1"
                  onChange={(e) => {
                    updateElement(linkElement.id, {
                      style: { ...linkElement.style, color: e.target.value }
                    });
                  }}
                />
                <Input 
                  type="text" 
                  value={linkElement.style.color}
                  onChange={(e) => {
                    updateElement(linkElement.id, {
                      style: { ...linkElement.style, color: e.target.value }
                    });
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Text Decoration</Label>
              <Select 
                value={linkElement.style.textDecoration}
                onValueChange={(value) => {
                  updateElement(linkElement.id, { 
                    style: { ...linkElement.style, textDecoration: value } 
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select decoration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="underline">Underline</SelectItem>
                  <SelectItem value="overline">Overline</SelectItem>
                  <SelectItem value="line-through">Line Through</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select 
                value={linkElement.style.fontSize}
                onValueChange={(value) => {
                  updateElement(linkElement.id, {
                    style: { ...linkElement.style, fontSize: value }
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
              <Label>Alignment</Label>
              <div className="flex border border-border rounded-md overflow-hidden divide-x divide-border">
                <Button 
                  variant="ghost"
                  className={`flex-1 py-1 ${linkElement.style.alignment === 'left' ? 'bg-secondary' : 'bg-background'}`}
                  onClick={() => {
                    updateElement(linkElement.id, {
                      style: { ...linkElement.style, alignment: 'left' }
                    });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <Button 
                  variant="ghost"
                  className={`flex-1 py-1 ${linkElement.style.alignment === 'center' ? 'bg-secondary' : 'bg-background'}`}
                  onClick={() => {
                    updateElement(linkElement.id, {
                      style: { ...linkElement.style, alignment: 'center' }
                    });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6h12M9 12h12M9 18h12" />
                  </svg>
                </Button>
                <Button 
                  variant="ghost"
                  className={`flex-1 py-1 ${linkElement.style.alignment === 'right' ? 'bg-secondary' : 'bg-background'}`}
                  onClick={() => {
                    updateElement(linkElement.id, {
                      style: { ...linkElement.style, alignment: 'right' }
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
      
      case 'table': {
        const tableElement = selectedElement as any;
        return (
          <>
            <div className="space-y-2">
              <Label>Rows</Label>
              <Input 
                type="number" 
                value={tableElement.rows} 
                onChange={(e) => {
                  const rows = parseInt(e.target.value) || 2;
                  // Update data array if rows increased
                  let newData = [...tableElement.data];
                  if (rows > tableElement.data.length) {
                    // Add new rows
                    const colsCount = tableElement.columns;
                    for (let i = tableElement.data.length; i < rows; i++) {
                      newData.push(Array(colsCount).fill('').map((_, j) => `Row ${i+1}, Cell ${j+1}`));
                    }
                  } else if (rows < tableElement.data.length) {
                    // Remove rows
                    newData = newData.slice(0, rows);
                  }
                  
                  updateElement(tableElement.id, { 
                    rows,
                    data: newData
                  });
                }}
                min={1}
                max={20}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Columns</Label>
              <Input 
                type="number" 
                value={tableElement.columns} 
                onChange={(e) => {
                  const columns = parseInt(e.target.value) || 2;
                  
                  // Update headers array
                  let newHeaders = [...tableElement.headers];
                  if (columns > tableElement.headers.length) {
                    // Add new headers
                    for (let i = tableElement.headers.length; i < columns; i++) {
                      newHeaders.push(`Header ${i+1}`);
                    }
                  } else if (columns < tableElement.headers.length) {
                    // Remove headers
                    newHeaders = newHeaders.slice(0, columns);
                  }
                  
                  // Update data array
                  const newData = tableElement.data.map((row: string[]) => {
                    if (columns > row.length) {
                      // Add new cells
                      const newRow = [...row];
                      for (let i = row.length; i < columns; i++) {
                        newRow.push(`Cell ${i+1}`);
                      }
                      return newRow;
                    } else if (columns < row.length) {
                      // Remove cells
                      return row.slice(0, columns);
                    }
                    return row;
                  });
                  
                  updateElement(tableElement.id, { 
                    columns,
                    headers: newHeaders,
                    data: newData
                  });
                }}
                min={1}
                max={10}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Header Background</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="color" 
                  value={tableElement.style.headerBackgroundColor}
                  className="w-12 h-8 p-1"
                  onChange={(e) => {
                    updateElement(tableElement.id, {
                      style: { ...tableElement.style, headerBackgroundColor: e.target.value }
                    });
                  }}
                />
                <Input 
                  type="text" 
                  value={tableElement.style.headerBackgroundColor}
                  onChange={(e) => {
                    updateElement(tableElement.id, {
                      style: { ...tableElement.style, headerBackgroundColor: e.target.value }
                    });
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Header Text Color</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="color" 
                  value={tableElement.style.headerTextColor}
                  className="w-12 h-8 p-1"
                  onChange={(e) => {
                    updateElement(tableElement.id, {
                      style: { ...tableElement.style, headerTextColor: e.target.value }
                    });
                  }}
                />
                <Input 
                  type="text" 
                  value={tableElement.style.headerTextColor}
                  onChange={(e) => {
                    updateElement(tableElement.id, {
                      style: { ...tableElement.style, headerTextColor: e.target.value }
                    });
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Border Width</Label>
              <Input 
                type="number" 
                value={tableElement.style.borderWidth}
                onChange={(e) => {
                  updateElement(tableElement.id, {
                    style: { ...tableElement.style, borderWidth: parseInt(e.target.value) || 0 }
                  });
                }}
                min={0}
                max={10}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Border Color</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="color" 
                  value={tableElement.style.borderColor}
                  className="w-12 h-8 p-1"
                  onChange={(e) => {
                    updateElement(tableElement.id, {
                      style: { ...tableElement.style, borderColor: e.target.value }
                    });
                  }}
                />
                <Input 
                  type="text" 
                  value={tableElement.style.borderColor}
                  onChange={(e) => {
                    updateElement(tableElement.id, {
                      style: { ...tableElement.style, borderColor: e.target.value }
                    });
                  }}
                />
              </div>
            </div>
            
            {/* Table Headers Editor */}
            <div className="space-y-2 mt-4">
              <Label>Edit Table Headers</Label>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-2 border rounded">
                {tableElement.headers.map((header: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input 
                      value={header}
                      onChange={(e) => {
                        const newHeaders = [...tableElement.headers];
                        newHeaders[index] = e.target.value;
                        updateElement(tableElement.id, { headers: newHeaders });
                      }}
                      placeholder={`Header ${index+1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Table Cells Editor */}
            <div className="space-y-2 mt-4">
              <Label>Edit Table Cells</Label>
              <div className="max-h-60 overflow-y-auto p-2 border rounded">
                {tableElement.data.map((row: string[], rowIndex: number) => (
                  <div key={rowIndex} className="mb-2">
                    <div className="text-xs text-muted-foreground mb-1">Row {rowIndex+1}</div>
                    <div className="grid grid-cols-1 gap-2">
                      {row.map((cell: string, cellIndex: number) => (
                        <div key={cellIndex} className="flex items-center space-x-2">
                          <div className="text-xs text-muted-foreground w-12">Col {cellIndex+1}</div>
                          <Input 
                            value={cell}
                            onChange={(e) => {
                              const newData = [...tableElement.data];
                              newData[rowIndex][cellIndex] = e.target.value;
                              updateElement(tableElement.id, { data: newData });
                            }}
                            placeholder={`Row ${rowIndex+1}, Cell ${cellIndex+1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {commonProps}
          </>
        );
      }
      case 'container': {
        const containerElement = selectedElement as any;
        return (
          <>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="color" 
                  value={containerElement.style.backgroundColor}
                  className="w-12 h-8 p-1"
                  onChange={(e) => {
                    updateElement(containerElement.id, {
                      style: { ...containerElement.style, backgroundColor: e.target.value }
                    });
                  }}
                />
                <Input 
                  type="text" 
                  value={containerElement.style.backgroundColor}
                  onChange={(e) => {
                    updateElement(containerElement.id, {
                      style: { ...containerElement.style, backgroundColor: e.target.value }
                    });
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Border Radius</Label>
              <Input 
                type="number" 
                value={containerElement.style.borderRadius} 
                onChange={(e) => {
                  updateElement(containerElement.id, {
                    style: { ...containerElement.style, borderRadius: parseInt(e.target.value) || 0 }
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Border Width</Label>
              <Input 
                type="number" 
                value={containerElement.style.borderWidth} 
                onChange={(e) => {
                  updateElement(containerElement.id, {
                    style: { ...containerElement.style, borderWidth: parseInt(e.target.value) || 0 }
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Border Color</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="color" 
                  value={containerElement.style.borderColor}
                  className="w-12 h-8 p-1"
                  onChange={(e) => {
                    updateElement(containerElement.id, {
                      style: { ...containerElement.style, borderColor: e.target.value }
                    });
                  }}
                />
                <Input 
                  type="text" 
                  value={containerElement.style.borderColor}
                  onChange={(e) => {
                    updateElement(containerElement.id, {
                      style: { ...containerElement.style, borderColor: e.target.value }
                    });
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Min Height</Label>
              <Input 
                type="number" 
                value={containerElement.style.minHeight} 
                onChange={(e) => {
                  updateElement(containerElement.id, {
                    style: { ...containerElement.style, minHeight: parseInt(e.target.value) || 100 }
                  });
                }}
              />
            </div>
            
            {commonProps}
          </>
        );
      }
      
      case 'two-column': {
        const twoColumnElement = selectedElement as any;
        return (
          <>
            <div className="space-y-2">
              <Label>Gap Between Columns</Label>
              <Input 
                type="number" 
                value={twoColumnElement.style.gap} 
                onChange={(e) => {
                  updateElement(twoColumnElement.id, {
                    style: { ...twoColumnElement.style, gap: parseInt(e.target.value) || 0 }
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="color" 
                  value={twoColumnElement.style.backgroundColor}
                  className="w-12 h-8 p-1"
                  onChange={(e) => {
                    updateElement(twoColumnElement.id, {
                      style: { ...twoColumnElement.style, backgroundColor: e.target.value }
                    });
                  }}
                />
                <Input 
                  type="text" 
                  value={twoColumnElement.style.backgroundColor}
                  onChange={(e) => {
                    updateElement(twoColumnElement.id, {
                      style: { ...twoColumnElement.style, backgroundColor: e.target.value }
                    });
                  }}
                />
              </div>
            </div>
            
            {commonProps}
          </>
        );
      }
      
      case 'gallery': {
        const galleryElement = selectedElement as any;
        return (
          <>
            <div className="space-y-2">
              <Label>Number of Columns</Label>
              <Input 
                type="number" 
                value={galleryElement.style.columns} 
                onChange={(e) => {
                  updateElement(galleryElement.id, {
                    style: { ...galleryElement.style, columns: parseInt(e.target.value) || 1 }
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Gap Between Images</Label>
              <Input 
                type="number" 
                value={galleryElement.style.gap} 
                onChange={(e) => {
                  updateElement(galleryElement.id, {
                    style: { ...galleryElement.style, gap: parseInt(e.target.value) || 0 }
                  });
                }}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Images</Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const newImages = [...galleryElement.images];
                    newImages.push({
                      id: `img-${Date.now()}`,
                      src: getImagePlaceholder(300, 200),
                      alt: 'New image'
                    });
                    updateElement(galleryElement.id, { images: newImages });
                  }}
                >
                  Add Image
                </Button>
              </div>
              
              <div className="space-y-4 max-h-60 overflow-y-auto p-2 border rounded-md">
                {galleryElement.images.map((image: any, index: number) => (
                  <div key={image.id} className="border p-3 rounded-md space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Image {index + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 h-8 w-8 p-0"
                        onClick={() => {
                          const newImages = [...galleryElement.images];
                          newImages.splice(index, 1);
                          updateElement(galleryElement.id, { images: newImages });
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden flex items-center justify-center mb-2">
                      <img 
                        src={processImageUrl(image.src)} 
                        alt={image.alt}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          // If image fails to load, replace with placeholder
                          const target = e.target as HTMLImageElement;
                          target.src = getImagePlaceholder(300, 200);
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Image</Label>
                      <ImageUploader 
                        onImageUploaded={(imageUrl) => {
                          const newImages = [...galleryElement.images];
                          newImages[index] = { ...image, src: imageUrl };
                          updateElement(galleryElement.id, { images: newImages });
                        }}
                        showPreview={false}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Alt Text</Label>
                      <Input 
                        type="text" 
                        value={image.alt} 
                        onChange={(e) => {
                          const newImages = [...galleryElement.images];
                          newImages[index] = { ...image, alt: e.target.value };
                          updateElement(galleryElement.id, { images: newImages });
                        }}
                        placeholder="Describe the image for accessibility"
                      />
                    </div>
                  </div>
                ))}
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
      case 'video': return 'Video';
      case 'link': return 'Link';
      case 'table': return 'Table';
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
    <div className="bg-background border-l border-border w-full md:w-80 md:flex-shrink-0 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">
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
