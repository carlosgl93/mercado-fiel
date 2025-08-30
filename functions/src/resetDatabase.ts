#!/usr/bin/env node

import { execSync } from 'child_process';
import { dropDatabase } from './dropDatabase.js';

async function resetDatabase() {
  console.log('🔄 Starting complete database reset...');

  try {
    // Step 1: Drop all existing tables
    console.log('\n📝 Step 1: Dropping existing database...');
    await dropDatabase();

    // Step 2: Push the schema to recreate tables
    console.log('\n📝 Step 2: Recreating database schema...');
    execSync('npx prisma db push --force-reset', {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    // Step 3: Generate Prisma client
    console.log('\n📝 Step 3: Generating Prisma client...');
    execSync('npx prisma generate', {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    // Step 4: Seed the database
    console.log('\n📝 Step 4: Seeding database with sample data...');
    execSync('npx tsx src/seed.ts', {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    console.log('\n🎉 Database reset completed successfully!');
    console.log('✅ Your database is now clean and seeded with sample data');
  } catch (error) {
    console.error('\n❌ Database reset failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  resetDatabase();
}

export { resetDatabase };
