-- Quick Fix: Temporarily disable RLS on productos and related tables
-- This will allow product creation to work immediately while you implement proper auth mapping

-- Disable RLS on productos table
ALTER TABLE public.productos DISABLE ROW LEVEL SECURITY;

-- Disable RLS on descuentos_cantidad table  
ALTER TABLE public.descuentos_cantidad DISABLE ROW LEVEL SECURITY;

-- Optional: Re-enable RLS later when you have proper auth mapping
-- ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.descuentos_cantidad ENABLE ROW LEVEL SECURITY;
