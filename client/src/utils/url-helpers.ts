/**
 * Utility functions for handling URLs for videos, images, and other media
 */

// In development mode, define the API server base URL
// In production, this would be the same as the client origin or a CDN
const API_SERVER = import.meta.env.DEV ? 'http://localhost:3000' : '';

/**
 * Converts a standard YouTube URL to an embeddable URL
 * Handles various YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - Already embedded URLs are returned as is
 */
export function convertToYouTubeEmbedURL(url: string): string {
  if (!url) return '';
  
  // If URL is already in embed format, return it
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Extract video ID from various YouTube URL formats
  let videoId = '';
  
  // Standard YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
  // Can also include other parameters like &t=10s
  if (url.includes('youtube.com/watch')) {
    const urlObj = new URL(url);
    videoId = urlObj.searchParams.get('v') || '';
  }
  // Short YouTube URL: https://youtu.be/VIDEO_ID
  else if (url.includes('youtu.be/')) {
    const matches = url.match(/youtu\.be\/([^?&]+)/);
    videoId = matches?.[1] || '';
  }
  // YouTube Shorts: https://youtube.com/shorts/VIDEO_ID
  else if (url.includes('youtube.com/shorts/')) {
    const matches = url.match(/shorts\/([^?&]+)/);
    videoId = matches?.[1] || '';
  }
  
  // If we found a video ID, construct the embed URL
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // If we couldn't parse the URL, return the original
  // This allows for other platforms like Vimeo to still work
  return url;
}

/**
 * Adds appropriate parameters to a YouTube embed URL
 */
export function addYouTubeParams(embedUrl: string, options: {
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}): string {
  if (!embedUrl) return '';
  
  try {
    const urlObj = new URL(embedUrl);
    
    // Add parameters to the URL
    if (options.controls !== undefined) {
      urlObj.searchParams.set('controls', options.controls ? '1' : '0');
    }
    
    if (options.autoplay !== undefined) {
      urlObj.searchParams.set('autoplay', options.autoplay ? '1' : '0');
    }
    
    if (options.loop !== undefined) {
      urlObj.searchParams.set('loop', options.loop ? '1' : '0');
    }
    
    if (options.muted !== undefined) {
      // YouTube uses 'mute' not 'muted'
      urlObj.searchParams.set('mute', options.muted ? '1' : '0');
    }
    
    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, return the original URL
    return embedUrl;
  }
}

/**
 * Safely parses a URL, ensuring it has a protocol
 */
export function ensureProtocol(url: string): string {
  if (!url) return '';
  
  // If URL doesn't have protocol, add https://
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
    return `https://${url}`;
  }
  
  return url;
}

/**
 * Corrects server-relative URLs by adding the API server origin when needed
 * Handles uploaded image URLs from our server
 */
export function normalizeServerUrl(url: string): string {
  if (!url) return '';
  
  // If it's a server-relative URL (starts with /uploads/)
  if (url.startsWith('/uploads/')) {
    return `${API_SERVER}${url}`;
  }
  
  return url;
}

/**
 * Returns a placeholder image URL of a laptop with code (the original default)
 */
export function getImagePlaceholder(width: number = 600, height: number = 400): string {
  // This static image URL will show a laptop with code as was used originally
  return `https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=${width}&h=${height}&fit=crop&auto=format&q=80`;
}

/**
 * Processes an image URL to ensure it's a valid image link
 * - Handles server-uploaded images
 * - Returns a placeholder if empty
 */
export function processImageUrl(url: string): string {
  if (!url) {
    return getImagePlaceholder();
  }
  
  // Handle server-uploaded images
  if (url.startsWith('/uploads/')) {
    return normalizeServerUrl(url);
  }
  
  return url;
} 