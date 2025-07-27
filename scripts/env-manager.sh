#!/bin/bash
# scripts/env-manager.sh - Main environment management script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project paths
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FUNCTIONS_DIR="$PROJECT_ROOT/functions"
SUPABASE_DIR="$PROJECT_ROOT/supabase"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if required commands exist
check_dependencies() {
    local deps=("firebase" "supabase" "node" "npm")
    for dep in "${deps[@]}"; do
        if ! command -v $dep &> /dev/null; then
            print_error "$dep is not installed or not in PATH"
            exit 1
        fi
    done
}

# Function to create environment files
create_env_files() {
    print_status "Creating environment configuration files..."
    
    # Create .env.development
    cat > "$PROJECT_ROOT/.env.development" << 'EOF'
# Development Environment (Local Emulators)
NODE_ENV=development
VITE_ENV=development

# Supabase Emulator URLs (matches your config.toml)
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcmNhZG8tZmllbCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE5NTcxNDUyMDB9.8MOrnxzS5c4uJ_sfVviGL4n81ZU5iE28e1BYqXmIyJc

# Database URLs (Emulator - matches your port 54322)
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDD1grq2vgccgSGb9tniIBXCUV7VNp2R5g
VITE_FIREBASE_AUTH_DOMAIN=mercado-fiel.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mercado-fiel
VITE_FIREBASE_STORAGE_BUCKET=mercado-fiel.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=225186048658
VITE_FIREBASE_APP_ID=1:225186048658:web:416ecce4e11f594941d44b
VITE_FIREBASE_MEASUREMENT_ID=G-9SX3HPM2RF

# API Base URL (Local Firebase Emulator)
VITE_API_BASE_URL=http://127.0.0.1:5001/mercado-fiel/us-central1/api
EOF

    # Create .env.production
    cat > "$PROJECT_ROOT/.env.production" << 'EOF'
# Production Environment
NODE_ENV=production
VITE_ENV=production

# Supabase Production URLs
VITE_SUPABASE_URL=https://xnehuzmpesnelhdboijy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZWh1em1wZXNuZWxoZGJvaWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjM1ODMsImV4cCI6MjA2NjY5OTU4M30.Rop6RZzLMhcM31c1KT8MLYnouG4KqvhG_B8yZc7C9U8

# Database URLs (Production)
DATABASE_URL="postgresql://postgres.xnehuzmpesnelhdboijy:Magnolia2025!@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xnehuzmpesnelhdboijy:Magnolia2025!@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDD1grq2vgccgSGb9tniIBXCUV7VNp2R5g
VITE_FIREBASE_AUTH_DOMAIN=mercado-fiel.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mercado-fiel
VITE_FIREBASE_STORAGE_BUCKET=mercado-fiel.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=225186048658
VITE_FIREBASE_APP_ID=1:225186048658:web:416ecce4e11f594941d44b
VITE_FIREBASE_MEASUREMENT_ID=G-9SX3HPM2RF

# API Base URL (Production)
VITE_API_BASE_URL=https://us-central1-mercado-fiel.cloudfunctions.net/api
EOF

    # Create functions environment files
    cp "$PROJECT_ROOT/.env.development" "$FUNCTIONS_DIR/.env.development"
    cp "$PROJECT_ROOT/.env.production" "$FUNCTIONS_DIR/.env.production"
    
    print_success "Environment files created successfully"
}

# Function to switch to development environment
switch_to_dev() {
    print_status "Switching to DEVELOPMENT environment..."
    
    # Copy development env files
    cp "$PROJECT_ROOT/.env.development" "$PROJECT_ROOT/.env"
    cp "$FUNCTIONS_DIR/.env.development" "$FUNCTIONS_DIR/.env"
    
    print_success "Switched to DEVELOPMENT environment"
    print_warning "Remember to start Supabase emulators: npm run dev:start"
}

# Function to switch to production environment
switch_to_prod() {
    print_status "Switching to PRODUCTION environment..."
    
    # Copy production env files
    cp "$PROJECT_ROOT/.env.production" "$PROJECT_ROOT/.env"
    cp "$FUNCTIONS_DIR/.env.production" "$FUNCTIONS_DIR/.env"
    
    print_success "Switched to PRODUCTION environment"
    print_warning "Ready for deployment to production"
}

