/**
 * Centralized slug utility functions for consistent URL generation across the app
 */

/**
 * Convert a string to a URL-friendly slug
 * @param input - The string to convert to a slug
 * @returns A lowercase, hyphenated slug with special characters removed
 */
export const toSlug = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Convert a slug back to a display title (capitalize first letter of each word)
 * @param slug - The slug to convert
 * @returns A properly capitalized title
 */
export const fromSlug = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Create a category URL with proper encoding
 * @param categoryTitle - The category title to create URL for
 * @returns Properly encoded category URL
 */
export const createCategoryUrl = (categoryTitle: string): string => {
  const slug = toSlug(categoryTitle);
  return `/category/${encodeURIComponent(slug)}`;
};

/**
 * Parse category slug from URL parameter
 * @param urlParam - The URL parameter (potentially encoded)
 * @returns Decoded slug
 */
export const parseCategorySlug = (urlParam: string): string => {
  return decodeURIComponent(urlParam).toLowerCase();
};
