/**
 * Example usage of the centralized image utilities
 * 
 * These utilities can be used throughout the application to handle
 * product images consistently and with proper error handling.
 */

// Example 3: Validation before displaying images
export const validateAndDisplayImage = (imageUrl?: string) => {
  // Check if it's a valid Supabase URL
  if (isValidSupabaseImageUrl(imageUrl)) {
    console.log('✅ Valid Supabase image URL:', imageUrl);
    return imageUrl;
  }
  
  // Log warning for invalid URLs
  if (imageUrl) {
    console.warn('⚠️ Invalid image URL format:', imageUrl);
  }
  
  // Return fallback
  return getProductImageUrl(imageUrl);
};

// Example 4: Use in React components with hooks
import { createImageHandlers, getProductImageUrl, isValidSupabaseImageUrl } from '@/utils/imageUtils';
import { useMemo } from 'react';

export const useProductImage = (imageUrl?: string) => {
  const validImageUrl = useMemo(() => getProductImageUrl(imageUrl), [imageUrl]);
  const isValid = useMemo(() => isValidSupabaseImageUrl(imageUrl), [imageUrl]);
  
  return {
    imageUrl: validImageUrl,
    isValid,
    handlers: createImageHandlers('Product')
  };
};

/*
 * JSX Examples (for reference - use these patterns in your .tsx files):
 * 
 * // Simple image component:
 * const ProductImage = ({ imageUrl, alt = "Product" }) => {
 *   const validImageUrl = getProductImageUrl(imageUrl);
 *   return <img src={validImageUrl} alt={alt} />;
 * };
 * 
 * // Material-UI CardMedia:
 * <CardMedia
 *   component="img"
 *   height={200}
 *   image={getProductImageUrl(product.imagen_url)}
 *   alt={product.nombre}
 *   sx={{ objectFit: 'cover' }}
 *   onError={(e) => {
 *     console.error('❌ Image failed to load:', product.imagen_url);
 *     e.currentTarget.style.display = 'none';
 *   }}
 * />
 */