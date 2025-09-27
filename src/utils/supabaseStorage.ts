import { supabase } from '@/lib/supabase';

export interface UploadImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5001/mercado-fiel/us-central1/api';

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
      console.log('🔍 Checking supplier permissions for:', session.user.email);
      
      // Check if user exists and is a supplier by calling our API endpoint
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession?.access_token) {
        throw new Error('No valid session token found');
      }

      // Use our API to get user data (same as auth hook)
      const response = await fetch(`${API_URL}/auth/user/${session.user.email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentSession.access_token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.error('❌ User not found in database:', session.user.email);
          return {
            success: false,
            error: 'Usuario no encontrado en el sistema. Contacta al administrador.',
          };
        }
        console.error('❌ API call failed:', response.status, await response.text());
        return {
          success: false,
          error: 'Error al verificar permisos de proveedor. Inténtalo de nuevo.',
        };
      }

      const userData = await response.json();
      console.log('🔍 Supplier check result:', userData);

      if (!userData.success || !userData.data) {
        console.error('❌ Invalid API response:', userData);
        return {
          success: false,
          error: 'Error al verificar permisos de proveedor.',
        };
      }

      const userRecord = userData.data;
      console.log('👤 User record found:', userRecord);
      
      if (!userRecord.proveedor) {
        console.error('❌ User is not a supplier:', {
          email: session.user.email,
          has_proveedor_record: !!userRecord.proveedor
        });
        return {
          success: false,
          error: 'Solo los proveedores pueden subir imágenes de productos. Verifica tus permisos.',
        };
      }

      console.log('✅ Supplier verified:', userRecord.proveedor);
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
