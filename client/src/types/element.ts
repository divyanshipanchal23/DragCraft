export type ElementType = 
  | 'heading' 
  | 'paragraph' 
  | 'image' 
  | 'button' 
  | 'container' 
  | 'two-column' 
  | 'form' 
  | 'gallery'
  | 'video'
  | 'link'
  | 'table';

export type ElementAlignment = 'left' | 'center' | 'right';
export type FontWeight = 'light' | 'normal' | 'bold';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface BaseElementData {
  id: string;
  type: ElementType;
  parentId: string | null;
  position: {
    x: number;
    y: number;
  };
  style: {
    margin: number;
    padding: number;
  };
}

export interface HeadingElement extends BaseElementData {
  type: 'heading';
  content: string;
  richText: boolean;
  textFormatting?: TextFormatting;
  style: BaseElementData['style'] & {
    fontSize: FontSize;
    fontWeight: FontWeight;
    color: string;
    alignment: ElementAlignment;
  };
}

export interface ParagraphElement extends BaseElementData {
  type: 'paragraph';
  content: string;
  richText: boolean;
  textFormatting?: TextFormatting;
  listType?: ListType;
  style: BaseElementData['style'] & {
    fontSize: FontSize;
    fontWeight: FontWeight;
    color: string;
    alignment: ElementAlignment;
  };
}

export interface ImageElement extends BaseElementData {
  type: 'image';
  src: string;
  alt: string;
  style: BaseElementData['style'] & {
    width: string;
    height: string;
    borderRadius: number;
  };
}

export interface ButtonElement extends BaseElementData {
  type: 'button';
  content: string;
  link: string;
  style: BaseElementData['style'] & {
    backgroundColor: string;
    color: string;
    fontSize: FontSize;
    fontWeight: FontWeight;
    borderRadius: number;
    alignment: ElementAlignment;
  };
}

export interface ContainerElement extends BaseElementData {
  type: 'container';
  children: string[];
  style: BaseElementData['style'] & {
    backgroundColor: string;
    borderRadius: number;
    borderWidth: number;
    borderColor: string;
    minHeight: number;
  };
}

export interface TwoColumnElement extends BaseElementData {
  type: 'two-column';
  leftColumn: string[];
  rightColumn: string[];
  style: BaseElementData['style'] & {
    gap: number;
    backgroundColor: string;
  };
}

export interface FormElement extends BaseElementData {
  type: 'form';
  fields: {
    id: string;
    type: 'text' | 'email' | 'textarea';
    label: string;
    placeholder: string;
    required: boolean;
  }[];
  submitButton: {
    text: string;
    backgroundColor: string;
    color: string;
  };
  style: BaseElementData['style'] & {
    backgroundColor: string;
    gap: number;
  };
}

export interface GalleryElement extends BaseElementData {
  type: 'gallery';
  images: {
    id: string;
    src: string;
    alt: string;
  }[];
  style: BaseElementData['style'] & {
    columns: number;
    gap: number;
  };
}

export interface VideoElement extends BaseElementData {
  type: 'video';
  src: string;
  title: string;
  autoplay: boolean;
  controls: boolean;
  loop: boolean;
  muted: boolean;
  style: BaseElementData['style'] & {
    width: string;
    height: string;
    borderRadius: number;
    alignment: ElementAlignment;
  };
}

export interface LinkElement extends BaseElementData {
  type: 'link';
  content: string;
  href: string;
  target: '_self' | '_blank' | '_parent' | '_top';
  style: BaseElementData['style'] & {
    color: string;
    fontSize: FontSize;
    fontWeight: FontWeight;
    textDecoration: 'none' | 'underline' | 'overline' | 'line-through';
    alignment: ElementAlignment;
  };
}

export interface TableElement extends BaseElementData {
  type: 'table';
  rows: number;
  columns: number;
  headers: string[];
  data: string[][];
  style: BaseElementData['style'] & {
    borderWidth: number;
    borderColor: string;
    headerBackgroundColor: string;
    headerTextColor: string;
    rowBackgroundColor: string;
    rowTextColor: string;
    fontSize: FontSize;
    width: string;
  };
}

// Add text style related types for rich text editing
export type TextFormatting = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  subscript: boolean;
  superscript: boolean;
};

export type TextContent = {
  text: string;
  format?: TextFormatting;
};

export type ListType = 'none' | 'ordered' | 'unordered';

export type Element = 
  | HeadingElement 
  | ParagraphElement 
  | ImageElement 
  | ButtonElement 
  | ContainerElement 
  | TwoColumnElement 
  | FormElement 
  | GalleryElement
  | VideoElement
  | LinkElement
  | TableElement;

export interface DropZone {
  id: string;
  parentId: string | null;
  elements: string[];
}

export interface Template {
  id: string;
  name: string;
  dropZones: DropZone[];
}

export interface BuilderState {
  elements: Record<string, Element>;
  dropZones: Record<string, DropZone>;
  selectedElementId: string | null;
  selectedDropZoneId: string | null;
  templates: Template[];
  currentTemplateId: string | null;
  isDragging: boolean;
  isPreviewMode: boolean;
  viewMode: 'desktop' | 'tablet' | 'mobile';
}
