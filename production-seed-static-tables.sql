-- =====================================================
-- STATIC TABLES SEED DATA FOR PRODUCTION DATABASE
-- Run these SQL queries in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. ROLES TABLE
-- =====================================================

INSERT INTO roles (id_rol, nombre, descripcion) VALUES
  (1, 'admin', 'Administrador del sistema'),
  (2, 'proveedor', 'Vendedor en la plataforma'),
  (3, 'comprador', 'Cliente que realiza compras')
ON CONFLICT (id_rol) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion;

-- =====================================================
-- 2. CATEGORIAS TABLE
-- =====================================================

INSERT INTO categorias (id_categoria, nombre, created_at, updated_at) VALUES
  (1, 'Frutas', NOW(), NOW()),
  (5, 'Verduras', NOW(), NOW()),
  (2, 'Carnes y Pescados', NOW(), NOW()),
  (3, 'Panadería y Pastelería', NOW(), NOW()),
  (4, 'Lácteos y Quesos', NOW(), NOW()),
  (14, 'Bebidas y Jugos', NOW(), NOW())
ON CONFLICT (id_categoria) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  updated_at = NOW();

-- =====================================================
-- 3. PLANES TABLE (Subscription Plans)
-- =====================================================

INSERT INTO planes (id_plan, nombre, precio_mensual, descripcion, created_at, updated_at) VALUES
  (1, 'Free', 0.0, 'Plan gratuito para nuevos proveedores.', NOW(), NOW()),
  (2, 'Premium', 9900.0, 'Plan para proveedores destacados con más visibilidad.', NOW(), NOW()),
  (3, 'Empresa', 19900.0, 'Plan para empresas grandes con funciones avanzadas.', NOW(), NOW())
ON CONFLICT (id_plan) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  precio_mensual = EXCLUDED.precio_mensual,
  descripcion = EXCLUDED.descripcion,
  updated_at = NOW();

-- =====================================================
-- 4. REGIONES TABLE (Chilean Regions)
-- =====================================================

INSERT INTO regiones (id_region, codigo_region, nombre, created_at, updated_at) VALUES
  (1, 'RM', 'Metropolitana', NOW(), NOW()),
  (2, 'V', 'Valparaíso', NOW(), NOW()),
  (3, 'VIII', 'Biobío', NOW(), NOW()),
  (4, 'IX', 'Araucanía', NOW(), NOW()),
  (5, 'X', 'Los Lagos', NOW(), NOW())
ON CONFLICT (id_region) DO UPDATE SET
  codigo_region = EXCLUDED.codigo_region,
  nombre = EXCLUDED.nombre,
  updated_at = NOW();

-- =====================================================
-- 5. COMUNAS TABLE (Chilean Municipalities)
-- =====================================================

INSERT INTO comunas (id_comuna, nombre, id_region, created_at, updated_at) VALUES
  (1, 'Santiago', 1, NOW(), NOW()),
  (2, 'Providencia', 1, NOW(), NOW()),
  (3, 'Las Condes', 1, NOW(), NOW()),
  (4, 'Ñuñoa', 1, NOW(), NOW()),
  (5, 'Valparaíso', 2, NOW(), NOW()),
  (6, 'Viña del Mar', 2, NOW(), NOW()),
  (7, 'Concepción', 3, NOW(), NOW()),
  (8, 'Talcahuano', 3, NOW(), NOW()),
  (9, 'Temuco', 4, NOW(), NOW()),
  (10, 'Puerto Montt', 5, NOW(), NOW())
ON CONFLICT (id_comuna) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  id_region = EXCLUDED.id_region,
  updated_at = NOW();

-- =====================================================
-- 6. VERIFICATION QUERIES
-- =====================================================

-- Check that all data was inserted correctly
SELECT 'roles' as table_name, COUNT(*) as count FROM roles
UNION ALL
SELECT 'categorias' as table_name, COUNT(*) as count FROM categorias  
UNION ALL
SELECT 'planes' as table_name, COUNT(*) as count FROM planes
UNION ALL
SELECT 'regiones' as table_name, COUNT(*) as count FROM regiones
UNION ALL
SELECT 'comunas' as table_name, COUNT(*) as count FROM comunas;

-- View the data
SELECT 'ROLES' as section;
SELECT * FROM roles ORDER BY id_rol;

SELECT 'CATEGORIAS' as section;  
SELECT * FROM categorias ORDER BY id_categoria;

SELECT 'PLANES' as section;
SELECT * FROM planes ORDER BY id_plan;

SELECT 'REGIONES' as section;
SELECT * FROM regiones ORDER BY id_region;

SELECT 'COMUNAS' as section;
SELECT c.id_comuna, c.nombre as comuna, r.nombre as region
FROM comunas c
JOIN regiones r ON c.id_region = r.id_region
ORDER BY c.id_region, c.id_comuna;

-- =====================================================
-- NOTES
-- =====================================================

/*
IMPORTANT NOTES:

1. EXECUTION ORDER: Run these queries in the exact order shown above.
   Some tables have foreign key dependencies (e.g., comunas depends on regiones).

2. UPSERT BEHAVIOR: All queries use ON CONFLICT DO UPDATE to safely run multiple times.
   If records already exist, they will be updated with the new values.

3. EXPECTED COUNTS:
   - roles: 3 records
   - categorias: 6 records  
   - planes: 3 records
   - regiones: 5 records
   - comunas: 10 records

4. FOREIGN KEYS:
   - comunas.id_region references regiones.id_region
   - Make sure regiones are inserted before comunas

5. STORAGE BUCKETS: 
   These SQL queries only handle database tables.
   Storage buckets (product-images, profile-images) need to be created
   through the Supabase Dashboard > Storage section.

6. PRODUCTION SAFETY:
   - These queries are safe to run in production
   - They will not delete existing data
   - They use UPSERT pattern to prevent duplicates
   - No DROP or TRUNCATE statements included
*/