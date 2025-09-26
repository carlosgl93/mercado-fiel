import { AuthChangeEvent, AuthError, Session, User } from '@supabase/supabase-js';
import { useCallback, useEffect } from 'react';
import { CancelledError, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authApi } from '../api/authApi';
import { usersApi } from '../api/users';
import { supabase } from '../lib/supabase';
import { AuthSyncService } from '../services/AuthSyncService';
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
  nombre: string;
  type: 'customer' | 'supplier';
  // Customer specific
  telefono?: string;
  // Supplier specific
  nombre_negocio?: string;
  descripcion?: string;
  telefono_contacto?: string;
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

  // Load user profile from database with proper sync
  const loadUserProfile = useCallback(
    async (supabaseUser: User) => {
      try {
        setIsLoading(true);

        // Get complete user data from database using email
        const userResponse = await authApi.getCurrentUser(supabaseUser.email || '');

        if (userResponse) {
          // The API response structure matches the AuthUser type you provided
          const authUser: AuthUser = {
            success: userResponse.success,
            data: {
              ...userResponse.data,
              isLoggedIn: true,
            },
            isLoggedIn: true,
          };

          setUser(authUser);

          // Set customer and supplier based on the data in the response
          let customerData = null;
          let supplierData = null;

          if (authUser.data.cliente) {
            customerData = {
              ...authUser.data,
              idCliente: authUser.data.cliente.idCliente,
              telefono: authUser.data.cliente.telefono || undefined,
              idDireccion: authUser.data.cliente.idDireccion || undefined,
              isLoggedIn: true,
            };
            setCustomer(customerData);
          }

          if (authUser.data.proveedor) {
            supplierData = {
              ...authUser.data,
              idProveedor: authUser.data.proveedor.idProveedor,
              nombreNegocio: authUser.data.proveedor.nombreNegocio,
              descripcion: authUser.data.proveedor.descripcion,
              telefonoContacto: authUser.data.proveedor.telefonoContacto,
              idDireccion: authUser.data.proveedor.idDireccion || undefined,
              latitud: authUser.data.proveedor.latitud,
              longitud: authUser.data.proveedor.longitud,
              destacado: authUser.data.proveedor.destacado,
              emailNegocio: authUser.data.proveedor.email,
              radioEntregaKm: authUser.data.proveedor.radioEntregaKm,
              cobraEnvio: authUser.data.proveedor.cobraEnvio,
              envioGratisDesde: authUser.data.proveedor.envioGratisDesde,
              isLoggedIn: true,
            };
            setSupplier(supplierData);
          }

          // Update auth state
          setAuth({
            user: authUser,
            customer: customerData,
            supplier: supplierData,
            isInitialized: true,
            isLoading: false,
          });

          // After successful profile load, sync authentication to ensure proper RLS context
          await AuthSyncService.syncAuthentication(supabaseUser);
        } else {
          console.log('User not found in database, creating basic profile...');
          // User exists in Supabase but not in database - create basic profile
          const syncedProfile = await AuthSyncService.syncAuthentication(supabaseUser);
          if (syncedProfile) {
            console.log('Basic profile created, reloading...');
            // Retry loading the profile after creation
            const retryResponse = await authApi.getCurrentUser(supabaseUser.email || '');
            if (retryResponse) {
              // Recursive call to load the newly created profile
              await loadUserProfile(supabaseUser);
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setNotification({
          open: true,
          message: 'Error al cargar el perfil del usuario',
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
          console.log('Initializing auth with session:', session.user.email);
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

      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing auth state');
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
        message: '¡Iniciaste sesión exitosamente!',
        severity: 'success',
      });
    },
    onError: (error: AuthError) => {
      console.error('Sign in error:', { error });
      let message = 'Error al iniciar sesión';

      if (error.message.includes('Invalid login credentials')) {
        message = 'Credenciales inválidas';
      } else if (error.message.includes('Email not confirmed')) {
        message = 'Por favor confirma tu email';
      }

      setNotification({
        open: true,
        message,
        severity: 'error',
      });
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: async ({ email, password, nombre, type, ...extraData }: SignUpData) => {
      console.log('Starting signup process for:', email, type);

      // Determine redirect URL based on environment
      const isProduction = import.meta.env.VITE_ENV === 'prod';
      const redirectUrl = isProduction
        ? 'https://mercadofiel.cl/auth/callback'
        : `${window.location.origin}/auth/callback`;

      // First, create Supabase user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nombre,
            user_type: type,
          },
        },
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        throw authError;
      }

      console.log('Supabase user created successfully:', authData.user?.email);

      // Then create user in our database via API
      try {
        let apiResponse;
        if (type === 'customer') {
          console.log('Creating customer in database...');
          apiResponse = await authApi.createCustomer({
            email: email.toLowerCase(),
            nombre,
            telefono: extraData.telefono,
          });
          console.log('Customer created in database:', apiResponse);
        } else if (type === 'supplier') {
          console.log('Creating supplier in database...');
          apiResponse = await authApi.createSupplier({
            email: email.toLowerCase(),
            nombre,
            nombre_negocio: extraData.nombre_negocio || nombre,
            descripcion: extraData.descripcion || '',
            telefono_contacto: extraData.telefono_contacto,
          });
          console.log('Supplier created in database:', apiResponse);
        }

        // After successful database creation, sync authentication for RLS
        if (authData.user) {
          console.log('Syncing authentication for RLS...');
          await AuthSyncService.syncAuthentication(authData.user);
        }

        // Navigate after everything is set up
        if (type === 'customer') {
          navigate('/usuario-dashboard');
        } else if (type === 'supplier') {
          navigate('/proveedor-dashboard');
        }
      } catch (dbError) {
        console.error('Database creation error:', dbError);
        setNotification({
          open: true,
          message: 'Error al crear el perfil en la base de datos',
          severity: 'error',
        });
        throw dbError; // Re-throw to trigger onError
      }

      return authData;
    },
    onSuccess: () => {
      setNotification({
        open: true,
        message: '¡Cuenta creada exitosamente!',
        severity: 'success',
      });
    },
    onError: (error: AuthError) => {
      console.error('Sign up error:', error);
      let message = 'Error al crear la cuenta';

      if (error.message.includes('User already registered')) {
        message = 'El email ya está registrado';
      } else if (error.message.includes('Password should be')) {
        message = 'La contraseña debe tener al menos 6 caracteres';
      } else if (error.message.includes('Invalid email')) {
        message = 'Email inválido';
      } else if (error.message.includes('weak password')) {
        message = 'La contraseña es muy débil';
      }

      setNotification({
        open: true,
        message,
        severity: 'error',
      });
    },
  });

  // Password reset mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      console.log('Starting password reset process for:', email);

      // Determine redirect URL based on environment
      const isProduction = import.meta.env.VITE_ENV === 'prod';
      const redirectUrl = isProduction
        ? 'https://mercadofiel.cl/cambiar-contrasena'
        : `${window.location.origin}/cambiar-contrasena`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }

      console.log('Password reset email sent successfully');
    },
    onSuccess: () => {
      setNotification({
        open: true,
        message: 'Se ha enviado un enlace para restablecer tu contraseña a tu email',
        severity: 'success',
      });
    },
    onError: (error: AuthError) => {
      console.error('Password reset error:', error);
      let message = 'Error al enviar el email de recuperación';

      if (error.message.includes('Email not found')) {
        message = 'No existe una cuenta con ese email';
      } else if (error.message.includes('rate limit')) {
        message = 'Has solicitado muchos resets. Intenta nuevamente en unos minutos.';
      }

      setNotification({
        open: true,
        message,
        severity: 'error',
      });
    },
  });

  // Update user mutation (for email updates)
  const updateUserMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      console.log('Starting user email update process...');

      // Determine redirect URL based on environment
      const isProduction = import.meta.env.VITE_ENV === 'prod';
      const redirectUrl = isProduction
        ? 'https://mercadofiel.cl/auth/callback'
        : `${window.location.origin}/auth/callback`;

      // First, update Supabase Auth email
      const { data, error } = await supabase.auth.updateUser({
        email: email.toLowerCase(),
      });

      if (error) {
        console.error('Supabase auth email update error:', error);
        throw error;
      }

      console.log('Supabase auth email updated successfully');

      // After successful auth update, update the user profile in database
      if (user?.data?.idUsuario) {
        try {
          console.log('Updating user profile in database...');
          const updatedUser = await usersApi.updateProfile(user.data.idUsuario, {
            email: email.toLowerCase(),
          });

          console.log('User profile updated in database successfully');

          // Reload user profile to get updated data
          if (data.user) {
            await loadUserProfile(data.user);
          }

          return { authData: data, userProfile: updatedUser };
        } catch (dbError) {
          console.error('Database user update error:', dbError);
          throw new Error(
            'Email de autenticación actualizado pero falló la actualización del perfil. Contacta soporte técnico.',
          );
        }
      }

      return { authData: data, userProfile: null };
    },
    onSuccess: (result) => {
      setNotification({
        open: true,
        message: 'Email actualizado exitosamente. Por favor verifica tu nuevo email.',
        severity: 'success',
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries(['user']);
      queryClient.invalidateQueries(['supplier']);
      queryClient.invalidateQueries(['customer']);
    },
    onError: (error: AuthError | Error) => {
      console.error('Update user error:', error);
      let message = 'Error al actualizar el email';

      if (error.message) {
        if (
          error.message.includes('User already registered') ||
          error.message.includes('already been registered')
        ) {
          message =
            'Este email ya está registrado con otra cuenta. Por favor usa un email diferente.';
        } else if (error.message.includes('rate limit') || error.message.includes('too many')) {
          message =
            'Se han enviado demasiados emails. Por favor espera un momento e intenta de nuevo.';
        } else if (error.message.includes('invalid') && error.message.includes('email')) {
          message = 'El formato del email no es válido.';
        } else if (error.message.includes('same')) {
          message = 'El nuevo email debe ser diferente al actual.';
        } else if (error.message.includes('Email de autenticación actualizado pero falló')) {
          message = error.message; // Use the specific message we threw
        }
      }

      setNotification({
        open: true,
        message,
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
      console.log('signed out');
      clearAuthState();
      navigate('/');
      setNotification({
        open: true,
        message: '¡Cerraste sesión exitosamente!',
        severity: 'success',
      });
    },
    onMutate: () => {
      console.log('sgining  out');
    },
    onError: (error: AuthError | CancelledError) => {
      console.log('signed out');

      // Don't show error for cancellation - this happens during navigation
      const isCancelledError =
        'revert' in error ||
        'silent' in error ||
        (error as any)?.name === 'CancelledError2' ||
        (error as any)?.name === 'CancelledError';

      if (isCancelledError) {
        return;
      }
      console.error('Sign out error:', error);
      setNotification({
        open: true,
        message: (error as AuthError).message || 'Error al cerrar sesión',
        severity: 'error',
      });
    },
  });

  // Helper functions
  const isCustomer = useCallback(() => !!customer, [customer]);
  const isSupplier = useCallback(() => !!supplier, [supplier]);
  const isAuthenticated = useCallback(() => !!user?.data?.isLoggedIn, [user]);

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
    console.log('sign in out');
    signOutMutation.mutate();
  }, [signOutMutation]);

  // Update user wrapper (for email updates)
  const updateUser = useCallback(
    (userData: { email: string }) => {
      return updateUserMutation.mutate(userData);
    },
    [updateUserMutation],
  );

  // Reset password wrapper
  const resetPassword = useCallback(
    (email: string) => {
      return resetPasswordMutation.mutate({ email });
    },
    [resetPasswordMutation],
  );

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
      signOutMutation.isLoading ||
      updateUserMutation.isLoading ||
      resetPasswordMutation.isLoading,

    // Auth actions
    signIn,
    signUp,
    signOut,
    updateUser,
    resetPassword,

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
    updateUserError: updateUserMutation.error,
    resetPasswordError: resetPasswordMutation.error,

    // Loading states
    isSigningIn: signInMutation.isLoading,
    isSigningUp: signUpMutation.isLoading,
    isSigningOut: signOutMutation.isLoading,
    isUpdatingUser: updateUserMutation.isLoading,
    isResettingPassword: resetPasswordMutation.isLoading,
  };
};
