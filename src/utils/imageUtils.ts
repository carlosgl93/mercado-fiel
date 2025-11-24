/**
 * Image utility functions for handling image URLs, fallbacks, and validation
 */

/**
 * Get a valid image URL with fallback options
 * @param imageUrl - The primary image URL
 * @param fallbackUrl - Optional fallback URL if primary fails
 * @returns The validated image URL or fallback
 */
export const getValidImageUrl = (imageUrl?: string | null, fallbackUrl?: string): string | undefined => {
  // Return the URL directly if it exists (now that we store full URLs in DB)
  if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
    return imageUrl.trim();
  }
  
  // Return fallback if provided
  return fallbackUrl;
};

/**
 * Check if an image URL is a valid Supabase storage URL
 * @param url - The URL to validate
 * @returns boolean indicating if URL is valid Supabase storage URL
 */
export const isValidSupabaseImageUrl = (url?: string | null): boolean => {
  if (!url) return false;
  
  const supabaseStoragePattern = /^https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\/.+/;
  return supabaseStoragePattern.test(url);
};

/**
 * Get image URL with validation and error handling
 * @param imageUrl - The image URL to validate
 * @param options - Configuration options
 * @returns Validated image URL or undefined
 */
export const getImageUrlWithValidation = (
  imageUrl?: string | null, 
  options?: {
    fallback?: string;
    validateSupabase?: boolean;
  }
): string | undefined => {
  const { fallback, validateSupabase = false } = options || {};
  
  if (!imageUrl) return fallback;
  
  // If Supabase validation is enabled, check URL format
  if (validateSupabase && !isValidSupabaseImageUrl(imageUrl)) {
    console.warn('Invalid Supabase image URL format:', imageUrl);
    return fallback;
  }
  
  return imageUrl;
};

/**
 * Default placeholder image paths
 */
export const DEFAULT_PLACEHOLDERS = {
  PRODUCT: '/images/placeholder-product.jpg',
  PROFILE: '/images/placeholder-profile.jpg',
  BUSINESS: '/images/placeholder-business.jpg',
} as const;

/**
 * Get product image with fallback to placeholder
 * @param imageUrl - The product image URL
 * @returns Product image URL or placeholder
 */
export const getProductImageUrl = (imageUrl?: string | null): string => {
  return getValidImageUrl(imageUrl, DEFAULT_PLACEHOLDERS.PRODUCT) || DEFAULT_PLACEHOLDERS.PRODUCT;
};

/**
 * Image loading event handlers for consistent error handling
 */
export const createImageHandlers = (context = 'Image') => ({
  onLoad: (url: string) => {
    console.log(`✅ ${context} loaded successfully:`, url);
  },

  onError: (url: string, element?: HTMLImageElement) => {
    console.error(`❌ ${context} failed to load:`, url);

    // Hide broken image by default
    if (element) {
      element.style.display = 'none';
    }
  },
});