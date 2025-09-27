-- Production storage policies for Mercado Fiel
-- These policies ensure security while allowing proper functionality

-- ===============================================
-- PROFILE IMAGES BUCKET POLICIES
-- ===============================================

-- Drop existing policies for profile-images
DROP POLICY IF EXISTS "Allow anon uploads to profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon update to profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon delete to profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update to profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete to profile-images" ON storage.objects;

-- Create production-ready policies for profile-images
-- Allow public read access (essential for displaying images)
CREATE POLICY "Allow public read access to profile-images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'profile-images');

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads to profile-images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-images');

-- Allow authenticated users to update their own files
CREATE POLICY "Allow authenticated update to profile-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-images');

-- Allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated delete to profile-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'profile-images');

-- ===============================================
-- PRODUCT IMAGES BUCKET POLICIES
-- ===============================================

-- Drop existing policies for product-images
DROP POLICY IF EXISTS "Allow anon uploads to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon update to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon delete to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete to product-images" ON storage.objects;

-- Create production-ready policies for product-images
-- Allow public read access (essential for displaying product images)
CREATE POLICY "Allow public read access to product-images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'product-images');

-- Allow authenticated users to upload product images
CREATE POLICY "Allow authenticated uploads to product-images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to update product images
CREATE POLICY "Allow authenticated update to product-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images');

-- Allow authenticated users to delete product images
CREATE POLICY "Allow authenticated delete to product-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');

-- ===============================================
-- BUCKET POLICIES (for bucket-level operations)
-- ===============================================

-- Allow public to read from both buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('profile-images', 'profile-images', true, 52428800, ARRAY['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('product-images', 'product-images', true, 52428800, ARRAY['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- ===============================================
-- VERIFICATION QUERIES
-- ===============================================

-- Check that policies are created correctly
-- SELECT * FROM storage.policies WHERE bucket_id IN ('profile-images', 'product-images');

-- Check bucket configuration
-- SELECT * FROM storage.buckets WHERE id IN ('profile-images', 'product-images');