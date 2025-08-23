import { supabase } from '@/lib/supabase';

export interface UploadImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadImageToSupabase = async (
  file: File,
  bucket = 'profile-images',
  folder = 'suppliers',
): Promise<UploadImageResult> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    // First, try to upload to see if bucket exists
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      // If bucket not found, provide helpful message
      if (error.message.includes('Bucket not found')) {
        console.error('Bucket not found:', error);
        return {
          success: false,
          error: `El bucket de almacenamiento '${bucket}' no existe. Contacta al administrador del sistema.`,
        };
      }

      // If RLS policy violation, provide helpful message
      if (
        error.message.includes('row-level security policy') ||
        error.message.includes('Unauthorized')
      ) {
        console.error('Storage permission error:', error);
        return {
          success: false,
          error:
            'No tienes permisos para subir archivos. Verifica que estés autenticado correctamente.',
        };
      }

      // Other upload errors
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: `Error al subir la imagen: ${error.message}`,
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: 'Error inesperado al subir la imagen',
    };
  }
};

export const deleteImageFromSupabase = async (
  url: string,
  bucket = 'profile-images',
): Promise<boolean> => {
  try {
    // Extract path from URL
    const urlParts = url.split('/');
    const path = urlParts.slice(-2).join('/'); // Get folder/filename

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};
