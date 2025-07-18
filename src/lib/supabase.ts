import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types will be generated by Prisma
// This Supabase client is primarily used for:
// - Real-time subscriptions
// - File storage operations
// - Auth integration (if needed alongside Firebase Auth)
//
// For database operations, use Prisma client instead (/src/lib/prisma.ts)
export type Database = any; // This will be replaced by Prisma generated types
