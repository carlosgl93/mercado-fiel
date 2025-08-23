import { createClient } from '@supabase/supabase-js';

// Get keys from supabase status command or environment
const supabaseUrl = 'http://127.0.0.1:54321';
// This service key should be obtained from `supabase status` command
// DO NOT commit the actual key to git
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'SERVICE_KEY_FROM_SUPABASE_STATUS';

if (!process.env.SUPABASE_SERVICE_KEY) {
  console.log('⚠️  Please set SUPABASE_SERVICE_KEY environment variable');
  console.log('   You can get it by running: supabase status');
  console.log('   Then run: SUPABASE_SERVICE_KEY="your_service_key" node scripts/setup-storage.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log('🔧 Setting up storage buckets...');

    // Check existing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return;
    }

    console.log('📦 Existing buckets:', buckets?.map((b) => b.name) || []);

    // Create profile-images bucket if it doesn't exist
    const profileImagesBucketExists = buckets?.some((b) => b.name === 'profile-images');

    if (!profileImagesBucketExists) {
      console.log('📦 Creating profile-images bucket...');

      const { error: createError } = await supabase.storage.createBucket('profile-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880, // 5MB
      });

      if (createError) {
        console.error('❌ Error creating profile-images bucket:', createError);
      } else {
        console.log('✅ Successfully created profile-images bucket');
      }
    } else {
      console.log('✅ profile-images bucket already exists');
    }

    // List final buckets
    const { data: finalBuckets } = await supabase.storage.listBuckets();
    console.log('📦 Final buckets:', finalBuckets?.map((b) => b.name) || []);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

setupStorage();
