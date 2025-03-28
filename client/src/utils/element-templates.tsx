import { v4 as uuidv4 } from 'uuid';
import { 
  Element, 
  ElementType, 
  DropZone, 
  Template, 
  BuilderState,
  VideoElement,
  LinkElement,
  TableElement,
  FontWeight 
} from '../types/element';

export const createElementId = () => uuidv4();

export const createDropZoneId = () => uuidv4();

export const defaultTemplateId = 'default-template';

// Default elements to show in the toolbox
export const getElementsToolboxItems = () => {
  const types: ElementType[] = [
    'heading',
    'paragraph',
    'image',
    'button',
    'container',
    'two-column',
    'form',
    'gallery',
    'video',
    'link',
    'table'
  ];
  
  return types;
};

// Create a new element based on type
export const createNewElement = (type: ElementType, parentId: string | null = null): Element => {
  const baseElement = {
    id: createElementId(),
    type,
    parentId,
    position: {
      x: 0,
      y: 0
    },
    style: {
      margin: 16,
      padding: 8
    }
  };

  switch (type) {
    case 'heading':
      return {
        ...baseElement,
        type: 'heading',
        content: 'New Heading',
        richText: false,
        textFormatting: {
          bold: true,
          italic: false,
          underline: false,
          strikethrough: false,
          subscript: false,
          superscript: false
        },
        style: {
          ...baseElement.style,
          fontSize: 'large',
          fontWeight: 'bold',
          color: '#000000',
          alignment: 'left'
        }
      };
    
    case 'paragraph':
      return {
        ...baseElement,
        type: 'paragraph',
        content: 'New paragraph text. Click to edit content.',
        richText: false,
        textFormatting: {
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          subscript: false,
          superscript: false
        },
        listType: 'none',
        style: {
          ...baseElement.style,
          fontSize: 'medium',
          fontWeight: 'normal',
          color: '#4B5563',
          alignment: 'left'
        }
      };
    
    case 'image':
      return {
        ...baseElement,
        type: 'image',
        src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=60',
        alt: 'Placeholder image',
        style: {
          ...baseElement.style,
          width: '100%',
          height: 'auto',
          borderRadius: 4
        }
      };
    
    case 'button':
      return {
        ...baseElement,
        type: 'button',
        content: 'Button',
        link: '#',
        style: {
          ...baseElement.style,
          backgroundColor: '#3B82F6',
          color: '#FFFFFF',
          fontSize: 'medium',
          fontWeight: 'normal',
          borderRadius: 4,
          alignment: 'center'
        }
      };
    
    case 'container':
      return {
        ...baseElement,
        type: 'container',
        children: [],
        style: {
          ...baseElement.style,
          backgroundColor: '#FFFFFF',
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          minHeight: 100
        }
      };
    
    case 'two-column':
      return {
        ...baseElement,
        type: 'two-column',
        leftColumn: [],
        rightColumn: [],
        style: {
          ...baseElement.style,
          gap: 16,
          backgroundColor: '#FFFFFF'
        }
      };
    
    case 'form':
      return {
        ...baseElement,
        type: 'form',
        fields: [
          {
            id: uuidv4(),
            type: 'text',
            label: 'Name',
            placeholder: 'Enter your name',
            required: true
          },
          {
            id: uuidv4(),
            type: 'email',
            label: 'Email',
            placeholder: 'Enter your email',
            required: true
          },
          {
            id: uuidv4(),
            type: 'textarea',
            label: 'Message',
            placeholder: 'Your message',
            required: true
          }
        ],
        submitButton: {
          text: 'Submit',
          backgroundColor: '#3B82F6',
          color: '#FFFFFF'
        },
        style: {
          ...baseElement.style,
          backgroundColor: '#FFFFFF',
          gap: 16
        }
      };
    
    case 'gallery':
      return {
        ...baseElement,
        type: 'gallery',
        images: [
          {
            id: uuidv4(),
            src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=60',
            alt: 'Gallery image 1'
          },
          {
            id: uuidv4(),
            src: 'https://images.unsplash.com/photo-1476611317561-60117649dd94?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=60',
            alt: 'Gallery image 2'
          },
          {
            id: uuidv4(),
            src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=60',
            alt: 'Gallery image 3'
          }
        ],
        style: {
          ...baseElement.style,
          columns: 3,
          gap: 16
        }
      };
      
    case 'video':
      return {
        ...baseElement,
        type: 'video',
        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        title: 'Video Title',
        autoplay: false,
        controls: true,
        loop: false,
        muted: false,
        style: {
          ...baseElement.style,
          width: '100%',
          height: 'auto',
          borderRadius: 4,
          alignment: 'center'
        }
      };
      
    case 'link':
      return {
        ...baseElement,
        type: 'link',
        content: 'Click Here',
        href: 'https://www.example.com',
        target: '_blank',
        style: {
          ...baseElement.style,
          color: '#3B82F6',
          fontSize: 'medium',
          fontWeight: 'normal',
          textDecoration: 'underline',
          alignment: 'left'
        }
      };
      
    case 'table':
      return {
        ...baseElement,
        type: 'table',
        rows: 3,
        columns: 3,
        headers: ['Header 1', 'Header 2', 'Header 3'],
        data: [
          ['Row 1, Cell 1', 'Row 1, Cell 2', 'Row 1, Cell 3'],
          ['Row 2, Cell 1', 'Row 2, Cell 2', 'Row 2, Cell 3']
        ],
        style: {
          ...baseElement.style,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          headerBackgroundColor: '#F3F4F6',
          headerTextColor: '#111827',
          rowBackgroundColor: '#FFFFFF',
          rowTextColor: '#4B5563',
          fontSize: 'small',
          width: '100%'
        }
      };
    
    default:
      return baseElement as any;
  }
};

