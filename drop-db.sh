#!/bin/bash

echo "🔥 Supabase Database Drop Script"
echo "================================="
echo ""

# Navigate to functions directory
cd "$(dirname "$0")/functions"

echo "📍 Current directory: $(pwd)"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the functions directory."
    exit 1
fi

echo "🤔 What would you like to do?"
echo "1) Drop all tables only (keeps schema structure)"
echo "2) Complete reset (drop + recreate + seed)"
echo "3) Cancel"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🗑️  Dropping all database tables..."
        npm run db:drop
        echo ""
        echo "✅ Tables dropped successfully!"
        echo "💡 You can now run 'npm run db:push' to recreate tables"
        echo "💡 Then run 'npm run db:seed' to add sample data"
        ;;
    2)
        echo ""
        echo "🔄 Performing complete database reset..."
        npm run db:reset-full
        ;;
    3)
        echo "❌ Operation cancelled."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Operation cancelled."
        exit 1
        ;;
esac

echo ""
echo "🎉 Operation completed!"
