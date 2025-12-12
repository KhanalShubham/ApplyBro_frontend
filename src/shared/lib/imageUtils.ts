/**
 * Utility functions for handling image URLs
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';
const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:4000';

/**
 * Constructs a full image URL from a relative path
 * Uses direct backend URL to avoid CORS issues
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

  // For all relative paths starting with /, use direct backend URL (not API endpoint)
  // This serves files directly from backend, avoiding CORS issues with /api/v1 routes
  if (imageUrl.startsWith('/')) {
    return `${BACKEND_BASE_URL}${imageUrl}`;
  }

  // Otherwise, assume it's relative to backend uploads
  return `${BACKEND_BASE_URL}/uploads/${imageUrl}`;
};