// Create default template
export const createDefaultTemplate = (): [Template, Record<string, DropZone>, Record<string, Element>] => {
  // Create drop zones
  const headerDropZoneId = createDropZoneId();
  const mainContentLeftDropZoneId = createDropZoneId();
  const mainContentRightDropZoneId = createDropZoneId();
  const buttonRowDropZoneId = createDropZoneId();
  const thirdRowDropZoneId = createDropZoneId();
  const footerDropZoneId = createDropZoneId();
  
  // Create initial elements
  const headingId = createElementId();
  const paragraphId = createElementId();
  const imageId = createElementId();
  const buttonId = createElementId();
  
  // Create heading element
  const headingElement: Element = {
    id: headingId,
    type: 'heading',
    parentId: mainContentLeftDropZoneId,
    position: { x: 0, y: 0 },
    content: 'Welcome to Your Website',
    richText: false,
    textFormatting: {
      bold: true,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false,
      superscript: false
    },
    style: {
      margin: 16,
      padding: 8,
      fontSize: 'large',
      fontWeight: 'bold',
      color: '#000000',
      alignment: 'left'
    }
  };
  
  // Create paragraph element
  const paragraphElement: Element = {
    id: paragraphId,
    type: 'paragraph',
    parentId: mainContentLeftDropZoneId,
    position: { x: 0, y: 0 },
    content: 'Easily build your website using our drag-and-drop interface. Add text, images, buttons, and more to create a stunning website.',
    richText: false,
    textFormatting: {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false,
      superscript: false
    },
    listType: 'none',
    style: {
      margin: 16,
      padding: 8,
      fontSize: 'medium',
      fontWeight: 'normal',
      color: '#4B5563',
      alignment: 'left'
    }
  };
  
  // Create image element
  const imageElement: Element = {
    id: imageId,
    type: 'image',
    parentId: mainContentRightDropZoneId,
    position: { x: 0, y: 0 },
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=60',
    alt: 'Laptop with code',
    style: {
      margin: 0,
      padding: 0,
      width: '100%',
      height: 'auto',
      borderRadius: 4
    }
  };
  
  // Create button element
  const buttonElement: Element = {
    id: buttonId,
    type: 'button',
    parentId: buttonRowDropZoneId,
    position: { x: 0, y: 0 },
    content: 'Learn More',
    link: '#',
    style: {
      margin: 16,
      padding: 8,
      backgroundColor: '#3B82F6',
      color: '#FFFFFF',
      fontSize: 'medium',
      fontWeight: 'normal',
      borderRadius: 4,
      alignment: 'center'
    }
  };
  
  // Define drop zones
  const dropZones: Record<string, DropZone> = {
    [headerDropZoneId]: {
      id: headerDropZoneId,
      parentId: null,
      elements: []
    },
    [mainContentLeftDropZoneId]: {
      id: mainContentLeftDropZoneId,
      parentId: null,
      elements: [headingId, paragraphId]
    },
    [mainContentRightDropZoneId]: {
      id: mainContentRightDropZoneId,
      parentId: null,
      elements: [imageId]
    },
    [buttonRowDropZoneId]: {
      id: buttonRowDropZoneId,
      parentId: null,
      elements: [buttonId]
    },
    [thirdRowDropZoneId]: {
      id: thirdRowDropZoneId,
      parentId: null,
      elements: []
    },
    [footerDropZoneId]: {
      id: footerDropZoneId,
      parentId: null,
      elements: []
    }
  };
  
  // Define elements
  const elements: Record<string, Element> = {
    [headingId]: headingElement,
    [paragraphId]: paragraphElement,
    [imageId]: imageElement,
    [buttonId]: buttonElement
  };
  
  // Define template
  const template: Template = {
    id: defaultTemplateId,
    name: 'Template 1',
    dropZones: [
      dropZones[headerDropZoneId],
      dropZones[mainContentLeftDropZoneId],
      dropZones[mainContentRightDropZoneId],
      dropZones[buttonRowDropZoneId],
      dropZones[thirdRowDropZoneId],
      dropZones[footerDropZoneId]
    ]
  };
  
  return [template, dropZones, elements];
};
