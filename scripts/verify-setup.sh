#!/bin/bash

# Mercado Fiel - Setup Verification Script
echo "🔍 Verifying Mercado Fiel Setup..."
echo ""

# Check Node.js version
echo "📦 Node.js version:"
node --version
echo ""

# Check pnpm version
echo "📦 pnpm version:"
pnpm --version
echo ""

# Check if required packages are installed
echo "📋 Checking required packages..."
pnpm list --depth=0 | grep -E "(firebase|supabase|prisma)" || echo "❌ Missing required packages"
echo ""

# Validate Prisma schema
echo "🗄️  Validating Prisma schema..."
npx prisma validate
echo ""

# Check environment variables
echo "🔐 Checking environment variables..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    
    # Check Firebase config
    if grep -q "VITE_FIREBASE_PROJECT_ID=mercado-fiel" .env; then
        echo "✅ Firebase project ID configured"
    else
        echo "❌ Firebase project ID not configured"
    fi
    
    # Check Supabase config
    if grep -q "VITE_SUPABASE_URL=https://xnehuzmpesnelhdboijy.supabase.co" .env; then
        echo "✅ Supabase URL configured"
    else
        echo "❌ Supabase URL not configured"
    fi
    
    # Check database URLs
    if grep -q "DATABASE_URL" .env; then
        echo "✅ Database URL configured"
    else
        echo "❌ Database URL not configured"
    fi
else
    echo "❌ .env file not found - copy from .env.template"
fi
echo ""

# Check key files
echo "📁 Checking key configuration files..."
files=(
    "src/firebase/firebase.ts"
    "src/lib/supabase.ts"
    "src/lib/prisma.ts"
    "prisma/schema.prisma"
    "package.json"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done
echo ""

# Check build
echo "🔨 Testing build..."
pnpm build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - check for errors"
fi
echo ""

echo "🎉 Setup verification complete!"
echo ""
echo "📚 Next steps:"
echo "1. Set your database password in DATABASE_URL and DIRECT_URL in .env"
echo "2. Run 'pnpm db:push' to sync your schema with Supabase"
echo "3. Start development with 'pnpm dev'"
echo "4. Start Firebase emulators with 'pnpm emulators'"
