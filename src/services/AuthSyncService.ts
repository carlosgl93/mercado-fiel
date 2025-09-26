import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id_usuario: number;
  email: string;
  nombre: string;
  apellido?: string;
  telefono?: string;
  is_supplier?: boolean;
  is_customer?: boolean;
  supplier_id?: number;
  customer_id?: number;
}

export class AuthSyncService {
  /**
   * Ensures user exists in database and returns complete profile
   */
  static async ensureUserInDatabase(supabaseUser: User): Promise<UserProfile | null> {
    try {
      // First, check if user exists in usuarios table
      const { data: existingUser, error: userError } = await supabase
        .from('usuarios')
        .select(
          `
          id_usuario,
          email,
          nombre,
          proveedores (
            id_proveedor,
            nombre_negocio
          ),
          clientes (
            id_cliente
          )
        `,
        )
        .eq('email', supabaseUser.email)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error checking user:', userError);
        return null;
      }

      if (existingUser) {
        // Check if user has auth_uid set, if not, update it
        const { data: userWithAuthUid } = await supabase
          .from('usuarios')
          .select('auth_uid')
          .eq('id_usuario', existingUser.id_usuario)
          .single();

        if (!userWithAuthUid?.auth_uid) {
          console.log('Updating missing auth_uid for existing user:', supabaseUser.email);
          await supabase
            .from('usuarios')
            .update({ auth_uid: supabaseUser.id })
            .eq('id_usuario', existingUser.id_usuario);
        }

        // User exists, return profile with role information
        return {
          id_usuario: existingUser.id_usuario,
          email: existingUser.email,
          nombre: existingUser.nombre,
          // apellido: existingUser.apellido,
          // telefono: existingUser.telefono,
          is_supplier:
            Array.isArray(existingUser.proveedores) && existingUser.proveedores.length > 0,
          is_customer: Array.isArray(existingUser.clientes) && existingUser.clientes.length > 0,
          supplier_id: existingUser.proveedores?.[0]?.id_proveedor,
          customer_id: existingUser.clientes?.[0]?.id_cliente,
        };
      }

      // User doesn't exist in database, create them
      console.log('Creating new user in database:', supabaseUser.email);

      const { data: newUser, error: createError } = await supabase
        .from('usuarios')
        .insert({
          email: supabaseUser.email,
          nombre:
            supabaseUser.user_metadata?.nombre || supabaseUser.user_metadata?.name || 'Usuario',
          apellido: supabaseUser.user_metadata?.apellido || '',
          telefono: supabaseUser.user_metadata?.telefono || supabaseUser.phone,
          auth_uid: supabaseUser.id, // CRITICAL: Link the Supabase Auth user to database record
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return null;
      }

      return {
        id_usuario: newUser.id_usuario,
        email: newUser.email,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        telefono: newUser.telefono,
        is_supplier: false,
        is_customer: false,
      };
    } catch (error) {
      console.error('AuthSyncService error:', error);
      return null;
    }
  }

  /**
   * Updates user role claims in Supabase Auth (client-side version)
   */
  static async updateUserClaims(userId: string, profile: UserProfile): Promise<void> {
    try {
      // On client side, we can update user metadata through the regular auth API
      const { error } = await supabase.auth.updateUser({
        data: {
          role: profile.is_supplier ? 'supplier' : 'customer',
          database_id: profile.id_usuario,
          is_supplier: profile.is_supplier,
          is_customer: profile.is_customer,
        },
      });

      if (error) {
        console.error('Error updating user claims:', error);
      } else {
        console.log('User claims updated successfully');
      }
    } catch (error) {
      console.error('Error updating user claims:', error);
    }
  }

  /**
   * Complete authentication sync process
   */
  static async syncAuthentication(supabaseUser: User): Promise<UserProfile | null> {
    try {
      // Ensure user exists in database
      const profile = await this.ensureUserInDatabase(supabaseUser);

      if (!profile) {
        console.error('Failed to create/retrieve user profile');
        return null;
      }

      // Update user claims if needed (this helps with RLS context)
      await this.updateUserClaims(supabaseUser.id, profile);

      // Force a session refresh to ensure RLS context is updated
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        console.warn('Failed to refresh session:', error);
      }

      return profile;
    } catch (error) {
      console.error('Authentication sync failed:', error);
      return null;
    }
  }

  /**
   * Set user session with proper context
   */
  static async setAuthenticatedSession(): Promise<boolean> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        console.error('No valid session:', error);
        return false;
      }

      // Sync user data
      const profile = await this.syncAuthentication(session.user);

      if (!profile) {
        console.error('Failed to sync user profile');
        return false;
      }

      console.log('Authentication synced successfully:', {
        user_id: session.user.id,
        email: session.user.email,
        database_id: profile.id_usuario,
        is_supplier: profile.is_supplier,
        is_customer: profile.is_customer,
      });

      return true;
    } catch (error) {
      console.error('Session setup failed:', error);
      return false;
    }
  }

  /**
   * Check if current user has supplier privileges
   */
  static async isSupplier(): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('usuarios')
        .select(
          `
          proveedores (
            id_proveedor
          )
        `,
        )
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Error checking supplier status:', error);
        return false;
      }

      return Array.isArray(data?.proveedores) && data.proveedores.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Check if current user has customer privileges
   */
  static async isCustomer(): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('usuarios')
        .select(
          `
          clientes (
            id_cliente
          )
        `,
        )
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Error checking customer status:', error);
        return false;
      }

      return Array.isArray(data?.clientes) && data.clientes.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Get current user's complete profile
   */
  static async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      return await this.ensureUserInDatabase(user);
    } catch (error) {
      console.error('Error getting current user profile:', error);
      return null;
    }
  }
}
