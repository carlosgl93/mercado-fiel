# Production Database Seeding Guide

## 🎯 Purpose

This guide provides SQL queries to populate static/reference tables in your production Supabase database with essential data from the seed file.

## 📋 Static Tables to Seed

| Table | Records | Description |
|-------|---------|-------------|
| `roles` | 3 | User roles (admin, proveedor, comprador) |
| `categorias` | 6 | Product categories (Frutas, Verduras, etc.) |
| `planes` | 3 | Subscription plans (Free, Premium, Empresa) |
| `regiones` | 5 | Chilean regions |
| `comunas` | 10 | Chilean municipalities |

## 🚀 Execution Steps

### 1. Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query or use the default editor

### 2. Run the SQL File

**Option A: Copy & Paste**
1. Open `production-seed-static-tables.sql`
2. Copy all contents
3. Paste into Supabase SQL Editor
4. Click "Run" to execute

**Option B: Section by Section**
1. Run each section individually in this order:
   - Roles
   - Categories
   - Plans
   - Regions
   - Comunas
   - Verification queries

### 3. Verify Results

After execution, you should see these counts:

```sql
-- Expected results from verification query
table_name  | count
------------|------
roles       | 3
categorias  | 6
planes      | 3
regiones    | 5
comunas     | 10
```

## 🔍 Verification Commands

```sql
-- Quick count check
SELECT COUNT(*) FROM roles; -- Should be 3
SELECT COUNT(*) FROM categorias; -- Should be 6
SELECT COUNT(*) FROM planes; -- Should be 3
SELECT COUNT(*) FROM regiones; -- Should be 5
SELECT COUNT(*) FROM comunas; -- Should be 10

-- View all data
SELECT * FROM roles ORDER BY id_rol;
SELECT * FROM categorias ORDER BY id_categoria;
SELECT * FROM planes ORDER BY id_plan;
SELECT * FROM regiones ORDER BY id_region;
SELECT c.*, r.nombre as region_name 
FROM comunas c 
JOIN regiones r ON c.id_region = r.id_region 
ORDER BY c.id_region, c.id_comuna;
```

## ⚠️ Important Notes

### Foreign Key Dependencies
- **Comunas** depend on **Regiones** (must insert regions first)
- All other tables are independent

### Upsert Behavior
- All queries use `ON CONFLICT DO UPDATE`
- Safe to run multiple times
- Will update existing records with new values
- No data loss risk

### What's NOT Included
- **User data** (usuarios, clientes, proveedores)
- **Products** (productos)
- **Dynamic data** (pedidos, comentarios, etc.)
- **Storage buckets** (create manually in Dashboard)

## 🏪 Storage Buckets

After running the SQL queries, also create these storage buckets manually:

1. Go to **Storage** > **Buckets** in Supabase Dashboard
2. Create these buckets:
   - `product-images` (public: true)
   - `profile-images` (public: true)

## 🛡️ Security

- These queries are production-safe
- No DROP, DELETE, or TRUNCATE statements
- Use UPSERT pattern to prevent conflicts
- Only insert/update static reference data

## 🔧 Troubleshooting

### Common Issues

**Foreign Key Constraint Error**
- Ensure you run regiones before comunas
- Check that referenced IDs exist

**Duplicate Key Error** 
- Should not happen due to ON CONFLICT clauses
- If it does, check for typos in column names

**Permission Error**
- Ensure you have admin access to the database
- Some tables might have RLS enabled (disable temporarily if needed)

### Manual Fixes

```sql
-- If you need to start over (DANGER: Will delete data)
-- DELETE FROM comunas;
-- DELETE FROM regiones; 
-- DELETE FROM planes;
-- DELETE FROM categorias;
-- DELETE FROM roles;

-- Then re-run the seed queries
```

## 🎯 Next Steps

After seeding static tables:

1. ✅ Verify all tables have correct data
2. ✅ Create storage buckets manually
3. ✅ Set up storage policies (see `docs/STORAGE_POLICIES_SETUP.md`)
4. ✅ Test user registration flow
5. ✅ Create initial admin user if needed

## 📞 Support

If you encounter issues:
1. Check the verification queries first
2. Review foreign key dependencies
3. Ensure proper permissions in Supabase
4. Consult the detailed documentation in `docs/`
