import { AuthChangeEvent, AuthError, Session, User } from '@supabase/supabase-js';
import { useCallback, useEffect } from 'react';
import { CancelledError, useMutation, useQueryClient } from 'react-query';
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

  // Load user profile from database
  const loadUserProfile = useCallback(
    async (supabaseUser: User) => {
      try {
        setIsLoading(true);
        // Get user data from database using email
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
              idCliente: authUser.data.cliente.id_cliente,
              telefono: authUser.data.cliente.telefono || undefined,
              idDireccion: authUser.data.cliente.id_direccion || undefined,
              isLoggedIn: true,
            };
            setCustomer(customerData);
          }

          if (authUser.data.proveedor) {
            supplierData = {
              ...authUser.data,
              idProveedor: authUser.data.proveedor.id_proveedor,
              nombreNegocio: authUser.data.proveedor.nombre_negocio,
              descripcion: authUser.data.proveedor.descripcion,
              telefonoContacto: authUser.data.proveedor.telefono_contacto,
              idDireccion: authUser.data.proveedor.id_direccion || undefined,
              latitud: authUser.data.proveedor.latitud,
              longitud: authUser.data.proveedor.longitud,
              destacado: authUser.data.proveedor.destacado,
              emailNegocio: authUser.data.proveedor.email,
              radioEntregaKm: authUser.data.proveedor.radio_entrega_km,
              cobraEnvio: authUser.data.proveedor.cobra_envio,
              envioGratisDesde: authUser.data.proveedor.envio_gratis_desde,
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
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        // setNotification({
        //   open: true,
        //   message: 'Error al cargar el perfil del usuario',
        //   severity: 'error',
        // });
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
        message: '¡Iniciaste sesión exitosamente!',
        severity: 'success',
      });
    },
    onError: (error: AuthError) => {
      console.error('Sign in error:', error);
      setNotification({
        open: true,
        message: error.message || 'Error al iniciar sesión',
        severity: 'error',
      });
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: async ({ email, password, nombre, type, ...extraData }: SignUpData) => {
      console.log('Starting signup process for:', email, type);

      // First, create Supabase user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
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
          navigate('/usuario-dashboard');
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
          navigate('/proveedor-dashboard');
        }
      } catch (dbError) {
        console.error('Database creation error:', dbError);
        setNotification({
          open: true,
          message: 'Error al crear el perfil en la base de datos',
          severity: 'error',
        });
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
        message: '¡Cerraste sesión exitosamente!',
        severity: 'success',
      });
    },
    onError: (error: AuthError | CancelledError) => {
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
    signOutMutation.mutate();
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
