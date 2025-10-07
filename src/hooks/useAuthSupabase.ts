import { navigateToUserDashboard } from '@/utils/navigationUtils';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { supabase } from '../lib/supabase';
import { isSigningInState, isSigningOutState, isSigningUpState } from '../store/auth';
import {
  authCustomerState,
  authInitializedState,
  authLoadingState,
  authState,
  authSupplierState,
  authUserState,
} from '../store/authAtoms';
import { notificationState } from '../store/snackbar';
import { AuthCustomer, AuthSupplier, AuthUser } from '../types/auth';
import { UserLookingFor, useUserLookingFor } from './useUserLookingFor';

interface SignInCredentials {
  email: string;
  password: string;
}

const authPaths = [
  'usuario-dashboard',
  'proveedor-dashboard',
  'perfil-usuario',
  'proveedor-perfil',
  'mis-productos',
  'estadisticas-ventas',
];

interface SignUpData {
  email: string;
  password: string;
  nombre: string;
  apellido?: string;
  rut?: string;
  telefono?: string;
  type: 'customer' | 'supplier';
  // Supplier specific
  nombre_negocio?: string;
  descripcion?: string;
}

interface DatabaseUser {
  id_usuario: number;
  nombre: string;
  email: string;
  fecha_registro: string;
  activo: boolean;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string | null;
  auth_uid: string;
  cliente:
    | {
        id_cliente: number;
        telefono: string | null;
        id_direccion: number | null;
        fecha_registro: string;
      }[]
    | null;
  proveedor:
    | {
        id_proveedor: number;
        nombre_negocio: string;
        descripcion: string | null;
        telefono_contacto: string | null;
        id_direccion: number | null;
        destacado: boolean;
        email: string | null;
        radio_entrega_km: number | null;
        cobra_envio: boolean;
        envio_gratis_desde: string | null;
      }[]
    | null;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const { setUserLookingFor } = useUserLookingFor();
  const location = useLocation();

  // Recoil state
  const [auth, setAuth] = useRecoilState(authState);
  const [user, setUser] = useRecoilState(authUserState);
  const [customer, setCustomer] = useRecoilState(authCustomerState);
  const [supplier, setSupplier] = useRecoilState(authSupplierState);
  const [isInitialized, setIsInitialized] = useRecoilState(authInitializedState);
  const [isLoading, setIsLoading] = useRecoilState(authLoadingState);
  const [isSigningOut, setIsSigningOut] = useRecoilState(isSigningOutState);
  const [notification, setNotification] = useRecoilState(notificationState);

  // Loading states for individual operations
  const [isSigningIn, setIsSigningIn] = useRecoilState(isSigningInState);
  const [isSigningUp, setIsSigningUp] = useRecoilState(isSigningUpState);

