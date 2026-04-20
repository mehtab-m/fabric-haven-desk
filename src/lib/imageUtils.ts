/**
 * Utility functions for handling image URLs
 * Supports both local uploads and Cloudinary URLs
 * Includes cache busting for updated images
 */

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

/**
 * API_ORIGIN is used to turn backend-relative local upload paths like /uploads/xxx into full URLs.
 * This is required because local upload paths are served from the backend, while Cloudinary URLs are already absolute.
 */

/**
 * Normalize image URL to full URL
 * - Step 1: If URL starts with /uploads, it is a local backend path and must be prefixed with the API origin.
 * - Step 2: If URL is already a full HTTP/HTTPS URL, leave it unchanged (this covers Cloudinary URLs).
 * - Step 3: Otherwise, fall back to the raw value.
 * - Step 4: Optionally add a cache-busting query parameter for freshly uploaded/updated images.
 */
export const normalizeImageUrl = (url: string | undefined | null, bustCache = false): string => {
  if (!url) {
    return 'https://via.placeholder.com/300';
  }

  const trimmedUrl = url.trim();
  let finalUrl = '';

  // Handle Cloudinary absolute URLs like https://res.cloudinary.com/duhizkiae/image/upload/v.../
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    finalUrl = trimmedUrl;
  }
  // Handle protocol-relative URLs like //res.cloudinary.com/... if they ever appear.
  else if (trimmedUrl.startsWith('//')) {
    finalUrl = `https:${trimmedUrl}`;
  }
  // Handle backend local uploads served from /uploads.
  else if (trimmedUrl.startsWith('/uploads')) {
    finalUrl = `${API_ORIGIN}${trimmedUrl}`;
  }
  // Default: use raw value as fallback.
  else {
    finalUrl = trimmedUrl;
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
