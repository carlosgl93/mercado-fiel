-- Development-friendly storage policies (allows anon uploads)

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated uploads to profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update to profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete to profile-images" ON storage.objects;

-- Create more permissive policies for development
-- Allow anonymous (anon) users to upload files
CREATE POLICY "Allow anon uploads to profile-images" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'profile-images');

-- Allow public read access to profile-images
CREATE POLICY "Allow public read access to profile-images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'profile-images');

-- Allow anon users to update files in profile-images
CREATE POLICY "Allow anon update to profile-images" ON storage.objects
  FOR UPDATE TO anon
  USING (bucket_id = 'profile-images');

-- Allow anon users to delete files in profile-images
CREATE POLICY "Allow anon delete to profile-images" ON storage.objects
  FOR DELETE TO anon
  USING (bucket_id = 'profile-images');

-- Also allow authenticated users (in case some users are authenticated)
CREATE POLICY "Allow authenticated uploads to profile-images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Allow authenticated update to profile-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-images');

CREATE POLICY "Allow authenticated delete to profile-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'profile-images');
