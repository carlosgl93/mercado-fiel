import { createClient } from '@supabase/supabase-js';

// Supabase configuration for server-side operations
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseServiceKey = 
  process.env.SUPABASE_SERVICE_KEY ?? "";

// Create Supabase client with service role key (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Alternative: Create client that respects RLS for specific operations
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "" ;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