  /**
   * Load user profile directly from Supabase database
   */
  const loadUserProfile = useCallback(
    async (supabaseUser: User): Promise<void> => {
      try {
        setIsLoading(true);

        // Query user data with relations from Supabase database
        const { data: userData, error } = await supabase
          .from('usuarios')
          .select(
            `
            id_usuario,
            nombre,
            email,
            fecha_registro,
            activo,
            profile_picture_url,
            created_at,
            updated_at,
            auth_uid,
            cliente:clientes (
              id_cliente,
              telefono,
              id_direccion,
              fecha_registro
            ),
            proveedor:proveedores (
              id_proveedor,
              nombre_negocio,
              descripcion,
              telefono_contacto,
              id_direccion,
              destacado,
              email,
              radio_entrega_km,
              cobra_envio,
              envio_gratis_desde
            )
          `,
          )
          .eq('auth_uid', supabaseUser.id)
          .single();

        if (error) {
          console.log({ error });
          if (error.details === 'The result contains 0 rows') {
            return;
          }
          throw error;
        }

        if (!userData) {
          if (authPaths.includes(location.pathname)) {
            navigate('/ingresar');
          }
        }

        const clienteData = userData.cliente?.[0];
        const proveedorData = userData.proveedor?.[0];

        // Transform database user to auth types
        const authUser: AuthUser = {
          success: true,
          data: {
            idUsuario: userData.id_usuario,
            nombre: userData.nombre,
            email: userData.email,
            fechaRegistro: userData.fecha_registro,
            activo: userData.activo,
            profilePictureUrl: userData.profile_picture_url,
            idPlan: null,
            createdAt: userData.created_at,
            updatedAt: userData.updated_at || null,
            cliente: clienteData
              ? {
                  idCliente: clienteData.id_cliente,
                  idUsuario: userData.id_usuario,
                  idDireccion: clienteData.id_direccion,
                  telefono: clienteData.telefono,
                  fechaRegistro: clienteData.fecha_registro,
                  createdAt: userData.created_at,
                  updatedAt: userData.updated_at,
                }
              : null,
            proveedor: proveedorData
              ? {
                  idProveedor: proveedorData.id_proveedor,
                  idUsuario: userData.id_usuario,
                  nombreNegocio: proveedorData.nombre_negocio,
                  descripcion: proveedorData.descripcion,
                  telefonoContacto: proveedorData.telefono_contacto,
                  idDireccion: proveedorData.id_direccion,
                  latitud: undefined,
                  longitud: undefined,
                  destacado: proveedorData.destacado,
                  email: proveedorData.email,
                  radioEntregaKm: proveedorData.radio_entrega_km,
                  cobraEnvio: proveedorData.cobra_envio,
                  envioGratisDesde: proveedorData.envio_gratis_desde,
                  createdAt: userData.created_at,
                  updatedAt: userData.updated_at,
                }
              : null,
            isLoggedIn: true,
          },
          isLoggedIn: true,
        };

        // Set user state
        setUser(authUser);

        // Set role-specific states
        let customerData: AuthCustomer | null = null;
        let supplierData: AuthSupplier | null = null;

        if (clienteData) {
          setUserLookingFor(UserLookingFor.SUPPLIERS);
          customerData = {
            ...authUser.data,
            idCliente: clienteData.id_cliente,
            telefono: clienteData.telefono,
            idDireccion: clienteData.id_direccion,
            isLoggedIn: true,
          };
          setCustomer(customerData);
        }

        if (proveedorData) {
          setUserLookingFor(UserLookingFor.CUSTOMERS);
          supplierData = {
            ...authUser.data,
            idProveedor: proveedorData.id_proveedor,
            nombreNegocio: proveedorData.nombre_negocio,
            descripcion: proveedorData.descripcion,
            telefonoContacto: proveedorData.telefono_contacto,
            idDireccion: proveedorData.id_direccion,
            latitud: undefined,
            longitud: undefined,
            destacado: proveedorData.destacado,
            emailNegocio: proveedorData.email,
            radioEntregaKm: proveedorData.radio_entrega_km,
            cobraEnvio: proveedorData.cobra_envio,
            envioGratisDesde: proveedorData.envio_gratis_desde,
          };
          setSupplier(supplierData);
        }

        // Update combined auth state
        setAuth({
          user: authUser,
          customer: customerData,
          supplier: supplierData,
          isInitialized: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('❌ Error in loadUserProfile:', error);
        setNotification({
          open: true,
          message: 'Error al cargar el perfil del usuario',
          severity: 'error',
        });
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    },
    [setAuth, setUser, setCustomer, setSupplier, setIsLoading, setIsInitialized, setNotification],
  );

  /**
   * Clear all auth state and navigate to home
   */
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
    setIsSigningOut(false);
    navigate('/', { replace: true });
  }, [setUser, setCustomer, setSupplier, setAuth, setIsSigningOut, navigate]);

  /**
   * Initialize authentication state
   */
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setIsInitialized(true);
            setIsLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
          await loadUserProfile(session.user);
        } else {
          if (mounted) {
            setIsInitialized(true);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (!mounted) return;

      // Use the centralized navigation utility
      navigateToUserDashboard({
        pathname: location.pathname,
        user: user?.data,
        navigate,
      });

      switch (event) {
        case 'INITIAL_SESSION':
          break;

        case 'SIGNED_IN':
          if (session?.user) {
            await loadUserProfile(session.user);
          }
          break;

        case 'SIGNED_OUT':
          clearAuthState();
          break;

        case 'TOKEN_REFRESHED':
          if (session?.user) {
            await loadUserProfile(session.user);
          }
          break;

        case 'USER_UPDATED':
          if (session?.user) {
            await loadUserProfile(session.user);
          }
          break;
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserProfile, clearAuthState, setIsInitialized, setIsLoading]);

  /**
   * Sign in with email and password
   */
  const signIn = async ({ email, password }: SignInCredentials): Promise<void> => {
    setIsSigningIn(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
        console.error('❌ Sign in error:', error);

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
        throw error;
      }

      await loadUserProfile(data.user!);
      navigateToUserDashboard({
        pathname: location.pathname,
        user: user?.data,
        navigate,
      });

      setNotification({
        open: true,
        message: '¡Iniciaste sesión exitosamente!',
        severity: 'success',
      });

      // Auth state change listener will handle loading user profile
    } finally {
      setIsSigningIn(false);
    }
  };

