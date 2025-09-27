#!/bin/bash
# scripts/reset-dev-db.sh - Reset local Supabase database

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🗑️ Resetting local Supabase database...${NC}"

# Check if we're in development environment
if [[ "$NODE_ENV" == "production" || "$VITE_ENV" == "production" ]]; then
  echo -e "${RED}❌ Error: Cannot reset database in production environment!${NC}"
  exit 1
fi

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
  echo -e "${RED}❌ Supabase CLI not found. Please install it first.${NC}"
  echo -e "${YELLOW}💡 Install with: npm install -g supabase${NC}"
  exit 1
fi

# Step 1: Reset the database
echo -e "${YELLOW}📥 Resetting Supabase database...${NC}"
supabase db reset

# Step 2: Push Prisma schema
echo -e "${YELLOW}🔄 Syncing Prisma schema...${NC}"
cd functions
npx prisma db push

# Step 3: Seed with fresh data
echo -e "${YELLOW}🌱 Seeding database with fresh data...${NC}"
npx tsx src/seed.ts

echo -e "${GREEN}✅ Database reset complete!${NC}"
echo -e "${BLUE}📊 Your local development database is ready to use.${NC}"
echo -e "${BLUE}🌐 Access Supabase Studio at: http://localhost:54323${NC}"