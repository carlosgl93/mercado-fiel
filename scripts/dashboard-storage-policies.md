# Supabase Storage Policies for Dashboard Configuration

## Instructions
Copy and paste each policy individually into the Supabase Dashboard > Storage > Policies section.

**Navigate to:** Storage → Configuration → Policies → New Policy

---

## Profile Images Bucket Policies

### 1. Allow authenticated uploads to profile-images
**Target table:** `objects`  
**Policy name:** `Allow authenticated uploads to profile-images`  
**Allowed operation:** `INSERT`  
**Target roles:** `authenticated`  

**USING expression (optional):** _(leave empty)_

**WITH CHECK expression:**
```sql
bucket_id = 'profile-images'
```

---

### 2. Allow public read access to profile-images
**Target table:** `objects`  
**Policy name:** `Allow public read access to profile-images`  
**Allowed operation:** `SELECT`  
**Target roles:** `public`  

**USING expression:**
```sql
bucket_id = 'profile-images'
```

**WITH CHECK expression (optional):** _(leave empty)_

---

### 3. Allow authenticated update to profile-images
**Target table:** `objects`  
**Policy name:** `Allow authenticated update to profile-images`  
**Allowed operation:** `UPDATE`  
**Target roles:** `authenticated`  

**USING expression:**
```sql
bucket_id = 'profile-images'
```

**WITH CHECK expression (optional):** _(leave empty)_

---

### 4. Allow authenticated delete to profile-images
**Target table:** `objects`  
**Policy name:** `Allow authenticated delete to profile-images`  
**Allowed operation:** `DELETE`  
**Target roles:** `authenticated`  

**USING expression:**
```sql
bucket_id = 'profile-images'
```

**WITH CHECK expression (optional):** _(leave empty)_

---

## Product Images Bucket Policies

### 5. Allow authenticated uploads to product-images
**Target table:** `objects`  
**Policy name:** `Allow authenticated uploads to product-images`  
**Allowed operation:** `INSERT`  
**Target roles:** `authenticated`  

**USING expression (optional):** _(leave empty)_

**WITH CHECK expression:**
```sql
bucket_id = 'product-images'
```

---

### 6. Allow public read access to product-images
**Target table:** `objects`  
**Policy name:** `Allow public read access to product-images`  
**Allowed operation:** `SELECT`  
**Target roles:** `public`  

**USING expression:**
```sql
bucket_id = 'product-images'
```

**WITH CHECK expression (optional):** _(leave empty)_

---

### 7. Allow authenticated update to product-images
**Target table:** `objects`  
**Policy name:** `Allow authenticated update to product-images`  
**Allowed operation:** `UPDATE`  
**Target roles:** `authenticated`  

**USING expression:**
```sql
bucket_id = 'product-images'
```

**WITH CHECK expression (optional):** _(leave empty)_

---

### 8. Allow authenticated delete to product-images
**Target table:** `objects`  
**Policy name:** `Allow authenticated delete to product-images`  
**Allowed operation:** `DELETE`  
**Target roles:** `authenticated`  

**USING expression:**
```sql
bucket_id = 'product-images'
```

**WITH CHECK expression (optional):** _(leave empty)_

---

## Notes

- **For Development (Local Emulator):** Create these policies in your local Supabase instance at `http://127.0.0.1:54323`
- **For Production:** Create these policies in your production Supabase dashboard at `https://supabase.com/dashboard/project/xnehuzmpesnelhdboijy`

### Bucket Creation
Make sure you have created the storage buckets first:
1. Go to Storage → Buckets
2. Create bucket: `profile-images` (public: true, file size limit: 5MB, allowed MIME types: image/*)
3. Create bucket: `product-images` (public: true, file size limit: 5MB, allowed MIME types: image/*)

### Testing
After creating the policies, test them by:
1. Uploading a profile image through your app
2. Uploading a product image through your app  
3. Verify public access by accessing the image URLs directly
4. Verify authenticated users can update/delete their own images