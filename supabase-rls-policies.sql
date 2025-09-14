-- =====================================================
-- SUPABASE ROW LEVEL SECURITY POLICIES
-- Run these SQL commands in your Supabase SQL editor
-- =====================================================

-- =====================================================
-- 0. CHECK WHICH TABLES EXIST (Run this first to verify schema)
-- =====================================================

-- Check what tables exist in your database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- =====================================================
-- 1. ENABLE RLS ON CORE TABLES (only if they exist)
-- =====================================================

-- Enable RLS on core tables
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY; 
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE direcciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- Enable RLS on storage buckets
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Optional tables (only enable if they exist - check output from step 0)
-- ALTER TABLE descuentos_cantidad ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE compras_colectivas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE carrito ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to get current user's database ID
CREATE OR REPLACE FUNCTION auth.get_user_db_id()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT id_usuario 
    FROM usuarios 
    WHERE email = auth.jwt() ->> 'email'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is a supplier
CREATE OR REPLACE FUNCTION auth.is_supplier()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM usuarios u
    JOIN proveedores p ON u.id_usuario = p.id_usuario
    WHERE u.email = auth.jwt() ->> 'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is a customer
CREATE OR REPLACE FUNCTION auth.is_customer()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM usuarios u
    JOIN clientes c ON u.id_usuario = c.id_usuario
    WHERE u.email = auth.jwt() ->> 'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's supplier ID
CREATE OR REPLACE FUNCTION auth.get_supplier_id()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT p.id_proveedor
    FROM usuarios u
    JOIN proveedores p ON u.id_usuario = p.id_usuario
    WHERE u.email = auth.jwt() ->> 'email'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's customer ID
CREATE OR REPLACE FUNCTION auth.get_customer_id()
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT c.id_cliente
    FROM usuarios u
    JOIN clientes c ON u.id_usuario = c.id_usuario
    WHERE u.email = auth.jwt() ->> 'email'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. USUARIOS TABLE POLICIES
-- =====================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON usuarios
  FOR SELECT USING (email = auth.jwt() ->> 'email');

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON usuarios
  FOR UPDATE USING (email = auth.jwt() ->> 'email');

-- Allow user creation during signup
CREATE POLICY "Allow user creation during signup" ON usuarios
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- 4. CLIENTES TABLE POLICIES
-- =====================================================

-- Customers can read their own data
CREATE POLICY "Customers can view own data" ON clientes
  FOR SELECT USING (id_usuario = auth.get_user_db_id());

-- Customers can update their own data
CREATE POLICY "Customers can update own data" ON clientes
  FOR UPDATE USING (id_usuario = auth.get_user_db_id());

-- Allow customer creation during signup
CREATE POLICY "Allow customer creation during signup" ON clientes
  FOR INSERT WITH CHECK (true);

-- Suppliers can read customer data (for orders/communication)
CREATE POLICY "Suppliers can view customer data" ON clientes
  FOR SELECT USING (auth.is_supplier());

-- =====================================================
-- 5. PROVEEDORES TABLE POLICIES
-- =====================================================

-- Suppliers can read their own data
CREATE POLICY "Suppliers can view own data" ON proveedores
  FOR SELECT USING (id_usuario = auth.get_user_db_id());

-- Suppliers can update their own data
CREATE POLICY "Suppliers can update own data" ON proveedores
  FOR UPDATE USING (id_usuario = auth.get_user_db_id());

-- Allow supplier creation during signup
CREATE POLICY "Allow supplier creation during signup" ON proveedores
  FOR INSERT WITH CHECK (true);

-- Everyone can read supplier data (for marketplace)
CREATE POLICY "Anyone can view supplier profiles" ON proveedores
  FOR SELECT USING (true);

-- =====================================================
-- 6. PRODUCTOS TABLE POLICIES
-- =====================================================

-- Everyone can read products (public marketplace)
CREATE POLICY "Anyone can view products" ON productos
  FOR SELECT USING (true);

-- Suppliers can create their own products
CREATE POLICY "Suppliers can create own products" ON productos
  FOR INSERT WITH CHECK (id_proveedor = auth.get_supplier_id());

-- Suppliers can update their own products
CREATE POLICY "Suppliers can update own products" ON productos
  FOR UPDATE USING (id_proveedor = auth.get_supplier_id());

-- Suppliers can delete their own products
CREATE POLICY "Suppliers can delete own products" ON productos
  FOR DELETE USING (id_proveedor = auth.get_supplier_id());

-- =====================================================
-- 7. CATEGORIAS TABLE POLICIES
-- =====================================================

-- Everyone can read categories (public marketplace)
CREATE POLICY "Anyone can view categories" ON categorias
  FOR SELECT USING (true);