# Function to start development environment
start_dev() {
    print_status "Starting DEVELOPMENT environment..."
    
    switch_to_dev
    
    print_status "Starting Supabase emulators..."
    cd "$PROJECT_ROOT"
    supabase start &
    SUPABASE_PID=$!
    
    # Wait for Supabase to start
    sleep 15
    
    print_status "Building functions..."
    cd "$FUNCTIONS_DIR"
    npm run build
    
    print_status "Running database migrations..."
    npm run db:push
    
    print_status "Seeding database..."
    npm run db:seed
    
    print_status "Starting Firebase emulators..."
    cd "$PROJECT_ROOT"
    firebase emulators:start --only functions,hosting &
    FIREBASE_PID=$!
    
    print_success "Development environment is running!"
    print_status "Frontend: http://localhost:5173"
    print_status "Functions: http://localhost:5001"
    print_status "Supabase Studio: http://localhost:54323"
    print_status "Supabase API: http://localhost:54321"
    
    # Wait for user input to stop
    read -p "Press Enter to stop all services..."
    
    # Kill background processes
    kill $SUPABASE_PID $FIREBASE_PID 2>/dev/null || true
    cd "$PROJECT_ROOT"
    supabase stop
    
    print_success "Development environment stopped"
}

# Function to deploy to production
deploy_prod() {
    print_status "Deploying to PRODUCTION..."
    
    switch_to_prod
    
    print_status "Building project..."
    npm run build
    
    print_status "Building functions..."
    cd "$FUNCTIONS_DIR"
    npm run build
    
    print_status "Running production database migrations..."
    npm run db:deploy
    
    print_status "Deploying to Firebase..."
    cd "$PROJECT_ROOT"
    firebase deploy
    
    print_success "Successfully deployed to production!"
    print_status "Production URL: https://mercado-fiel.web.app"
    print_status "API URL: https://us-central1-mercado-fiel.cloudfunctions.net/api"
}

# Function to show current environment
show_env() {
    if [ -f "$PROJECT_ROOT/.env" ]; then
        local env_type=$(grep "VITE_ENV=" "$PROJECT_ROOT/.env" | cut -d'=' -f2)
        print_status "Current environment: $env_type"
        
        if [ "$env_type" = "development" ]; then
            print_status "Database: Local Supabase Emulator"
            print_status "Functions: Local Firebase Emulator"
        else
            print_status "Database: Production Supabase"
            print_status "Functions: Production Firebase"
        fi
    else
        print_warning "No environment file found. Run 'setup' first."
    fi
}

# Function to clean up
cleanup() {
    print_status "Cleaning up..."
    
    # Stop any running processes
    pkill -f "supabase" 2>/dev/null || true
    pkill -f "firebase" 2>/dev/null || true
    
    # Stop Supabase properly
    cd "$PROJECT_ROOT"
    supabase stop 2>/dev/null || true
    
    # Clean build artifacts
    rm -rf "$PROJECT_ROOT/dist"
    rm -rf "$FUNCTIONS_DIR/lib"
    rm -rf "$PROJECT_ROOT/node_modules/.cache"
    rm -rf "$FUNCTIONS_DIR/node_modules/.cache"
    
    print_success "Cleanup completed"
}

# Main script logic
case "$1" in
    "setup")
        check_dependencies
        create_env_files
        print_success "Setup completed! You can now use:"
        print_status "  ./scripts/env-manager.sh dev     - Switch to development"
        print_status "  ./scripts/env-manager.sh prod    - Switch to production"
        print_status "  ./scripts/env-manager.sh start   - Start development environment"
        print_status "  ./scripts/env-manager.sh deploy  - Deploy to production"
        ;;
    "dev")
        switch_to_dev
        ;;
    "prod")
        switch_to_prod
        ;;
    "start")
        start_dev
        ;;
    "deploy")
        deploy_prod
        ;;
    "status")
        show_env
        ;;
    "clean")
        cleanup
        ;;
    *)
        echo "Usage: $0 {setup|dev|prod|start|deploy|status|clean}"
        echo ""
        echo "Commands:"
        echo "  setup   - Initial setup of environment files"
        echo "  dev     - Switch to development environment"
        echo "  prod    - Switch to production environment"
        echo "  start   - Start complete development environment"
        echo "  deploy  - Deploy to production"
        echo "  status  - Show current environment"
        echo "  clean   - Clean up build artifacts and stop services"
        exit 1
        ;;
esac