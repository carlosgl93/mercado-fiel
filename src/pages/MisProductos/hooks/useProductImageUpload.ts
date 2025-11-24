import { useImageUpload } from '@/utils/supabaseStorage';
import { useState } from 'react';

interface UseProductImageUploadOptions {
  onError?: (error: string) => void;
  onSuccess?: (url: string) => void;
}

export const useProductImageUpload = ({ onError, onSuccess }: UseProductImageUploadOptions = {}) => {
  const { uploadImage } = useImageUpload();
  const [imageUploading, setImageUploading] = useState(false);

  const uploadProductImage = async (file: File): Promise<string> => {
    setImageUploading(true);
    try {
      const result = await uploadImage(file, 'product-images', 'products');
      if (!result.success) {
        const errorMessage = result.error || 'Error al subir la imagen';
        if (onError) onError(errorMessage);
        throw new Error(errorMessage);
      }
      // Return the full URL - this gets stored directly in the database
      const url = result.key || result.url!;
      if (onSuccess) onSuccess(url);
      return url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al subir la imagen';
      if (onError) onError(errorMessage);
      throw error;
    } finally {
      setImageUploading(false);
    }
  };

  return {
    uploadProductImage,
    imageUploading,
  };
};
