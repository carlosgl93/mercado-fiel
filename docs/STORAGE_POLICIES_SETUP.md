# Storage Policies Setup Guide - Supabase Dashboard

## 🚨 Important Notice

Storage policies **CANNOT** be created via the SQL editor due to permission restrictions. You must use the Supabase Dashboard interface.

## Step-by-Step Instructions

### 1. Navigate to Storage Policies

1. Go to your Supabase project dashboard
2. Navigate to **Storage** > **Policies**
3. You'll see a list of your buckets (product-images, profile-images)

### 2. Create Policies for product-images Bucket

Click on the **product-images** bucket, then create these 4 policies:

#### Policy 1: Anyone can view product images
- **Name**: `Anyone can view product images`
- **Operation**: `SELECT`
- **SQL Expression**:
```sql
bucket_id = 'product-images'
```

#### Policy 2: Authenticated users can upload product images
- **Name**: `Authenticated users can upload product images`
- **Operation**: `INSERT`  
- **SQL Expression**:
```sql
bucket_id = 'product-images' AND auth.role() = 'authenticated'
```

#### Policy 3: Users can update their own product images
- **Name**: `Users can update their own product images`
- **Operation**: `UPDATE`
- **SQL Expression**:
```sql
bucket_id = 'product-images' AND auth.role() = 'authenticated' AND auth.uid()::text = (storage.foldername(name))[1]
```

#### Policy 4: Users can delete their own product images
- **Name**: `Users can delete their own product images`
- **Operation**: `DELETE`
- **SQL Expression**:
```sql
bucket_id = 'product-images' AND auth.role() = 'authenticated' AND auth.uid()::text = (storage.foldername(name))[1]
```

### 3. Create Policies for profile-images Bucket

Click on the **profile-images** bucket, then create these 4 policies:

#### Policy 1: Anyone can view profile images
- **Name**: `Anyone can view profile images`
- **Operation**: `SELECT`
- **SQL Expression**:
```sql
bucket_id = 'profile-images'
```

#### Policy 2: Authenticated users can upload profile images
- **Name**: `Authenticated users can upload profile images`
- **Operation**: `INSERT`
- **SQL Expression**:
```sql
bucket_id = 'profile-images' AND auth.role() = 'authenticated'
```

#### Policy 3: Users can update their own profile images
- **Name**: `Users can update their own profile images`
- **Operation**: `UPDATE`
- **SQL Expression**:
```sql
bucket_id = 'profile-images' AND auth.role() = 'authenticated' AND auth.uid()::text = (storage.foldername(name))[1]
```

#### Policy 4: Users can delete their own profile images
- **Name**: `Users can delete their own profile images`
- **Operation**: `DELETE`
- **SQL Expression**:
```sql
bucket_id = 'profile-images' AND auth.role() = 'authenticated' AND auth.uid()::text = (storage.foldername(name))[1]
```

## File Path Structure

For the policies to work correctly, ensure your file uploads follow this structure:

```
product-images/
├── {user-auth-uid}/
│   ├── product-1.jpg
│   ├── product-2.png
│   └── ...

profile-images/  
├── {user-auth-uid}/
│   ├── avatar.jpg
│   └── ...
```

Where `{user-auth-uid}` is the Supabase Auth UID (from `auth.uid()`).

## Testing the Setup

### 1. Run Verification Queries

In the Supabase SQL editor, run these queries to test authentication:

```sql
-- Check current user
SELECT auth.uid(), auth.jwt() ->> 'email', auth.role();

-- Check if your helper functions work
SELECT auth.get_user_db_id();
SELECT auth.is_supplier();
SELECT auth.is_customer();
```

### 2. Test Image Upload

Try uploading an image from your app and check:
- Network tab for 403 errors
- Console for any authentication issues
- Supabase dashboard to see if the file appears

### 3. Debug 403 Errors

If you still get 403 errors, check:

1. **User Authentication**: 
```sql
SELECT auth.uid(); -- Should return a UUID, not null
```

2. **File Path**: Ensure the path includes the user's UID:
```javascript
const filePath = `${auth.user.id}/product-image.jpg`;
```

3. **Bucket Configuration**: Verify the bucket exists and is properly configured

## Troubleshooting

### Common Issues

1. **"Policy violated" on upload**
   - Check that `auth.uid()` returns a valid UUID
   - Verify the file path includes the user's UID as the first folder
   - Ensure the user is properly authenticated

2. **"Bucket not found"**
   - Create the bucket in Storage > Buckets
   - Make sure bucket name matches exactly (product-images, profile-images)

3. **"Invalid policy expression"**
   - Double-check the SQL expression syntax
   - Make sure you selected the correct operation type
   - Verify bucket_id matches your bucket name

### Temporary Workaround

If you need to test quickly, you can create a more permissive policy temporarily:

**For INSERT operations (upload)**:
```sql
bucket_id = 'product-images' AND auth.role() = 'authenticated'
```

This allows any authenticated user to upload to any path. **Remember to tighten security later.**

## Security Best Practices

1. **Always use user-specific paths**: Files should be uploaded to paths that include the user's UID
2. **Validate file types**: Consider adding file extension validation in your app
3. **Limit file sizes**: Set reasonable file size limits in your upload logic  
4. **Regular cleanup**: Implement logic to clean up orphaned files
5. **Monitor usage**: Keep track of storage usage per user

## Additional Resources

- [Supabase Storage Policies Documentation](https://supabase.com/docs/guides/storage/security/policies)
- [Row Level Security Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage JavaScript Client](https://supabase.com/docs/reference/javascript/storage-from-upload)