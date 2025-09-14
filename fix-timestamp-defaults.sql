-- Fix timestamp columns to have proper defaults and triggers

BEGIN;

-- Update productos table to have proper defaults
ALTER TABLE public.productos 
ALTER COLUMN created_at SET DEFAULT NOW(),
ALTER COLUMN updated_at SET DEFAULT NOW();

-- Update descuentos_cantidad table to have proper defaults  
ALTER TABLE public.descuentos_cantidad
ALTER COLUMN created_at SET DEFAULT NOW(),
ALTER COLUMN updated_at SET DEFAULT NOW();

-- Create a trigger function to automatically update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to productos table
DROP TRIGGER IF EXISTS update_productos_updated_at ON public.productos;
CREATE TRIGGER update_productos_updated_at 
    BEFORE UPDATE ON public.productos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply the trigger to descuentos_cantidad table
DROP TRIGGER IF EXISTS update_descuentos_cantidad_updated_at ON public.descuentos_cantidad;
CREATE TRIGGER update_descuentos_cantidad_updated_at 
    BEFORE UPDATE ON public.descuentos_cantidad 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;
