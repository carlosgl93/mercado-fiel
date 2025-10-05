import { supabase } from '@/lib/supabase';
import { authSupplierState, authUserState } from '@/store/authAtoms';
import { useRecoilValue } from 'recoil';

export interface UploadImageResult {
  success: boolean;
  url?: string;
  key?: string;
  id?: string;
  error?: string;
}

// Interface for user validation
interface UserValidation {
  isLoggedIn: boolean;
  isSupplier: boolean;
  email: string;
}

// Hook version for use in React components
export const useImageUpload = () => {
  const user = useRecoilValue(authUserState);
  const supplier = useRecoilValue(authSupplierState);

  const uploadImage = async (
    file: File,
    bucket = 'product-images',
    folder = 'products',
  ): Promise<UploadImageResult> => {
    // Create user validation from auth store
    const userValidation: UserValidation = {
      isLoggedIn: !!user?.data?.isLoggedIn,
      isSupplier: !!(supplier || user?.data?.proveedor),
      email: user?.data?.email || '',
    };

    return uploadImageToSupabase(file, userValidation, bucket, folder);
  };

  return { uploadImage };
};

export const uploadImageToSupabase = async (
  file: File,
  userValidation: UserValidation,
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

    // Verify user is supplier for product uploads using provided validation
    if (bucket === 'product-images') {
      console.log('🔍 Checking supplier permissions for:', userValidation.email);

      if (!userValidation.isLoggedIn) {
        console.error('❌ User not logged in');
        return {
          success: false,
          error: 'Debes iniciar sesión para subir archivos.',
        };
      }

      if (!userValidation.isSupplier) {
        console.error('❌ User is not a supplier:', {
          email: userValidation.email,
          isSupplier: userValidation.isSupplier,
        });
        return {
          success: false,
          error: 'Solo los proveedores pueden subir imágenes de productos. Verifica tus permisos.',
        };
      }

      console.log('✅ Supplier verified from auth validation:', userValidation.isSupplier);
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

    // Generate a unique ID for consistency with backend response format
    const id = crypto.randomUUID();

    // Return the key and id like backend does, instead of full URL
    // The full path including bucket name for compatibility
    const fullKey = `${bucket}/${data.path}`;

    console.log('✅ Upload successful:', { key: fullKey, id, path: data.path });

    return {
      success: true,
      key: fullKey,
      id: id,
      // Also return URL for backward compatibility, but use the key as primary
      url: `https://xnehuzmpesnelhdboijy.supabase.co/storage/v1/object/public/${fullKey}`,
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
