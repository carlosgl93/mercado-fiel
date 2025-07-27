# Environment Management System

This system automates switching between development (local emulators) and production environments to save costs on Supabase branches and streamline development.

## 🚀 Quick Start

### 1. Initial Setup

```bash
# Run this once to set up the environment system
pnpm run env:setup
```

### 2. Development Workflow

```bash
# Start complete development environment (Supabase + Firebase emulators)
pnpm run dev:start

# OR for quick frontend development only
pnpm run dev:quick
```

### 3. Production Deployment

```bash
# Deploy to production with environment switching
pnpm run prod:deploy

# OR quick production deployment
pnpm run prod:quick
```

## 📋 Available Commands

### Environment Management

- `pnpm run env:setup` - Initial setup of environment files
- `pnpm run env:dev` - Switch to development environment
- `pnpm run env:prod` - Switch to production environment  
- `pnpm run env:status` - Show current environment
- `pnpm run env:clean` - Clean up and stop all services

### Development

- `pnpm run dev:start` - Complete development environment with all services
- `pnpm run dev:quick` - Quick frontend development (manual emulator management)

### Additional Development Commands

- `pnpm run dev:supabase` - Start only Supabase emulators
- `pnpm run dev:supabase:stop` - Stop Supabase emulators
- `pnpm run dev:supabase:status` - Check Supabase status
- `pnpm run dev:supabase:studio` - Open Supabase Studio

### Setup Verification

- `chmod +x scripts/verify-setup.sh && ./scripts/verify-setup.sh` - Verify your setup

## 🏗️ Architecture

### Project Structure

```
mercado-fiel/
├── functions/          # Firebase Functions
├── supabase/          # Supabase configuration & migrations
├── src/               # Frontend React app  
├── scripts/           # Environment management scripts
└── ...
```

### Development Environment

- **Database**: Local Supabase emulator (PostgreSQL 17 on localhost:54322)
- **API**: Local Firebase emulator (localhost:5001)
- **Frontend**: Vite dev server (localhost:5173)
- **Supabase Studio**: localhost:54323
- **Supabase API**: localhost:54321

### Production Environment

- **Database**: Production Supabase instance
- **API**: Firebase Cloud Functions
- **Frontend**: Firebase Hosting
- **Auth**: Production Supabase Auth

## 🔧 Environment Variables

The system automatically manages these files:

### Root Directory

- `.env.development` - Development environment variables
- `.env.production` - Production environment variables
- `.env` - Current active environment (auto-generated)

### Functions Directory

- `functions/.env.development` - Development function variables
- `functions/.env.production` - Production function variables
- `functions/.env` - Current active function environment (auto-generated)

## 💰 Cost Optimization Features

1. **No Supabase Branches**: Uses local emulators instead of paid preview branches
2. **Quick Environment Switching**: Instantly switch between dev and prod
3. **Automated Cleanup**: Stops services when not needed
4. **Smart Resource Management**: Only starts necessary services

## 🛠️ Manual Operations

If you need manual control:

### Switch Environments Manually

```bash
# Development
./scripts/env-manager.sh dev

# Production  
./scripts/env-manager.sh prod

# Check current environment
./scripts/env-manager.sh status
```

### Start Services Individually

```bash
# Start Supabase emulator
supabase start

# Start Firebase emulators
firebase emulators:start --only functions,hosting

# Start frontend dev server
pnpm run dev
```

### Database Operations

```bash
# Development database setup
cd functions
pnpm run dev:setup

# Production database deployment
cd functions
pnpm run prod:setup

# Database studio (development)
cd functions
pnpm run db:studio
```

## 🐛 Troubleshooting
