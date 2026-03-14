/**
 * Utility functions for handling image URLs
 * Supports both local uploads and Cloudinary URLs
 * Includes cache busting for updated images
 */

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

/**
 * Normalize image URL to full URL
 * - If URL starts with /uploads, prepend API_ORIGIN
 * - If URL is already a full URL (http/https), use as-is
 * - If URL is Cloudinary URL, use as-is
 */
export const normalizeImageUrl = (url: string | undefined | null, bustCache = false): string => {
  if (!url) {
    return 'https://via.placeholder.com/300';
  }

  let finalUrl = '';

  // If it's already a full URL (http/https), use it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    finalUrl = url;
  }
  // If it's a local upload path, prepend API origin
  else if (url.startsWith('/uploads')) {
    finalUrl = `${API_ORIGIN}${url}`;
  }
  // Default use as-is
  else {
    finalUrl = url;
  }

  // Add cache busting parameter if requested
  // This forces browser to re-fetch the image instead of using cache
  if (bustCache) {
    const separator = finalUrl.includes('?') ? '&' : '?';
    finalUrl = `${finalUrl}${separator}t=${Date.now()}`;
  }

  return finalUrl;
};

/**
 * Normalize multiple image URLs
 */
export const normalizeImageUrls = (urls: (string | undefined | null)[], bustCache = false): string[] => {
  return urls.map(url => normalizeImageUrl(url, bustCache));
};

/**
 * Get cache-busted URL for image
 * Use this when you want to force refresh an image that was just updated
 */
export const getCacheBustedImageUrl = (url: string | undefined | null): string => {
  return normalizeImageUrl(url, true);
};
