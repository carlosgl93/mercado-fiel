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

# Function to verify project structure
verify_project_structure() {
    print_status "Verifying project structure..."
    
    # Check if functions directory exists
    if [ ! -d "$FUNCTIONS_DIR" ]; then
        print_error "Functions directory not found: $FUNCTIONS_DIR"
        print_error "Please ensure you're running this from the project root"
        return 1
    fi
    
    # Check if functions has package.json
    if [ ! -f "$FUNCTIONS_DIR/package.json" ]; then
        print_warning "Functions package.json not found"
        print_warning "Functions environment setup may not work correctly"
    fi
    
    # Check if Supabase directory exists
    if [ ! -d "$SUPABASE_DIR" ]; then
        print_warning "Supabase directory not found: $SUPABASE_DIR"
        print_warning "Supabase configuration may not be available"
    fi
    
    print_success "Project structure verification completed"
}

# Function to load secrets from secure sources
load_secrets() {
    # Try to load from .env.secrets file (not tracked in git)
    if [ -f "$PROJECT_ROOT/.env.secrets" ]; then
        source "$PROJECT_ROOT/.env.secrets"
        print_success "Loaded secrets from .env.secrets file"
        return 0
    fi
    
    print_error "Missing .env.secrets file!"
    print_error "Please create $PROJECT_ROOT/.env.secrets with the following variables:"
    echo ""
    echo "# Development secrets (Supabase emulator defaults)"
    echo "DEV_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
    echo "DEV_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
    echo ""
    echo "# Production secrets (get from Supabase dashboard)"
    echo "PROD_SUPABASE_URL=https://your-project.supabase.co"
    echo "PROD_SUPABASE_ANON_KEY=your_anon_key_here"
    echo "PROD_SUPABASE_SERVICE_KEY=your_service_role_key_here"
    echo "PROD_DATABASE_URL=your_production_database_url_here"
    echo "PROD_DIRECT_URL=your_production_direct_url_here"
    echo ""
    echo "# Firebase configuration (get from Firebase console)"
    echo "FIREBASE_API_KEY=your_firebase_api_key_here"
    echo "FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com"
    echo "FIREBASE_PROJECT_ID=your-project-id"
    echo "FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app"
    echo "FIREBASE_MESSAGING_SENDER_ID=your_sender_id"
    echo "FIREBASE_APP_ID=your_app_id"
    echo "FIREBASE_MEASUREMENT_ID=your_measurement_id"
    echo ""
    return 1
}

# Function to create environment templates
create_env_templates() {
    print_status "Creating environment template files..."
    
    # Create .env.template
    cat > "$PROJECT_ROOT/.env.template" << 'EOF'
# Environment template - copy this to .env and fill in the values
# DO NOT commit .env files with real secrets to git!

NODE_ENV=
VITE_ENV=

# Supabase Configuration
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# Database URLs
DATABASE_URL=
DIRECT_URL=

# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# API Base URL
VITE_API_BASE_URL=
EOF

    # Create .env.secrets.template
    cat > "$PROJECT_ROOT/.env.secrets.template" << 'EOF'
# Secrets template - copy this to .env.secrets and fill in the real values
# DO NOT commit .env.secrets to git! (it should be in .gitignore)

# Development secrets (Supabase emulator defaults - safe to use)
DEV_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
DEV_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# Production secrets (get from Supabase dashboard)
PROD_SUPABASE_URL=
PROD_SUPABASE_ANON_KEY=
PROD_SUPABASE_SERVICE_KEY=
PROD_DATABASE_URL=
PROD_DIRECT_URL=

# Firebase configuration (get from Firebase console)
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
EOF

    print_success "Template files created successfully"
    print_warning "Please copy .env.secrets.template to .env.secrets and fill in the real values"
}

# Function to create environment files from templates
create_env_files() {
    print_status "Creating environment configuration files..."
    
    # Load secrets first
    if ! load_secrets; then
        return 1
    fi
    
    # Create .env.development
    cat > "$PROJECT_ROOT/.env.development" << EOF
# Development Environment (Local Emulators)
NODE_ENV=development
VITE_ENV=development

# Supabase Emulator URLs (matches your config.toml)
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=${DEV_SUPABASE_ANON_KEY}
SUPABASE_SERVICE_KEY=${DEV_SUPABASE_SERVICE_KEY}

# Database URLs (Emulator - matches your port 54322)
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Firebase Configuration
VITE_FIREBASE_API_KEY=${FIREBASE_API_KEY}
VITE_FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
VITE_FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
VITE_FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
VITE_FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID}
VITE_FIREBASE_APP_ID=${FIREBASE_APP_ID}
VITE_FIREBASE_MEASUREMENT_ID=${FIREBASE_MEASUREMENT_ID}

