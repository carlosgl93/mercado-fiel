#!/bin/bash
# scripts/verify-setup.sh - Verify that everything is configured correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

print_status "Verifying setup for Mercado Fiel environment management..."

# Check required commands
print_status "Checking dependencies..."
MISSING_DEPS=()

for cmd in firebase supabase node npm; do
    if ! command -v $cmd &> /dev/null; then
        MISSING_DEPS+=($cmd)
        print_error "$cmd is not installed"
    else
        print_success "$cmd is installed"
    fi
done

if [ ${#MISSING_DEPS[@]} -ne 0 ]; then
    print_error "Missing dependencies: ${MISSING_DEPS[*]}"
    print_status "Please install missing dependencies before continuing"
    exit 1
fi

# Check project structure
print_status "Checking project structure..."

REQUIRED_DIRS=("functions" "supabase" "src")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$PROJECT_ROOT/$dir" ]; then
        print_success "$dir/ directory exists"
    else
        print_error "$dir/ directory is missing"
        exit 1
    fi
done

# Check important files
print_status "Checking configuration files..."

REQUIRED_FILES=(
    "firebase.json"
    "supabase/config.toml"
    "functions/package.json"
    "package.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$PROJECT_ROOT/$file" ]; then
        print_success "$file exists"
    else
        print_error "$file is missing"
        exit 1
    fi
done

# Check if Firebase is logged in
print_status "Checking Firebase authentication..."
if firebase projects:list >/dev/null 2>&1; then
    print_success "Firebase CLI is authenticated"
else
    print_warning "Firebase CLI not authenticated. Run: firebase login"
fi

# Check if Supabase is linked
print_status "Checking Supabase configuration..."
cd "$PROJECT_ROOT"
if supabase status 2>/dev/null | grep -q "Local config"; then
    print_success "Supabase is configured"
else
    print_warning "Supabase might not be fully configured"
fi

# Check environment management script
print_status "Checking environment management script..."
if [ -f "$PROJECT_ROOT/scripts/env-manager.sh" ]; then
    if [ -x "$PROJECT_ROOT/scripts/env-manager.sh" ]; then
        print_success "Environment manager script is executable"
    else
        print_warning "Environment manager script needs execute permissions"
        chmod +x "$PROJECT_ROOT/scripts/env-manager.sh"
        print_success "Fixed permissions for environment manager script"
    fi
else
    print_error "Environment manager script is missing"
    exit 1
fi

print_success "Setup verification completed!"
print_status ""
print_status "Next steps:"
print_status "1. Run: npm run env:setup"
print_status "2. Run: npm run dev:start (for development)"
print_status "3. Run: npm run prod:deploy (for production deployment)"
print_status ""
print_status "Current Supabase configuration:"
print_status "- API Port: 54321"
print_status "- DB Port: 54322"  
print_status "- Studio Port: 54323"
print_status "- Database Version: PostgreSQL 17"