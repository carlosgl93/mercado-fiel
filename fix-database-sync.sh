#!/bin/bash

# Database Schema Sync Check
# This script helps you identify and fix database schema sync issues

echo "🔍 Database Schema Sync Check"
echo "============================="
echo ""

echo "The error 'relation \"descuentos_cantidad\" does not exist' suggests your database"
echo "is not synced with your Prisma schema."
echo ""

echo "📋 Steps to fix the database sync issue:"
echo ""

echo "1. 🗄️ Check if your database URL is correct in functions/.env:"
echo "   DATABASE_URL=your_supabase_database_url"
echo "   DIRECT_URL=your_supabase_direct_url"
echo ""

echo "2. 🔄 Generate Prisma client (from functions directory):"
echo "   cd functions"
echo "   npx prisma generate"
echo ""

echo "3. 📊 Check current database state:"
echo "   npx prisma db pull"
echo "   # This will show you what's actually in your database"
echo ""

echo "4. 🚀 Sync your schema to the database (choose one):"
echo ""
echo "   Option A - Push schema without migration (faster):"
echo "   npx prisma db push"
echo ""
echo "   Option B - Create and apply migration (recommended for production):"
echo "   npx prisma migrate dev --name init"
echo ""

echo "5. ✅ Verify the sync worked:"
echo "   npx prisma studio"
echo "   # This opens a GUI to browse your database"
echo ""

echo "6. 🔐 After database sync, run the minimal RLS policies:"
echo "   Use 'supabase-rls-policies-minimal.sql' instead of the full version"
echo "   This focuses only on essential authentication tables"
echo ""

echo "🔧 Quick Commands (run in functions directory):"
echo "=================================="
echo ""
echo "# Check what's in your database now:"
echo "cd functions && npx prisma db pull"
echo ""
echo "# Sync your schema to database:"
echo "cd functions && npx prisma db push"
echo ""
echo "# Generate client after sync:"
echo "cd functions && npx prisma generate"
echo ""

echo "⚠️  Important Notes:"
echo "==================="
echo ""
echo "• The 'descuentos_cantidad' table exists in your Prisma schema but not in Supabase"
echo "• This suggests your database is behind your schema definitions"
echo "• Running 'prisma db push' will create all missing tables"
echo "• After sync, use 'supabase-rls-policies-minimal.sql' for authentication"
echo ""

echo "🧪 Test After Sync:"
echo "=================="
echo ""
echo "1. Try signing up a new user"
echo "2. Check that tables are created in Supabase dashboard"
echo "3. Run the minimal RLS policies"
echo "4. Test authentication and image upload"
echo ""

echo "📞 If you need help:"
echo "==================="
echo ""
echo "Run this script first, then:"
echo "1. Check the Prisma commands output"
echo "2. Look at your Supabase dashboard to see if tables exist"
echo "3. Try the minimal RLS policies after schema sync"