# API Base URL (Local Firebase Emulator)
VITE_API_BASE_URL=http://127.0.0.1:5001/${FIREBASE_PROJECT_ID}/southamerica-west1/api
EOF

    # Create .env.production
    cat > "$PROJECT_ROOT/.env.production" << EOF
# Production Environment
NODE_ENV=production
VITE_ENV=production

# Supabase Production URLs
VITE_SUPABASE_URL=${PROD_SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${PROD_SUPABASE_ANON_KEY}
SUPABASE_SERVICE_KEY=${PROD_SUPABASE_SERVICE_KEY}

# Database URLs (Production)
DATABASE_URL="${PROD_DATABASE_URL}"
DIRECT_URL="${PROD_DIRECT_URL}"

# Firebase Configuration
VITE_FIREBASE_API_KEY=${FIREBASE_API_KEY}
VITE_FIREBASE_AUTH_DOMAIN=${FIREBASE_AUTH_DOMAIN}
VITE_FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
VITE_FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}
VITE_FIREBASE_MESSAGING_SENDER_ID=${FIREBASE_MESSAGING_SENDER_ID}
VITE_FIREBASE_APP_ID=${FIREBASE_APP_ID}
VITE_FIREBASE_MEASUREMENT_ID=${FIREBASE_MEASUREMENT_ID}

# API Base URL (Production)
VITE_API_BASE_URL=https://southamerica-west1-${FIREBASE_PROJECT_ID}.cloudfunctions.net/api
EOF

    # Create functions environment files
    if [ -d "$FUNCTIONS_DIR" ]; then
        cp "$PROJECT_ROOT/.env.development" "$FUNCTIONS_DIR/.env.development"
        cp "$PROJECT_ROOT/.env.production" "$FUNCTIONS_DIR/.env.production"
        print_success "Functions environment files created successfully"
    else
        print_warning "Functions directory not found: $FUNCTIONS_DIR"
        print_warning "Functions environment files will be created when switching environments"
    fi
    
    print_success "Environment files created successfully"
}

# Function to switch to development environment
switch_to_dev() {
    print_status "Switching to DEVELOPMENT environment..."
    
    # Ensure environment files exist, create them if not
    if [ ! -f "$PROJECT_ROOT/.env.development" ]; then
        print_warning "Development environment files not found. Creating them..."
        if ! create_env_files; then
            print_error "Failed to create environment files"
            return 1
        fi
    fi
    
    # Copy development env files to root
    cp "$PROJECT_ROOT/.env.development" "$PROJECT_ROOT/.env"
    print_success "Updated root .env file for DEVELOPMENT"
    
    # Copy development env files to functions folder
    if [ -d "$FUNCTIONS_DIR" ]; then
        cp "$PROJECT_ROOT/.env.development" "$FUNCTIONS_DIR/.env"
        print_success "Updated functions .env file for DEVELOPMENT"
    else
        print_warning "Functions directory not found: $FUNCTIONS_DIR"
    fi
    
    print_success "Switched to DEVELOPMENT environment"
    print_status "Environment configuration:"
    print_status "  - Database: Local Supabase Emulator (http://127.0.0.1:54321)"
    print_status "  - API: Local Firebase Emulator"
    print_warning "Remember to start Supabase emulators: npm run dev:start"
}

# Function to switch to production environment
switch_to_prod() {
    print_status "Switching to PRODUCTION environment..."
    
    # Ensure environment files exist, create them if not
    if [ ! -f "$PROJECT_ROOT/.env.production" ]; then
        print_warning "Production environment files not found. Creating them..."
        if ! create_env_files; then
            print_error "Failed to create environment files"
            return 1
        fi
    fi
    
    # Copy production env files to root
    cp "$PROJECT_ROOT/.env.production" "$PROJECT_ROOT/.env"
    print_success "Updated root .env file for PRODUCTION"
    
    # Copy production env files to functions folder
    if [ -d "$FUNCTIONS_DIR" ]; then
        cp "$PROJECT_ROOT/.env.production" "$FUNCTIONS_DIR/.env"
        print_success "Updated functions .env file for PRODUCTION"
    else
        print_warning "Functions directory not found: $FUNCTIONS_DIR"
    fi
    
    print_success "Switched to PRODUCTION environment"
    print_status "Environment configuration:"
    print_status "  - Database: Production Supabase"
    print_status "  - API: Production Firebase Functions"
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
    print_status "API URL: https://southamerica-west1-mercado-fiel.cloudfunctions.net/api"
}

