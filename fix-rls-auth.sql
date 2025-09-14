-- Fix for Supabase RLS Authentication Issues
-- This script addresses the 403 Unauthorized error when creating products

-- Option 1: Add auth_uid column to usuarios table (Recommended)
-- This creates a proper bridge between Supabase auth and your application users

ALTER TABLE public.usuarios 
ADD COLUMN auth_uid UUID REFERENCES auth.users(id);

-- Create unique index for performance
CREATE UNIQUE INDEX idx_usuarios_auth_uid ON public.usuarios(auth_uid);

-- Update RLS policies to use auth_uid mapping
-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "productos_insert_policy" ON public.productos;
DROP POLICY IF EXISTS "productos_select_policy" ON public.productos;
DROP POLICY IF EXISTS "productos_update_policy" ON public.productos;
DROP POLICY IF EXISTS "productos_delete_policy" ON public.productos;

-- Create new RLS policies that work with auth_uid mapping
CREATE POLICY "productos_select_policy" ON public.productos
FOR SELECT USING (true); -- Allow all users to view products

CREATE POLICY "productos_insert_policy" ON public.productos
FOR INSERT WITH CHECK (
  id_proveedor IN (
    SELECT p.id_proveedor 
    FROM public.proveedores p
    JOIN public.usuarios u ON p.id_usuario = u.id_usuario
    WHERE u.auth_uid = auth.uid()
  )
);

CREATE POLICY "productos_update_policy" ON public.productos
FOR UPDATE USING (
  id_proveedor IN (
    SELECT p.id_proveedor 
    FROM public.proveedores p
    JOIN public.usuarios u ON p.id_usuario = u.id_usuario
    WHERE u.auth_uid = auth.uid()
  )
);

CREATE POLICY "productos_delete_policy" ON public.productos
FOR DELETE USING (
  id_proveedor IN (
    SELECT p.id_proveedor 
    FROM public.proveedores p
    JOIN public.usuarios u ON p.id_usuario = u.id_usuario
    WHERE u.auth_uid = auth.uid()
  )
);

-- Enable RLS on productos table (if not already enabled)
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Add similar policies for descuentos_cantidad table
DROP POLICY IF EXISTS "descuentos_select_policy" ON public.descuentos_cantidad;
DROP POLICY IF EXISTS "descuentos_insert_policy" ON public.descuentos_cantidad;
DROP POLICY IF EXISTS "descuentos_update_policy" ON public.descuentos_cantidad;
DROP POLICY IF EXISTS "descuentos_delete_policy" ON public.descuentos_cantidad;

CREATE POLICY "descuentos_select_policy" ON public.descuentos_cantidad
FOR SELECT USING (true);

CREATE POLICY "descuentos_insert_policy" ON public.descuentos_cantidad
FOR INSERT WITH CHECK (
  id_producto IN (
    SELECT pr.id_producto 
    FROM public.productos pr
    JOIN public.proveedores p ON pr.id_proveedor = p.id_proveedor
    JOIN public.usuarios u ON p.id_usuario = u.id_usuario
    WHERE u.auth_uid = auth.uid()
  )
);

CREATE POLICY "descuentos_update_policy" ON public.descuentos_cantidad
FOR UPDATE USING (
  id_producto IN (
    SELECT pr.id_producto 
    FROM public.productos pr
    JOIN public.proveedores p ON pr.id_proveedor = p.id_proveedor
    JOIN public.usuarios u ON p.id_usuario = u.id_usuario
    WHERE u.auth_uid = auth.uid()
  )
);

CREATE POLICY "descuentos_delete_policy" ON public.descuentos_cantidad
FOR DELETE USING (
  id_producto IN (
    SELECT pr.id_producto 
    FROM public.productos pr
    JOIN public.proveedores p ON pr.id_proveedor = p.id_proveedor
    JOIN public.usuarios u ON p.id_usuario = u.id_usuario
    WHERE u.auth_uid = auth.uid()
  )
);

ALTER TABLE public.descuentos_cantidad ENABLE ROW LEVEL SECURITY;
