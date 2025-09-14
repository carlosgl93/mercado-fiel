-- =====================================================
-- MINIMAL SUPABASE RLS POLICIES FOR AUTHENTICATION
-- Run these SQL commands in your Supabase SQL editor
-- This is a minimal set focused on fixing authentication issues
-- =====================================================

-- =====================================================
-- 1. CHECK YOUR DATABASE SCHEMA FIRST
-- =====================================================

-- Run this to see what tables exist in your database
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- =====================================================
-- 2. CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to get current user's database ID
CREATE OR REPLACE FUNCTION auth.get_user_db_id()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT id_usuario 
    FROM usuarios 
    WHERE email = auth.jwt() ->> 'email'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is a supplier
CREATE OR REPLACE FUNCTION auth.is_supplier()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM usuarios u
    JOIN proveedores p ON u.id_usuario = p.id_usuario
    WHERE u.email = auth.jwt() ->> 'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is a customer
CREATE OR REPLACE FUNCTION auth.is_customer()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM usuarios u
    JOIN clientes c ON u.id_usuario = c.id_usuario
    WHERE u.email = auth.jwt() ->> 'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's supplier ID
CREATE OR REPLACE FUNCTION auth.get_supplier_id()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT p.id_proveedor
    FROM usuarios u
    JOIN proveedores p ON u.id_usuario = p.id_usuario
    WHERE u.email = auth.jwt() ->> 'email'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. ENABLE RLS ON CORE TABLES
-- =====================================================

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY; 
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. USUARIOS TABLE POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON usuarios;
DROP POLICY IF EXISTS "Users can update own profile" ON usuarios;
DROP POLICY IF EXISTS "Allow user creation during signup" ON usuarios;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON usuarios
  FOR SELECT USING (email = auth.jwt() ->> 'email');

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON usuarios
  FOR UPDATE USING (email = auth.jwt() ->> 'email');

-- Allow user creation during signup
CREATE POLICY "Allow user creation during signup" ON usuarios
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- 5. CLIENTES TABLE POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Customers can view own data" ON clientes;
DROP POLICY IF EXISTS "Customers can update own data" ON clientes;
DROP POLICY IF EXISTS "Allow customer creation during signup" ON clientes;

-- Customers can read their own data
CREATE POLICY "Customers can view own data" ON clientes
  FOR SELECT USING (id_usuario = auth.get_user_db_id());

-- Customers can update their own data
CREATE POLICY "Customers can update own data" ON clientes
  FOR UPDATE USING (id_usuario = auth.get_user_db_id());

-- Allow customer creation during signup
CREATE POLICY "Allow customer creation during signup" ON clientes
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- 6. PROVEEDORES TABLE POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Suppliers can view own data" ON proveedores;
DROP POLICY IF EXISTS "Suppliers can update own data" ON proveedores;
DROP POLICY IF EXISTS "Allow supplier creation during signup" ON proveedores;
DROP POLICY IF EXISTS "Anyone can view supplier profiles" ON proveedores;

-- Suppliers can read their own data
CREATE POLICY "Suppliers can view own data" ON proveedores
  FOR SELECT USING (id_usuario = auth.get_user_db_id());

-- Suppliers can update their own data
CREATE POLICY "Suppliers can update own data" ON proveedores
  FOR UPDATE USING (id_usuario = auth.get_user_db_id());

-- Allow supplier creation during signup
CREATE POLICY "Allow supplier creation during signup" ON proveedores
  FOR INSERT WITH CHECK (true);

-- Everyone can read supplier data (for marketplace)
CREATE POLICY "Anyone can view supplier profiles" ON proveedores
  FOR SELECT USING (true);

-- =====================================================
-- 7. PRODUCTOS TABLE POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view products" ON productos;
DROP POLICY IF EXISTS "Suppliers can create own products" ON productos;
DROP POLICY IF EXISTS "Suppliers can update own products" ON productos;
DROP POLICY IF EXISTS "Suppliers can delete own products" ON productos;

-- Everyone can read products (public marketplace)
CREATE POLICY "Anyone can view products" ON productos
  FOR SELECT USING (true);

-- Suppliers can create their own products
CREATE POLICY "Suppliers can create own products" ON productos
  FOR INSERT WITH CHECK (id_proveedor = auth.get_supplier_id());

-- Suppliers can update their own products
CREATE POLICY "Suppliers can update own products" ON productos
  FOR UPDATE USING (id_proveedor = auth.get_supplier_id());

-- Suppliers can delete their own products
CREATE POLICY "Suppliers can delete own products" ON productos
  FOR DELETE USING (id_proveedor = auth.get_supplier_id());

-- =====================================================
-- 8. STORAGE POLICIES (for product images)
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Suppliers can update own product images" ON storage.objects;
DROP POLICY IF EXISTS "Suppliers can delete own product images" ON storage.objects;

-- Allow authenticated suppliers to upload to product-images bucket
CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
    AND auth.is_supplier()
  );

-- Allow anyone to read product images
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Suppliers can update their own product images
CREATE POLICY "Suppliers can update own product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
    AND auth.is_supplier()
  );

-- Suppliers can delete their own product images
CREATE POLICY "Suppliers can delete own product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
    AND auth.is_supplier()
  );

-- =====================================================
-- 9. TEST YOUR SETUP
-- =====================================================

-- Run these queries to test if everything is working
-- (Replace 'your-email@example.com' with an actual user email)

-- Test helper functions
SELECT auth.jwt() ->> 'email' as current_user_email;
-- SELECT auth.get_user_db_id();
-- SELECT auth.is_supplier();
-- SELECT auth.is_customer();
-- SELECT auth.get_supplier_id();

-- Test if you can query your own user
-- SELECT * FROM usuarios WHERE email = 'your-email@example.com';

-- =====================================================
-- 10. NOTES
-- =====================================================

-- This is a minimal setup focused on the core authentication flow.
-- Additional tables like descuentos_cantidad, compras_colectivas, etc.
-- can be added later once the basic authentication is working.
--
-- If you get errors about missing tables, it means your database
-- is not synced with your Prisma schema. You may need to run:
-- 1. prisma db push (to sync schema to database)
-- 2. Or create a migration: prisma migrate dev
--
-- Make sure to create the storage buckets in Supabase:
-- - product-images (public: true)
-- - profile-images (public: true)
