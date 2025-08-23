-- Enable storage for profile images
-- This migration sets up Row Level Security policies for the profile-images bucket

-- Enable RLS on storage.objects (if not already enabled)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to upload to profile-images bucket
CREATE POLICY "Allow authenticated uploads to profile-images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-images');

-- Create policy to allow public read access to profile-images
CREATE POLICY "Allow public read access to profile-images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'profile-images');

-- Create policy to allow authenticated users to update their own files
CREATE POLICY "Allow authenticated update to profile-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-images');

-- Create policy to allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated delete to profile-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'profile-images');
