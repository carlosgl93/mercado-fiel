-- RLS Diagnostics Script
-- Run this in your Supabase SQL editor to understand the current policies

-- 1. Check RLS policies on productos table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'productos';

-- 2. Check if RLS is enabled on productos table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'productos';

-- 3. Check usuarios table structure for auth mapping
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'usuarios'
  AND column_name LIKE '%auth%' OR column_name LIKE '%uid%';

-- 4. Check current authenticated user (run this from client)
-- SELECT auth.uid() as current_auth_uid, auth.role() as current_role;
