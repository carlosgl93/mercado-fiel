# Supabase Authentication Integration Guide

## Overview

This document explains how to integrate the new Supabase-based authentication system (`useAuthSupabase`) to replace the existing Firebase Auth system.

## Files Created

### 1. `/src/types/auth.ts`

Contains TypeScript interfaces for authentication:

- `AuthUser`: Base user interface
- `AuthCustomer`: Customer-specific user interface
- `AuthSupplier`: Supplier-specific user interface  
- `AuthState`: Complete authentication state

### 2. `/src/store/authAtoms.ts`

Recoil atoms for managing authentication state:

- `authState`: Main auth state atom
- `authUserState`: User data atom
- `authCustomerState`: Customer profile atom
- `authSupplierState`: Supplier profile atom
- `authInitializedState`: Initialization status atom
- `authLoadingState`: Loading state atom

### 3. `/src/api/authApi.ts`

API client wrapper for authentication-related API calls:

- `getCurrentUser()`: Get user by ID
- `getCustomerProfile()`: Get customer profile by user ID
- `getSupplierProfile()`: Get supplier profile by user ID
- `updateUser()`: Update user data

### 4. `/src/hooks/useAuthSupabase.ts`

Main authentication hook with Supabase integration:

- Session management
- User profile loading
- Sign in/up/out functionality
- Role detection (customer/supplier)
- Real-time auth state updates

## Integration Steps

### Step 1: Update Environment Variables

Ensure these environment variables are set in your `.env` files:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 2: Replace Firebase Auth Hook

Replace imports of the old `useAuth` hook:

```typescript
// Old
import { useAuth } from '../hooks/useAuth';

// New
import { useAuth } from '../hooks/useAuthSupabase';
```

### Step 3: Update Components

The new hook maintains the same interface as the old one, so most components should work without changes:

```typescript
const {
  user,
  customer,
  supplier,
  isAuthenticated,
  isLoading,
  signIn,
  signUp,
  signOut,
  getUserRole,
  isCustomer,
  isSupplier
} = useAuth();
```

### Step 4: API Endpoints Required

Ensure your backend API has these endpoints:

- `GET /users/:id` - Get user by ID
- `GET /customers/by-user/:userId` - Get customer profile by user ID
- `GET /suppliers/by-user/:userId` - Get supplier profile by user ID
- `PUT /users/:id` - Update user data

### Step 5: Database Setup

Configure Supabase Auth to work with your existing database:

1. Set up Supabase Auth policies
2. Create triggers to sync user creation with your database
3. Configure RLS (Row Level Security) policies

## Key Features

### Automatic Profile Loading

When a user signs in, the hook automatically:

1. Loads the user profile from your database
2. Checks for customer profile
3. Checks for supplier profile
4. Updates all Recoil state atoms

### Role Detection

```typescript
const { getUserRole, isCustomer, isSupplier } = useAuth();

// Check user role
const role = getUserRole(); // 'customer', 'supplier', or 'user'

// Check specific roles
if (isCustomer()) {
  // Customer-specific logic
}

if (isSupplier()) {
  // Supplier-specific logic
}
```

### Real-time Updates

The hook listens to Supabase auth state changes and automatically updates the application state when users sign in or out.

### Error Handling

All authentication operations show user-friendly notifications via the existing snackbar system.

## Migration Checklist

- [ ] Environment variables configured
- [ ] API endpoints implemented
- [ ] Supabase Auth policies configured
- [ ] Database triggers for user sync
- [ ] Import statements updated in components
- [ ] Test sign in/up/out flows
- [ ] Test role detection
- [ ] Test profile loading
- [ ] Test error handling
- [ ] Test real-time state updates

## Notes

1. The existing Supabase client (`/src/lib/supabase.ts`) is used for authentication
2. The hook uses the existing notification system (`/src/store/snackbar`)
3. Compatible with react-query v3 (current project version)
4. Maintains the same interface as the original Firebase Auth hook for easy migration
5. Uses Recoil for state management (consistent with existing architecture)

## Testing

Test the authentication flow:

1. Sign up with new email
2. Verify email confirmation
3. Sign in with credentials
4. Check profile loading
5. Test role detection
6. Sign out and verify state cleanup
7. Test error scenarios (wrong credentials, network errors)