# Function to show current environment
show_env() {
    print_status "Environment Status:"
    echo ""
    
    # Check root environment
    if [ -f "$PROJECT_ROOT/.env" ]; then
        local env_type=$(grep "VITE_ENV=" "$PROJECT_ROOT/.env" | cut -d'=' -f2)
        print_success "Root environment: $env_type"
        
        if [ "$env_type" = "development" ]; then
            print_status "  Database: Local Supabase Emulator (http://127.0.0.1:54321)"
            print_status "  Functions: Local Firebase Emulator"
        else
            print_status "  Database: Production Supabase"
            print_status "  Functions: Production Firebase"
        fi
    else
        print_error "No root .env file found"
    fi
    
    echo ""
    
    # Check functions environment
    if [ -f "$FUNCTIONS_DIR/.env" ]; then
        local functions_env_type=$(grep "VITE_ENV=" "$FUNCTIONS_DIR/.env" | cut -d'=' -f2 2>/dev/null || echo "unknown")
        print_success "Functions environment: $functions_env_type"
    else
        print_error "No functions .env file found"
    fi
    
    echo ""
    
    # Check if environments are in sync
    if [ -f "$PROJECT_ROOT/.env" ] && [ -f "$FUNCTIONS_DIR/.env" ]; then
        local root_env=$(grep "VITE_ENV=" "$PROJECT_ROOT/.env" | cut -d'=' -f2)
        local functions_env=$(grep "VITE_ENV=" "$FUNCTIONS_DIR/.env" | cut -d'=' -f2 2>/dev/null || echo "missing")
        
        if [ "$root_env" = "$functions_env" ]; then
            print_success "Environments are synchronized"
        else
            print_error "Environments are NOT synchronized!"
            print_error "Root: $root_env, Functions: $functions_env"
            print_warning "Run './scripts/env-manager.sh dev' or './scripts/env-manager.sh prod' to synchronize"
        fi
    else
        print_warning "Cannot verify environment synchronization - missing files"
        print_status "Run './scripts/env-manager.sh create-env' to create missing files"
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
        verify_project_structure
        create_env_templates
        print_success "Setup completed! Follow these steps:"
        echo ""
        print_status "1. Copy the secrets template:"
        print_status "   cp .env.secrets.template .env.secrets"
        echo ""
        print_status "2. Edit .env.secrets with your real values:"
        print_status "   - Development keys (emulator defaults are provided)"
        print_status "   - Production keys (get from Supabase/Firebase dashboards)"
        echo ""
        print_status "3. Then run:"
        print_status "   ./scripts/env-manager.sh create-env  - Create environment files"
        print_status "   ./scripts/env-manager.sh dev         - Switch to development"
        print_status "   ./scripts/env-manager.sh start       - Start development environment"
        echo ""
        print_status "Or use npm scripts:"
        print_status "   pnpm run env:setup     - Initial setup"
        print_status "   pnpm run env:dev       - Switch to development"
        print_status "   pnpm run dev           - Start development with proper env"
        print_status "   pnpm run dev:setup     - Create env files and start development"
        ;;
    "create-env")
        verify_project_structure
        create_env_files
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
        echo "Usage: $0 {setup|create-env|dev|prod|start|deploy|status|clean}"
        echo ""
        echo "Commands:"
        echo "  setup       - Initial setup of template files and project verification"
        echo "  create-env  - Create environment files from templates (after filling secrets)"
        echo "  dev         - Switch to development environment (root + functions)"
        echo "  prod        - Switch to production environment (root + functions)"
        echo "  start       - Start complete development environment"
        echo "  deploy      - Deploy to production"
        echo "  status      - Show current environment status and synchronization"
        echo "  clean       - Clean up build artifacts and stop services"
        echo ""
        echo "NPM Scripts (recommended):"
        echo "  pnpm run env:setup     - Initial setup"
        echo "  pnpm run env:dev       - Switch to development"
        echo "  pnpm run env:prod      - Switch to production"
        echo "  pnpm run env:status    - Check environment status"
        echo "  pnpm run dev           - Start development with proper env setup"
        echo "  pnpm run dev:setup     - Create env files and start development"
        echo "  pnpm run dev:start     - Start complete development environment"
        exit 1
        ;;
esac