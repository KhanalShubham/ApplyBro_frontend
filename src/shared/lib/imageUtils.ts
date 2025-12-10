/**
 * Utility functions for handling image URLs
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';
const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:4000';

/**
 * Constructs a full image URL from a relative path
 * Uses API endpoint to serve files with proper CORS headers
 * @param imageUrl - The image URL (can be relative or absolute)
 * @returns Full URL to the image
 */
export const getImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    return '';
  }

  // If already an absolute URL (http:// or https://), return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a relative path starting with /uploads/, use API endpoint for CORS support
  if (imageUrl.startsWith('/uploads/')) {
    // Remove leading /uploads/ and use API endpoint
    const filePath = imageUrl.replace(/^\/uploads\//, '');
    return `${API_BASE_URL}/uploads/file/${filePath}`;
  }

  // If it's a relative path starting with /, prepend backend URL
  if (imageUrl.startsWith('/')) {
    return `${BACKEND_BASE_URL}${imageUrl}`;
  }

  // Otherwise, assume it's relative to backend uploads
  return `${API_BASE_URL}/uploads/file/${imageUrl}`;
};

