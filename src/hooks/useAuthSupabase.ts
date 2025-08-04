import { AuthChangeEvent, AuthError, Session, User } from '@supabase/supabase-js';
import { useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authApi } from '../api/authApi';
import { supabase } from '../lib/supabase';
import {
  authCustomerState,
  authInitializedState,
  authLoadingState,
  authState,
  authSupplierState,
  authUserState,
} from '../store/authAtoms';
import { notificationState } from '../store/snackbar';
import { AuthUser } from '../types/auth';

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  nombre?: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Recoil state
  const [auth, setAuth] = useRecoilState(authState);
  const [user, setUser] = useRecoilState(authUserState);
  const [customer, setCustomer] = useRecoilState(authCustomerState);
  const [supplier, setSupplier] = useRecoilState(authSupplierState);
  const [isInitialized, setIsInitialized] = useRecoilState(authInitializedState);
  const [isLoading, setIsLoading] = useRecoilState(authLoadingState);
  const [notification, setNotification] = useRecoilState(notificationState);

  // Load user profile from database
  const loadUserProfile = useCallback(
    async (supabaseUser: User) => {
      try {
        setIsLoading(true);

        // Get user data from database using email
        const userResponse = await authApi.getCurrentUser(parseInt(supabaseUser.id) || 0);

        if (userResponse) {
          const authUser: AuthUser = {
            ...userResponse,
            isLoggedIn: true,
          };

          setUser(authUser);

          // Load customer profile if exists
          const customerProfile = await authApi.getCustomerProfile(authUser.idUsuario);
          if (customerProfile) {
            setCustomer(customerProfile);
          }

          // Load supplier profile if exists
          const supplierProfile = await authApi.getSupplierProfile(authUser.idUsuario);
          if (supplierProfile) {
            setSupplier(supplierProfile);
          }

          // Update auth state
          setAuth({
            user: authUser,
            customer: customerProfile,
            supplier: supplierProfile,
            isInitialized: true,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setNotification({
          open: true,
          message: 'Error loading user profile',
          severity: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setAuth, setUser, setCustomer, setSupplier, setIsLoading, setNotification],
  );

  // Clear auth state
  const clearAuthState = useCallback(() => {
    setUser(null);
    setCustomer(null);
    setSupplier(null);
    setAuth({
      user: null,
      customer: null,
      supplier: null,
      isInitialized: true,
      isLoading: false,
    });
    queryClient.clear();
  }, [setAuth, setUser, setCustomer, setSupplier, queryClient]);

  // Initialize auth
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          await loadUserProfile(session.user);
        } else {
          setIsInitialized(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (!mounted) return;

      console.log('Auth state changed:', event, session);

      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        clearAuthState();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserProfile, clearAuthState, setIsInitialized, setIsLoading]);

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: SignInCredentials) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      setNotification({
        open: true,
        message: 'Successfully signed in!',
        severity: 'success',
      });
    },
    onError: (error: AuthError) => {
      console.error('Sign in error:', error);
      setNotification({
        open: true,
        message: error.message || 'Failed to sign in',
        severity: 'error',
      });
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: async ({ email, password, nombre }: SignUpData) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre: nombre,
          },
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setNotification({
        open: true,
        message: 'Check your email to confirm your account!',
        severity: 'success',
      });
    },
    onError: (error: AuthError) => {
      console.error('Sign up error:', error);
      setNotification({
        open: true,
        message: error.message || 'Failed to sign up',
        severity: 'error',
      });
    },
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      clearAuthState();
      navigate('/');
      setNotification({
        open: true,
        message: 'Successfully signed out!',
        severity: 'success',
      });
    },
    onError: (error: AuthError) => {
      console.error('Sign out error:', error);
      setNotification({
        open: true,
        message: error.message || 'Failed to sign out',
        severity: 'error',
      });
    },
  });

  // Helper functions
  const isCustomer = useCallback(() => !!customer, [customer]);
  const isSupplier = useCallback(() => !!supplier, [supplier]);
  const isAuthenticated = useCallback(() => !!user?.isLoggedIn, [user]);

  const getUserRole = useCallback(() => {
    if (isCustomer()) return 'customer';
    if (isSupplier()) return 'supplier';
    return 'user';
  }, [isCustomer, isSupplier]);

  const getCurrentUser = useCallback(() => user, [user]);
  const getCurrentCustomer = useCallback(() => customer, [customer]);
  const getCurrentSupplier = useCallback(() => supplier, [supplier]);

  // Sign in wrapper
  const signIn = useCallback(
    (credentials: SignInCredentials) => {
      return signInMutation.mutate(credentials);
    },
    [signInMutation],
  );

  // Sign up wrapper
  const signUp = useCallback(
    (data: SignUpData) => {
      return signUpMutation.mutate(data);
    },
    [signUpMutation],
  );

  // Sign out wrapper
  const signOut = useCallback(() => {
    return signOutMutation.mutate();
  }, [signOutMutation]);

  return {
    // Auth state
    user,
    customer,
    supplier,
    isInitialized,
    isLoading:
      isLoading ||
      signInMutation.isLoading ||
      signUpMutation.isLoading ||
      signOutMutation.isLoading,

    // Auth actions
    signIn,
    signUp,
    signOut,

    // Helper functions
    isAuthenticated,
    isCustomer,
    isSupplier,
    getUserRole,
    getCurrentUser,
    getCurrentCustomer,
    getCurrentSupplier,

    // Mutation states
    signInError: signInMutation.error,
    signUpError: signUpMutation.error,
    signOutError: signOutMutation.error,

    // Loading states
    isSigningIn: signInMutation.isLoading,
    isSigningUp: signUpMutation.isLoading,
    isSigningOut: signOutMutation.isLoading,
  };
};
