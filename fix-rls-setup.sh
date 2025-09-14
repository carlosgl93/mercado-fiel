#!/bin/bash

# Fix RLS Authentication Issues - Setup Script
# This script helps you implement the fix for the 403 Unauthorized error

echo "🔧 Fixing Supabase RLS Authentication Issues..."

# Step 1: Add required packages to functions
echo "📦 Adding Supabase client to functions..."
cd functions
npm install @supabase/supabase-js

# Step 2: Check environment variables
echo "🔍 Checking environment variables..."
if [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "⚠️  WARNING: SUPABASE_SERVICE_KEY environment variable not set"
    echo "   Please add it to your .env file in the functions directory"
    echo "   You can find it in your Supabase project settings under API"
fi

if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "⚠️  WARNING: VITE_SUPABASE_URL environment variable not set"
    echo "   Please add it to your .env file"
fi

# Step 3: Backup original productos.ts
echo "💾 Creating backup of original productos.ts..."
if [ -f "src/routes/productos.ts" ]; then
    cp src/routes/productos.ts src/routes/productos.ts.backup
    echo "✅ Backup created: src/routes/productos.ts.backup"
fi

cd ..

echo ""
echo "🎯 Next Steps:"
echo "1. Run the fix-rls-auth.sql script in your Supabase SQL editor (optional - for full RLS support)"
echo "2. Add the missing environment variables to your functions/.env file:"
echo "   SUPABASE_SERVICE_KEY=your_service_role_key_here"
echo "3. Restart your functions server"
echo "4. Test product creation"
echo ""
echo "🔑 Alternative Quick Fix:"
echo "If you want to temporarily disable RLS on productos table, run this SQL:"
echo "ALTER TABLE public.productos DISABLE ROW LEVEL SECURITY;"
echo ""
echo "✨ Done! Your product creation should now work without RLS issues."