-- Only authenticated users can suggest new categories (optional)
-- CREATE POLICY "Authenticated users can suggest categories" ON categorias
--   FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- 8. DESCUENTOS_CANTIDAD TABLE POLICIES (only if table exists)
-- =====================================================

-- Uncomment these only if descuentos_cantidad table exists in your database
-- 
-- -- Everyone can read discounts (public marketplace)
-- CREATE POLICY "Anyone can view discounts" ON descuentos_cantidad
--   FOR SELECT USING (true);
-- 
-- -- Suppliers can manage discounts for their own products
-- CREATE POLICY "Suppliers can manage own product discounts" ON descuentos_cantidad
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM productos p 
--       WHERE p.id_producto = descuentos_cantidad.id_producto 
--       AND p.id_proveedor = auth.get_supplier_id()
--     )
--   );

-- =====================================================
-- 9. DIRECCIONES TABLE POLICIES
-- =====================================================

-- Users can read their own addresses
CREATE POLICY "Users can view own addresses" ON direcciones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM usuarios u 
      WHERE u.id_usuario = auth.get_user_db_id()
      AND (
        -- User's customer address
        EXISTS (SELECT 1 FROM clientes c WHERE c.id_usuario = u.id_usuario AND c.id_direccion = direcciones.id_direccion)
        OR
        -- User's supplier address
        EXISTS (SELECT 1 FROM proveedores p WHERE p.id_usuario = u.id_usuario AND p.id_direccion = direcciones.id_direccion)
      )
    )
  );

-- Users can update their own addresses
CREATE POLICY "Users can update own addresses" ON direcciones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM usuarios u 
      WHERE u.id_usuario = auth.get_user_db_id()
      AND (
        EXISTS (SELECT 1 FROM clientes c WHERE c.id_usuario = u.id_usuario AND c.id_direccion = direcciones.id_direccion)
        OR
        EXISTS (SELECT 1 FROM proveedores p WHERE p.id_usuario = u.id_usuario AND p.id_direccion = direcciones.id_direccion)
      )
    )
  );

-- Users can create addresses
CREATE POLICY "Users can create addresses" ON direcciones
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' IS NOT NULL);

-- =====================================================
-- 10. STORAGE POLICIES (for product images)
-- =====================================================

-- Allow authenticated users to upload to product-images bucket
CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
    AND auth.is_supplier()
  );

-- Allow authenticated users to read product images
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Suppliers can update their own product images
CREATE POLICY "Suppliers can update own product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
    AND auth.is_supplier()
  );

-- Suppliers can delete their own product images
CREATE POLICY "Suppliers can delete own product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
    AND auth.is_supplier()
  );

-- =====================================================
-- 11. COMPRAS_COLECTIVAS TABLE POLICIES (only if table exists)
-- =====================================================

-- Uncomment these only if compras_colectivas table exists in your database
-- Note: Based on your schema, the table is called "compras_colectivas", not "campanas_colectivas"
--
-- -- Everyone can read campaigns (public marketplace)
-- CREATE POLICY "Anyone can view campaigns" ON compras_colectivas
--   FOR SELECT USING (true);
-- 
-- -- Suppliers can create campaigns for their own products
-- CREATE POLICY "Suppliers can create campaigns for own products" ON compras_colectivas
--   FOR INSERT WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM productos p 
--       WHERE p.id_producto = compras_colectivas.id_producto 
--       AND p.id_proveedor = auth.get_supplier_id()
--     )
--   );
-- 
-- -- Suppliers can update their own campaigns
-- CREATE POLICY "Suppliers can update own campaigns" ON compras_colectivas
--   FOR UPDATE USING (
--     EXISTS (
--       SELECT 1 FROM productos p 
--       WHERE p.id_producto = compras_colectivas.id_producto 
--       AND p.id_proveedor = auth.get_supplier_id()
--     )
--   );
-- 
-- -- Suppliers can delete their own campaigns
-- CREATE POLICY "Suppliers can delete own campaigns" ON compras_colectivas
--   FOR DELETE USING (
--     EXISTS (
--       SELECT 1 FROM productos p 
--       WHERE p.id_producto = compras_colectivas.id_producto 
--       AND p.id_proveedor = auth.get_supplier_id()
--     )
--   );

-- =====================================================
-- VERIFICATION QUERIES (Run these to test)
-- =====================================================

-- Test if policies are working (run as authenticated user)
-- SELECT auth.get_user_db_id();
-- SELECT auth.is_supplier();
-- SELECT auth.is_customer();
-- SELECT auth.get_supplier_id();
-- SELECT auth.get_customer_id();
