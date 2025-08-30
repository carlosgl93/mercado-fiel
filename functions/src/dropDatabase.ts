import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function dropDatabase() {
  console.log('🔥 Starting database cleanup...');

  try {
    // Get all table names from the database
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `;

    console.log(`📋 Found ${tables.length} tables to drop:`);
    tables.forEach((table) => console.log(`  - ${table.tablename}`));

    // Disable foreign key checks temporarily
    await prisma.$executeRaw`SET session_replication_role = replica;`;

    // Drop each table using unsafe raw SQL
    for (const table of tables) {
      console.log(`🗑️  Dropping table: ${table.tablename}`);
      // Use $executeRawUnsafe for dynamic table names
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE;`);
    }

    // Re-enable foreign key checks
    await prisma.$executeRaw`SET session_replication_role = DEFAULT;`;

    // Drop Prisma migration table if it exists
    console.log('🗑️  Dropping Prisma migration table...');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;');

    // Drop any sequences that might be left
    const sequences = await prisma.$queryRaw<Array<{ sequencename: string }>>`
      SELECT sequencename 
      FROM pg_sequences 
      WHERE schemaname = 'public'
    `;

    for (const sequence of sequences) {
      console.log(`🗑️  Dropping sequence: ${sequence.sequencename}`);
      await prisma.$executeRawUnsafe(`DROP SEQUENCE IF EXISTS "${sequence.sequencename}" CASCADE;`);
    }

    // Drop any custom types that might be left
    const types = await prisma.$queryRaw<Array<{ typname: string }>>`
      SELECT typname 
      FROM pg_type 
      WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      AND typtype = 'e'
    `;

    for (const type of types) {
      console.log(`🗑️  Dropping type: ${type.typname}`);
      await prisma.$executeRawUnsafe(`DROP TYPE IF EXISTS "${type.typname}" CASCADE;`);
    }

    console.log('✅ Database cleanup completed successfully!');
    console.log('💡 You can now run "npm run db:push" to recreate the schema');
    console.log('💡 Then run "npm run db:seed" to populate with sample data');
  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script if called directly
if (require.main === module) {
  dropDatabase().catch((error) => {
    console.error('❌ Database drop failed:', error);
    process.exit(1);
  });
}

export { dropDatabase };
