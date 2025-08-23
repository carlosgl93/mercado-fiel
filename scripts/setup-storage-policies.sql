-- Storage RLS Policies for profile-images bucket

-- Drop existing policies if they exist (ignore errors)
DROP POLICY IF EXISTS "Allow authenticated uploads to profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update to profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete to profile-images" ON storage.objects;

-- Create policies for the profile-images bucket
CREATE POLICY "Allow authenticated uploads to profile-images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Allow public read access to profile-images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'profile-images');

CREATE POLICY "Allow authenticated update to profile-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-images');

CREATE POLICY "Allow authenticated delete to profile-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'profile-images');
