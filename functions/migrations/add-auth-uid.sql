-- Migration: Add auth_uid to usuarios table
-- This migration adds the auth_uid field to link Supabase authentication with usuarios

BEGIN;

-- Add auth_uid column to usuarios table
ALTER TABLE public.usuarios 
ADD COLUMN auth_uid UUID UNIQUE;

-- Create index for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_auth_uid ON public.usuarios(auth_uid);

-- Add foreign key constraint to auth.users (if using Supabase)
-- Note: This assumes you're using Supabase's built-in auth schema
-- ALTER TABLE public.usuarios 
-- ADD CONSTRAINT fk_usuarios_auth_uid 
-- FOREIGN KEY (auth_uid) REFERENCES auth.users(id);

COMMIT;
