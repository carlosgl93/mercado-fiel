import { supabase } from '@/lib/supabase';

export interface UploadImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadImageToSupabase = async (
  file: File,
  bucket = 'product-images',
  folder = 'products',
): Promise<UploadImageResult> => {
  try {
    console.log('Starting upload to bucket:', bucket, 'folder:', folder);

    // Check authentication first
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    console.log({ session, sessionError });

    if (sessionError || !session?.user) {
      console.error('No authenticated session:', sessionError);
      return {
        success: false,
        error: 'Debes iniciar sesión para subir archivos.',
      };
    }

    console.log('Authenticated user:', session.user.email);

    // Verify user is supplier for product uploads
    if (bucket === 'product-images') {
      const { data: supplierCheck, error: supplierError } = await supabase
        .from('usuarios')
        .select(
          `
          proveedores (
            id_proveedor
          )
        `,
        )
        .eq('email', session.user.email)
        .single();

      if (supplierError || !supplierCheck?.proveedores?.length) {
        console.error('Supplier verification failed:', supplierError);
        return {
          success: false,
          error: 'Solo los proveedores pueden subir imágenes de productos.',
        };
      }

      console.log('Supplier verified:', supplierCheck.proveedores[0]);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    console.log('Uploading file:', fileName);

    // Upload the file
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('Upload error:', error);

      // If bucket not found, provide helpful message
      if (error.message.includes('Bucket not found')) {
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
        return {
          success: false,
          error:
            'No tienes permisos para subir archivos. Verifica que tus permisos de proveedor estén configurados correctamente.',
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
