# Storage Setup for Development

This document explains how to set up Supabase Storage for local development.

## Quick Setup

1. **Ensure Supabase is running locally:**

   ```bash
   supabase status
   ```

2. **Apply database migrations:**

   ```bash
   supabase db push --local
   ```

3. **Create storage bucket and policies:**

   ```bash
   psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f scripts/setup-storage-policies-dev.sql
   psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "INSERT INTO storage.buckets (id, name) VALUES ('profile-images', 'profile-images') ON CONFLICT (id) DO NOTHING;"
   ```

4. **Start development server:**

   ```bash
   pnpm dev
   ```

## Storage Configuration

### Bucket: `profile-images`

- **Purpose:** Store user profile pictures and business logos
- **Access:** Public read, anonymous write (for development)
- **File types:** JPEG, PNG, GIF, WebP
- **Size limit:** 5MB

### File Organization

```
profile-images/
├── suppliers/          # Business logos and images
│   ├── 1234567890-abc123.jpg
│   └── 1234567891-def456.png
└── users/             # User profile pictures (future)
    ├── 1234567892-ghi789.jpg
    └── 1234567893-jkl012.png
```

## Security Notes

### Development Policies (Local Only)

- **Anonymous uploads:** Allowed for easier development
- **Public read:** All images are publicly readable
- **No user restrictions:** Any user can upload/modify any file

### Production Policies (To Implement)

- **Authenticated uploads only:** Users must be logged in
- **User-specific access:** Users can only modify their own files
- **Role-based permissions:** Different permissions for suppliers vs customers

## Troubleshooting

### "Bucket not found" Error

```bash
# Recreate the bucket
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "INSERT INTO storage.buckets (id, name) VALUES ('profile-images', 'profile-images') ON CONFLICT (id) DO NOTHING;"
```

### "Row-level security policy" Error

```bash
# Reapply storage policies
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f scripts/setup-storage-policies-dev.sql
```

### Reset Everything

```bash
# Reset database and start fresh
supabase db reset --local
# Then rerun the setup steps above
```

## Files Created

- `scripts/setup-storage-policies-dev.sql` - Development-friendly RLS policies
- `scripts/setup-storage-policies.sql` - Production-ready RLS policies (unused)
- `supabase/migrations/20250823_setup_storage_policies.sql` - Migration for storage policies
- `src/utils/supabaseStorage.ts` - Storage utility functions

## Environment Variables

Make sure your `.env` file has the correct Supabase configuration:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

The anon key should match the one from `supabase status` output.