  /**
   * Sign up new user
   */
  const signUp = async (signUpData: SignUpData): Promise<void> => {
    setIsSigningUp(true);

    try {
      // Check if user already exists by email
      const { data: existingUsers, error: checkError } = await supabase
        .from('usuarios')
        .select('email')
        .eq('email', signUpData.email.toLowerCase());

      if (checkError) {
        console.error('❌ Error checking existing users:', checkError);
        throw checkError;
      }

      if (existingUsers && existingUsers.length > 0) {
        const errorMessage = 'Ya existe un usuario registrado con este email';

        setNotification({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
        throw new Error(errorMessage);
      }
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signUpData.email.toLowerCase(),
        password: signUpData.password,
        options: {
          data: {
            nombre: signUpData.nombre,
            apellido: signUpData.apellido,
            telefono: signUpData.telefono,
            user_type: signUpData.type,
          },
        },
      });

      if (authError) {
        console.error('❌ Supabase auth error:', authError);

        let message = 'Error al crear la cuenta';
        if (authError.message.includes('User already registered')) {
          message = 'El email ya está registrado';
        } else if (authError.message.includes('Password should be')) {
          message = 'La contraseña debe tener al menos 6 caracteres';
        } else if (authError.message.includes('Invalid email')) {
          message = 'Email inválido';
        }

        setNotification({
          open: true,
          message,
          severity: 'error',
        });
        throw authError;
      }

      if (!authData.user) {
        throw new Error('No user returned from signup');
      }

      // Create user in database
      const { data: userData, error: dbError } = await supabase
        .from('usuarios')
        .insert({
          nombre: signUpData.nombre,
          email: signUpData.email.toLowerCase(),
          contrasena_hash: '',
          activo: true,
          auth_uid: authData.user.id,
        })
        .select()
        .single();

      if (dbError) {
        console.error('❌ Database user creation error:', dbError);
        throw dbError;
      }
      // Create role-specific profile
      if (signUpData.type === 'customer') {
        const { error: customerError } = await supabase.from('clientes').insert({
          id_usuario: userData.id_usuario,
          telefono: signUpData.telefono,
        });

        if (customerError) {
          console.error('❌ Customer creation error:', customerError);
          throw customerError;
        }
      } else if (signUpData.type === 'supplier') {
        const { error: supplierError } = await supabase.from('proveedores').insert({
          id_usuario: userData.id_usuario,
          nombre_negocio: signUpData.nombre_negocio || signUpData.nombre,
          descripcion: signUpData.descripcion || '',
          telefono_contacto: signUpData.telefono,
          destacado: false,
          cobra_envio: true,
          radio_entrega_km: 10,
        });

        if (supplierError) {
          console.error('❌ Supplier creation error:', supplierError);
          throw supplierError;
        }
      }

      setNotification({
        open: true,
        message: '¡Cuenta creada exitosamente! Por favor verifica tu email.',
        severity: 'success',
      });

      // Navigate based on user type (if email confirmation is not required)
      if (authData.session) {
        if (signUpData.type === 'customer') {
          navigate('/usuario-dashboard');
        } else if (signUpData.type === 'supplier') {
          navigate('/proveedor-dashboard');
        }
      } else {
        navigate('/ingresar');
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  /**
   * Sign out current user
   */
  const signOut = async (): Promise<void> => {
    try {
      setIsSigningOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('❌ Sign out error:', error);
        setIsSigningOut(false);
        setNotification({
          open: true,
          message: 'Error al cerrar sesión',
          severity: 'error',
        });
        throw error;
      }

      // Auth state change listener will handle cleanup
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      setIsSigningOut(false);
      throw error;
    }
  };

  // Helper functions
  const isAuthenticated = useCallback(() => !!user?.data?.isLoggedIn, [user]);
  const isCustomer = useCallback(() => !!customer, [customer]);
  const isSupplier = useCallback(() => !!supplier, [supplier]);

  const getUserRole = useCallback(() => {
    if (isCustomer()) return 'customer';
    if (isSupplier()) return 'supplier';
    return 'user';
  }, [isCustomer, isSupplier]);

  return {
    // Auth state - Compatible with all components
    user,
    customer:
      customer ||
      (user?.data?.cliente ? { ...user.data, ...user.data.cliente, isLoggedIn: true } : null),
    supplier:
      supplier ||
      (user?.data?.proveedor ? { ...user.data, ...user.data.proveedor, isLoggedIn: true } : null),
    cliente:
      customer ||
      (user?.data?.cliente ? { ...user.data, ...user.data.cliente, isLoggedIn: true } : null), // Alias for backward compatibility
    isInitialized,
    isLoading: isLoading || isSigningIn || isSigningUp || isSigningOut,
    isLoggedIn: !!user?.data?.isLoggedIn,

    // Auth actions
    signIn,
    signUp,
    signOut,

    // Helper functions
    isAuthenticated,
    isCustomer,
    isSupplier,
    getUserRole,

    // Loading states
    isSigningIn,
    isSigningUp,
    isSigningOut,

    // Legacy error properties for backward compatibility
    signUpError: null, // No longer using mutations, errors handled via notifications
  };
};
