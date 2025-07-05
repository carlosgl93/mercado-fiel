# Database Setup - Mercado Fiel

## Architecture Overview

Mercado Fiel uses a hybrid approach for backend services:

- **Firebase**: Authentication, Cloud Functions, Storage, Analytics, Emulators
- **Supabase PostgreSQL**: Main database with Prisma ORM
- **Express.js**: API server running on Firebase Cloud Functions

## Database Configuration

> **⚠️ SECURITY WARNING**: Never commit real API keys, database URLs, or secrets to version control. Always use placeholder values in documentation and store real credentials in environment variables or secure secret management systems.

### 1. Supabase PostgreSQL

- **Provider**: Supabase (hosted PostgreSQL)
- **ORM**: Prisma
- **Connection**: Via connection pooling for production

### 2. Environment Variables

#### Client-side (.env)

```bash
# Supabase (for client-side operations)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firebase (for auth, functions, storage)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Server-side (Cloud Functions)

```bash
# Database (for Prisma ORM)
DATABASE_URL="postgresql://postgres.your_ref:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.your_ref:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"
```

## Database Schema

The database follows the ERD structure with these main entities:

### Core Tables

- **usuarios** - Users/customers
- **proveedores** - Providers/sellers
- **productos** - Products with pricing
- **comentarios** - Reviews and ratings

### Business Logic Tables

- **solicitudescontacto** - Contact requests between users and providers
- **planes** - Subscription plans for providers
- **suscripciones** - Active subscriptions
- **pagos** - Payment records
- **publicidad** - Advertising/promotional content

## Usage Patterns

### 1. Server-side (Cloud Functions)

Use Prisma for all database operations:

```typescript
import { db } from '@/lib/prisma'

// Example: Get products
const products = await db.productos.findMany({
  include: {
    proveedor: true,
    comentarios: true
  }
})
```

### 2. Client-side

Use Supabase client for real-time features only:

```typescript
import { supabase } from '@/lib/supabase'

// Example: Subscribe to real-time changes
const subscription = supabase
  .channel('productos')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'productos' },
    (payload) => console.log('Change received!', payload)
  )
  .subscribe()
```

### 3. API Calls

Use TanStack Query for data fetching from Express API:

```typescript
import { useQuery } from '@tanstack/react-query'

const { data: products } = useQuery({
  queryKey: ['products'],
  queryFn: () => fetch('/api/products').then(res => res.json())
})
```

## Development Workflow

### 1. Database Migrations

```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes (development)
pnpm db:push

# Create and run migrations (production)
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio
```

### 2. Schema Updates

1. Update `/prisma/schema.prisma`
2. Run `pnpm db:generate`
3. Test changes locally
4. Create migration for production

## Security

### Row Level Security (RLS)

Supabase RLS should be configured for:

- User data isolation
- Provider-specific data access
- Admin-only operations

### Authentication Flow

1. **Firebase Auth** handles user authentication
2. **Custom claims** or **JWT verification** in Cloud Functions
3. **Database queries** filtered by user context via Prisma

## Connection Details

### Supabase Project

- **URL**: `https://your_ref.supabase.co`
- **Region**: AWS South America (São Paulo)
- **Database**: PostgreSQL 15

### Connection Pools

- **Transactional**: Port 6543 (via PgBouncer)
- **Direct**: Port 5432 (for migrations)

## Monitoring

- **Supabase Dashboard**: Database metrics, query performance
- **Prisma Studio**: Database browser and editor
- **Firebase Console**: Functions logs, authentication

## Backup Strategy

- **Automatic**: Supabase handles automated backups
- **Manual**: Use `pg_dump` for additional backups if needed
- **Point-in-time**: Available through Supabase for 7 days (free tier)
