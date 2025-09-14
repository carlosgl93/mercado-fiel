import { supabase } from '../lib/supabase';

/**
 * Debug utility to help troubleshoot authentication issues
 */
export class AuthDebugService {
  /**
   * Get comprehensive authentication status
   */
  static async getAuthStatus() {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      console.log('=== AUTHENTICATION DEBUG ===');
      console.log('Session Error:', sessionError);
      console.log('User Error:', userError);
      console.log('Session:', session);
      console.log('User:', user);
      
      if (user) {
        console.log('User ID:', user.id);
        console.log('User Email:', user.email);
        console.log('User Metadata:', user.user_metadata);
        console.log('App Metadata:', user.app_metadata);
      }

      return {
        hasSession: !!session,
        hasUser: !!user,
        session,
        user,
        sessionError,
        userError,
      };
    } catch (error) {
      console.error('Auth status check failed:', error);
      return null;
    }
  }

  /**
   * Test database connectivity with current user
   */
  static async testDatabaseQuery() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }

      console.log('Testing database query for user:', user.email);

      // Test a simple query that should work with RLS
      const { data, error } = await supabase
        .from('usuarios')
        .select('id_usuario, email, nombre')
        .eq('email', user.email)
        .single();

      console.log('Database Query Result:');
      console.log('Data:', data);
      console.log('Error:', error);

      return { data, error };
    } catch (error) {
      console.error('Database query test failed:', error);
      return null;
    }
  }

  /**
   * Test supplier privileges
   */
  static async testSupplierPrivileges() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }

      console.log('Testing supplier privileges for user:', user.email);

      // Test supplier query
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          id_usuario,
          email,
          proveedores (
            id_proveedor,
            nombre_negocio
          )
        `)
        .eq('email', user.email)
        .single();

      console.log('Supplier Query Result:');
      console.log('Data:', data);
      console.log('Error:', error);

      const isSupplier = Array.isArray(data?.proveedores) && data.proveedores.length > 0;
      console.log('Is Supplier:', isSupplier);

      return { data, error, isSupplier };
    } catch (error) {
      console.error('Supplier privilege test failed:', error);
      return null;
    }
  }

  /**
   * Test storage upload permissions
   */
  static async testStoragePermissions() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        return null;
      }

      console.log('Testing storage permissions for user:', user.email);

      // Create a small test file
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const testPath = `test/${Date.now()}-test.txt`;

      // Try to upload to product-images bucket
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(testPath, testFile);

      console.log('Storage Upload Test Result:');
      console.log('Data:', data);
      console.log('Error:', error);

      // Clean up test file if upload was successful
      if (data) {
        await supabase.storage
          .from('product-images')
          .remove([testPath]);
        console.log('Test file cleaned up');
      }

      return { data, error, canUpload: !error };
    } catch (error) {
      console.error('Storage permission test failed:', error);
      return null;
    }
  }

  /**
   * Run all authentication tests
   */
  static async runAllTests() {
    console.log('🔍 Running comprehensive authentication tests...');
    
    const authStatus = await this.getAuthStatus();
    const dbQuery = await this.testDatabaseQuery();
    const supplierTest = await this.testSupplierPrivileges();
    const storageTest = await this.testStoragePermissions();

    const results = {
      authStatus,
      dbQuery,
      supplierTest,
      storageTest,
    };

    console.log('=== COMPREHENSIVE TEST RESULTS ===');
    console.log(JSON.stringify(results, null, 2));

    return results;
  }
}

// Make it available globally for debugging in browser console
if (typeof window !== 'undefined') {
  (window as any).AuthDebugService = AuthDebugService;
}
