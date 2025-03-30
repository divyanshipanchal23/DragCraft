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
  FontWeight,
  FormattedRange 
} from '../types/element';
import { getImagePlaceholder } from './url-helpers';

export const createElementId = () => uuidv4();

export const createDropZoneId = () => uuidv4();

export const defaultTemplateId = 'template-1';
export const template2Id = 'template-2';
export const template3Id = 'template-3';

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
        formattedRanges: [],
        style: {
          ...baseElement.style,
          fontSize: '24px',
          fontWeight: 'bold',
          fontFamily: 'Arial',
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
        formattedRanges: [],
        listType: 'none',
        style: {
          ...baseElement.style,
          fontSize: '16px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
          color: '#4B5563',
          alignment: 'left'
        }
      };
    
    case 'image':
      return {
        ...baseElement,
        type: 'image',
        src: getImagePlaceholder(600, 400),
        alt: 'Laptop with code',
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
          fontSize: '16px',
          fontWeight: 'normal',
          fontFamily: 'Arial',
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
            src: getImagePlaceholder(300, 200),
            alt: 'Laptop with code 1'
          },
          {
            id: uuidv4(),
            src: getImagePlaceholder(300, 200),
            alt: 'Laptop with code 2'
          },
          {
            id: uuidv4(),
            src: getImagePlaceholder(300, 200),
            alt: 'Laptop with code 3'
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
        // Using a YouTube embed URL as default, but users can paste any YouTube link format
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
          alignment: 'left',
          fontFamily: 'Arial'
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
          width: '100%',
          fontFamily: 'Arial'
        }
      };
    
    default:
      return baseElement as any;
  }
};

// Create default template
// Create Template 1 (Default)
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
    formattedRanges: [],
    style: {
      margin: 16,
      padding: 8,
      fontSize: '28px',
      fontWeight: 'bold',
      fontFamily: 'Arial',
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
    formattedRanges: [],
    listType: 'none',
    style: {
      margin: 16,
      padding: 8,
      fontSize: '16px',
      fontWeight: 'normal',
      fontFamily: 'Arial',
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
    src: getImagePlaceholder(600, 400),
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
      fontFamily: 'Arial',
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

// Create Template 2 (Portfolio)
export const createTemplate2 = (): [Template, Record<string, DropZone>, Record<string, Element>] => {
  // Create drop zones
  const heroDropZoneId = createDropZoneId();
  const aboutDropZoneId = createDropZoneId();
  const portfolioDropZoneId = createDropZoneId();
  const contactDropZoneId = createDropZoneId(); 
  const footerDropZoneId = createDropZoneId();
  
  // Create initial elements
  const heroHeadingId = createElementId();
  const heroSubheadingId = createElementId();
  const heroButtonId = createElementId();
  const aboutHeadingId = createElementId();
  const aboutParagraphId = createElementId();
  const portfolioHeadingId = createElementId();
  const galleryId = createElementId();
  const contactHeadingId = createElementId();
  const contactFormId = createElementId();
  
  // Create hero elements
  const heroHeadingElement: Element = {
    id: heroHeadingId,
    type: 'heading',
    parentId: heroDropZoneId,
    position: { x: 0, y: 0 },
    content: 'Creative Portfolio',
    richText: false,
    textFormatting: {
      bold: true,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false,
      superscript: false
    },
    formattedRanges: [],
    style: {
      margin: 16,
      padding: 8,
      fontSize: '32px',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      alignment: 'center'
    }
  };
  
  const heroSubheadingElement: Element = {
    id: heroSubheadingId,
    type: 'paragraph',
    parentId: heroDropZoneId,
    position: { x: 0, y: 0 },
    content: 'Showcase your best work with this professional portfolio template',
    richText: false,
    textFormatting: {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false, 
      superscript: false
    },
    formattedRanges: [],
    listType: 'none',
    style: {
      margin: 16,
      padding: 8,
      fontSize: '20px',
      fontWeight: 'normal',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      alignment: 'center'
    }
  };
  
  const heroButtonElement: Element = {
    id: heroButtonId,
    type: 'button',
    parentId: heroDropZoneId,
    position: { x: 0, y: 0 },
    content: 'View My Work',
    link: '#portfolio',
    style: {
      margin: 16,
      padding: 8,
      backgroundColor: '#FFFFFF',
      color: '#3B82F6',
      fontSize: '16px',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      borderRadius: 4,
      alignment: 'center'
    }
  };
  
  // Create about elements
  const aboutHeadingElement: Element = {
    id: aboutHeadingId,
    type: 'heading',
    parentId: aboutDropZoneId,
    position: { x: 0, y: 0 },
    content: 'About Me',
    richText: false,
    textFormatting: {
      bold: true,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false,
      superscript: false
    },
    formattedRanges: [],
    style: {
      margin: 16,
      padding: 8,
      fontSize: '24px',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      color: '#000000',
      alignment: 'center'
    }
  };
  
  const aboutParagraphElement: Element = {
    id: aboutParagraphId,
    type: 'paragraph',
    parentId: aboutDropZoneId,
    position: { x: 0, y: 0 },
    content: 'I am a creative professional with over 10 years of experience in design and development. My passion is creating beautiful, functional websites that help businesses grow.',
    richText: false,
    textFormatting: {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false,
      superscript: false
    },
    formattedRanges: [],
    listType: 'none',
    style: {
      margin: 16,
      padding: 8,
      fontSize: '16px',
      fontWeight: 'normal',
      fontFamily: 'Arial',
      color: '#4B5563',
      alignment: 'center'
    }
  };
  
  // Create portfolio elements
  const portfolioHeadingElement: Element = {
    id: portfolioHeadingId,
    type: 'heading',
    parentId: portfolioDropZoneId,
    position: { x: 0, y: 0 },
    content: 'My Portfolio',
    richText: false,
    textFormatting: {
      bold: true,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false,
      superscript: false
    },
    formattedRanges: [],
    style: {
      margin: 16,
      padding: 8,
      fontSize: '24px',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      color: '#000000',
      alignment: 'center'
    }
  };
  
  const galleryElement: Element = {
    id: galleryId,
    type: 'gallery',
    parentId: portfolioDropZoneId,
    position: { x: 0, y: 0 },
    images: [
      {
        id: uuidv4(),
        src: getImagePlaceholder(300, 200),
        alt: 'Project 1'
      },
      {
        id: uuidv4(),
        src: getImagePlaceholder(300, 200),
        alt: 'Project 2'
      },
      {
        id: uuidv4(),
        src: getImagePlaceholder(300, 200),
        alt: 'Project 3'
      }
    ],
    style: {
      margin: 16,
      padding: 8,
      columns: 3,
      gap: 16
    }
  };
  
  // Create contact elements
  const contactHeadingElement: Element = {
    id: contactHeadingId,
    type: 'heading',
    parentId: contactDropZoneId,
    position: { x: 0, y: 0 },
    content: 'Contact Me',
    richText: false,
    textFormatting: {
      bold: true,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false,
      superscript: false
    },
    formattedRanges: [],
    style: {
      margin: 16,
      padding: 8,
      fontSize: '24px',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      color: '#000000',
      alignment: 'center'
    }
  };
  
  const contactFormElement: Element = {
    id: contactFormId,
    type: 'form',
    parentId: contactDropZoneId,
    position: { x: 0, y: 0 },
    fields: [
      {
        id: uuidv4(),
        type: 'text',
        label: 'Name',
        placeholder: 'Your name',
        required: true
      },
      {
        id: uuidv4(),
        type: 'email',
        label: 'Email',
        placeholder: 'Your email',
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
      text: 'Send Message',
      backgroundColor: '#3B82F6',
      color: '#FFFFFF'
    },
    style: {
      margin: 16,
      padding: 16,
      backgroundColor: '#FFFFFF',
      gap: 16
    }
  };
  
  // Define drop zones
  const dropZones: Record<string, DropZone> = {
    [heroDropZoneId]: {
      id: heroDropZoneId,
      parentId: null,
      elements: [heroHeadingId, heroSubheadingId, heroButtonId]
    },
    [aboutDropZoneId]: {
      id: aboutDropZoneId,
      parentId: null,
      elements: [aboutHeadingId, aboutParagraphId]
    },
    [portfolioDropZoneId]: {
      id: portfolioDropZoneId,
      parentId: null,
      elements: [portfolioHeadingId, galleryId]
    },
    [contactDropZoneId]: {
      id: contactDropZoneId,
      parentId: null,
      elements: [contactHeadingId, contactFormId]
    },
    [footerDropZoneId]: {
      id: footerDropZoneId,
      parentId: null,
      elements: []
    }
  };
  
  // Define elements
  const elements: Record<string, Element> = {
    [heroHeadingId]: heroHeadingElement,
    [heroSubheadingId]: heroSubheadingElement,
    [heroButtonId]: heroButtonElement,
    [aboutHeadingId]: aboutHeadingElement,
    [aboutParagraphId]: aboutParagraphElement,
    [portfolioHeadingId]: portfolioHeadingElement,
    [galleryId]: galleryElement,
    [contactHeadingId]: contactHeadingElement,
    [contactFormId]: contactFormElement
  };
  
  // Define template
  const template: Template = {
    id: template2Id,
    name: 'Template 2',
    dropZones: [
      dropZones[heroDropZoneId],
      dropZones[aboutDropZoneId],
      dropZones[portfolioDropZoneId],
      dropZones[contactDropZoneId],
      dropZones[footerDropZoneId]
    ]
  };
  
  return [template, dropZones, elements];
};

// Create Template 3 (Business)
export const createTemplate3 = (): [Template, Record<string, DropZone>, Record<string, Element>] => {
  // Create drop zones
  const headerDropZoneId = createDropZoneId();
  const heroDropZoneId = createDropZoneId();
  const featuresDropZoneId = createDropZoneId();
  const pricingDropZoneId = createDropZoneId();
  const ctaDropZoneId = createDropZoneId();
  const footerDropZoneId = createDropZoneId();
  
  // Create initial elements
  const logoId = createElementId();
  const heroHeadingId = createElementId();
  const heroParagraphId = createElementId();
  const heroButtonId = createElementId();
  const featuresHeadingId = createElementId();
  const featuresParagraphId = createElementId();
  const pricingHeadingId = createElementId();
  const pricingTableId = createElementId();
  const ctaHeadingId = createElementId();
  const ctaButtonId = createElementId();
  
  // Create header elements
  const logoElement: Element = {
    id: logoId,
    type: 'heading',
    parentId: headerDropZoneId,
    position: { x: 0, y: 0 },
    content: 'Business Pro',
    richText: false,
    textFormatting: {
      bold: true,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false,
      superscript: false
    },
    formattedRanges: [],
    style: {
      margin: 16,
      padding: 8,
      fontSize: 'large',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      color: '#000000',
      alignment: 'left'
    }
  };
  
  // Create hero elements
  const heroHeadingElement: Element = {
    id: heroHeadingId,
    type: 'heading',
    parentId: heroDropZoneId,
    position: { x: 0, y: 0 },
    content: 'Professional Business Solutions',
    richText: false,
    textFormatting: {
      bold: true,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false,
      superscript: false
    },
    formattedRanges: [],
    style: {
      margin: 16,
      padding: 8,
      fontSize: 'extra-large',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      color: '#000000',
      alignment: 'center'
    }
  };
  
  const heroParagraphElement: Element = {
    id: heroParagraphId,
    type: 'paragraph',
    parentId: heroDropZoneId,
    position: { x: 0, y: 0 },
    content: 'We help businesses grow with cutting-edge technology and proven strategies. Our team of experts is ready to help you succeed.',
    richText: false,
    textFormatting: {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false,
      superscript: false
    },
    formattedRanges: [],
    listType: 'none',
    style: {
      margin: 16,
      padding: 8,
      fontSize: 'medium',
      fontWeight: 'normal',
      fontFamily: 'Arial',
      color: '#4B5563',
      alignment: 'center'
    }
  };
  
  const heroButtonElement: Element = {
    id: heroButtonId,
    type: 'button',
    parentId: heroDropZoneId,
    position: { x: 0, y: 0 },
    content: 'Get Started',
    link: '#',
    style: {
      margin: 16,
      padding: 8,
      backgroundColor: '#3B82F6',
      color: '#FFFFFF',
      fontSize: 'medium',
      fontWeight: 'normal',
      fontFamily: 'Arial',
      borderRadius: 4,
      alignment: 'center'
    }
  };
  
  // Create features elements
  const featuresHeadingElement: Element = {
    id: featuresHeadingId,
    type: 'heading',
    parentId: featuresDropZoneId,
    position: { x: 0, y: 0 },
    content: 'Our Services',
    richText: false,
    textFormatting: {
      bold: true,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false,
      superscript: false
    },
    formattedRanges: [],
    style: {
      margin: 16,
      padding: 8,
      fontSize: 'large',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      color: '#000000',
      alignment: 'center'
    }
  };
  
  const featuresParagraphElement: Element = {
    id: featuresParagraphId,
    type: 'paragraph',
    parentId: featuresDropZoneId,
    position: { x: 0, y: 0 },
    content: 'We offer a range of services to help your business succeed. From digital marketing to custom software development, we have the expertise to help you grow.',
    richText: false,
    textFormatting: {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false,
      superscript: false
    },
    formattedRanges: [],
    listType: 'none',
    style: {
      margin: 16,
      padding: 8,
      fontSize: 'medium',
      fontWeight: 'normal',
      fontFamily: 'Arial',
      color: '#4B5563',
      alignment: 'center'
    }
  };
  
  // Create pricing elements
  const pricingHeadingElement: Element = {
    id: pricingHeadingId,
    type: 'heading',
    parentId: pricingDropZoneId,
    position: { x: 0, y: 0 },
    content: 'Pricing Plans',
    richText: false,
    textFormatting: {
      bold: true,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false,
      superscript: false
    },
    formattedRanges: [],
    style: {
      margin: 16,
      padding: 8,
      fontSize: 'large',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      color: '#000000',
      alignment: 'center'
    }
  };
  
  const pricingTableElement: Element = {
    id: pricingTableId,
    type: 'table',
    parentId: pricingDropZoneId,
    position: { x: 0, y: 0 },
    rows: 4,
    columns: 4,
    headers: ['Plan', 'Basic', 'Pro', 'Enterprise'],
    data: [
      ['Price', '$29/mo', '$49/mo', '$99/mo'],
      ['Users', '1-3', '1-10', 'Unlimited'],
      ['Features', 'Basic features', 'Advanced features', 'All features']
    ],
    style: {
      margin: 16,
      padding: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      headerBackgroundColor: '#F3F4F6',
      headerTextColor: '#111827',
      rowBackgroundColor: '#FFFFFF',
      rowTextColor: '#4B5563',
      fontSize: 'small',
      width: '100%',
      fontFamily: 'Arial'
    }
  };
  
  // Create CTA elements
  const ctaHeadingElement: Element = {
    id: ctaHeadingId,
    type: 'heading',
    parentId: ctaDropZoneId,
    position: { x: 0, y: 0 },
    content: 'Ready to get started?',
    richText: false,
    textFormatting: {
      bold: true,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false,
      superscript: false
    },
    formattedRanges: [],
    style: {
      margin: 16,
      padding: 8,
      fontSize: 'large',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      color: '#FFFFFF',
      alignment: 'center'
    }
  };
  
  const ctaButtonElement: Element = {
    id: ctaButtonId,
    type: 'button',
    parentId: ctaDropZoneId,
    position: { x: 0, y: 0 },
    content: 'Contact Us',
    link: '#',
    style: {
      margin: 16,
      padding: 8,
      backgroundColor: '#FFFFFF',
      color: '#3B82F6',
      fontSize: 'medium',
      fontWeight: 'bold',
      fontFamily: 'Arial',
      borderRadius: 4,
      alignment: 'center'
    }
  };
  
  // Define drop zones
  const dropZones: Record<string, DropZone> = {
    [headerDropZoneId]: {
      id: headerDropZoneId,
      parentId: null,
      elements: [logoId]
    },
    [heroDropZoneId]: {
      id: heroDropZoneId,
      parentId: null,
      elements: [heroHeadingId, heroParagraphId, heroButtonId]
    },
    [featuresDropZoneId]: {
      id: featuresDropZoneId,
      parentId: null,
      elements: [featuresHeadingId, featuresParagraphId]
    },
    [pricingDropZoneId]: {
      id: pricingDropZoneId,
      parentId: null,
      elements: [pricingHeadingId, pricingTableId]
    },
    [ctaDropZoneId]: {
      id: ctaDropZoneId,
      parentId: null,
      elements: [ctaHeadingId, ctaButtonId]
    },
    [footerDropZoneId]: {
      id: footerDropZoneId,
      parentId: null,
      elements: []
    }
  };
  
  // Define elements
  const elements: Record<string, Element> = {
    [logoId]: logoElement,
    [heroHeadingId]: heroHeadingElement,
    [heroParagraphId]: heroParagraphElement,
    [heroButtonId]: heroButtonElement,
    [featuresHeadingId]: featuresHeadingElement,
    [featuresParagraphId]: featuresParagraphElement,
    [pricingHeadingId]: pricingHeadingElement,
    [pricingTableId]: pricingTableElement,
    [ctaHeadingId]: ctaHeadingElement,
    [ctaButtonId]: ctaButtonElement
  };
  
  // Define template
  const template: Template = {
    id: template3Id,
    name: 'Template 3',
    dropZones: [
      dropZones[headerDropZoneId],
      dropZones[heroDropZoneId],
      dropZones[featuresDropZoneId],
      dropZones[pricingDropZoneId],
      dropZones[ctaDropZoneId],
      dropZones[footerDropZoneId]
    ]
  };
  
  return [template, dropZones, elements];
};
