import { AuthChangeEvent, AuthError, Session, User as SupabaseUser } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import api from '../api/api';
import { supabase } from '../lib/supabase';
import { Customer, Supplier, User, mapDBUser } from '../models';
import { proveedorState } from '../store/auth/proveedor';
import { userState } from '../store/auth/user';
import { notificationState } from '../store/snackbar';
import { useResetState } from './useResetState';

// Sign up parameters
interface SignUpParams {
  email: string;
  password: string;
  nombre: string;
  type: 'cliente' | 'proveedor';
  // Additional data based on type
  telefono?: string;
  nombre_negocio?: string;
  descripcion?: string;
  comunas?: number[];
}

interface UseAuthReturn {
  // Auth state
  session: Session | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;

  // User data
  cliente: Customer | null;
  proveedor: Supplier | null;
  user: Customer | null; // Legacy alias for cliente

  // Role flags
  isCliente: boolean;
  isProveedor: boolean;
  isLoggedIn: boolean;

  // Auth methods
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (params: SignUpParams) => Promise<void>;
  signOut: () => Promise<void>;

  // Loading states
  signInLoading: boolean;
  signUpLoading: boolean;
  signOutLoading: boolean;

  // Error states
  signUpError: AuthError | null;
}

// Types for API responses
interface UsuarioFromAPI {
  id_usuario: number;
  nombre: string;
  email: string;
  fecha_registro: string;
  activo: boolean;
  profile_picture_url?: string;
  id_plan?: number;
  created_at: string;
  updated_at: string;
}

interface ClienteFromAPI extends UsuarioFromAPI {
  cliente: {
    id_cliente: number;
    telefono?: string;
    id_direccion?: number;
    created_at: string;
    updated_at: string;
  };
}

interface ProveedorFromAPI extends UsuarioFromAPI {
  proveedor: {
    id_proveedor: number;
    nombre_negocio: string;
    descripcion?: string;
    telefono_contacto?: string;
    id_direccion?: number;
    latitud?: string;
    longitud?: string;
    destacado: boolean;
    email?: string;
    radio_entrega_km?: number;
    cobra_envio: boolean;
    envio_gratis_desde?: string;
    created_at: string;
    updated_at: string;
  };
}

export const useAuth = (): UseAuthReturn => {
  // Recoil state
  const [cliente, setCliente] = useRecoilState(userState);
  const [proveedor, setProveedor] = useRecoilState(proveedorState);
  const setNotification = useSetRecoilState(notificationState);
  const { resetState: resetAppState } = useResetState();

  // Local state
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingUserData, setFetchingUserData] = useState(false);

  // Navigation and query client
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Derived state
  const isCliente = !!cliente;
  const isProveedor = !!proveedor;
  const isLoggedIn = !!session && !!supabaseUser;

  // Fetch user data from API
  const fetchUserData = useCallback(
    async (email: string) => {
      if (fetchingUserData) return; // Prevent duplicate calls

      try {
        setFetchingUserData(true);
        // Get user data with client and supplier profiles
        const usuarioResponse = await api.get(`/auth/user/${email}`);
        const userData = usuarioResponse.data.data;

        // Map the user data
        const mappedUser: User = mapDBUser({
          id_usuario: userData.id_usuario,
          nombre: userData.nombre,
          email: userData.email,
          contrasena_hash: '', // We don't need the hash on frontend
          fecha_registro: userData.fecha_registro,
          activo: userData.activo,
          profile_picture_url: userData.profile_picture_url,
          id_plan: userData.id_plan,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
        });

        // Check if user is a cliente
        if (userData.cliente) {
          const mappedCliente: Customer = {
            idCliente: userData.cliente.id_cliente,
            idUsuario: userData.id_usuario,
            idDireccion: userData.cliente.id_direccion,
            telefono: userData.cliente.telefono,
            fechaRegistro: userData.fecha_registro,
            createdAt: userData.cliente.created_at,
            updatedAt: userData.cliente.updated_at,
            activo: userData.activo,
            usuario: mappedUser,
            profilePictureUrl: userData.profile_picture_url,
          };

          setCliente(mappedCliente);
        } else {
          setCliente(null);
        }

        // Check if user is a proveedor
        if (userData.proveedor) {
          const mappedProveedor: Supplier = {
            idProveedor: userData.proveedor.id_proveedor,
            nombreNegocio: userData.proveedor.nombre_negocio,
            descripcion: userData.proveedor.descripcion,
            telefonoContacto: userData.proveedor.telefono_contacto,
            latitud: userData.proveedor.latitud,
            longitud: userData.proveedor.longitud,
            destacado: userData.proveedor.destacado,
            email: userData.proveedor.email,
            createdAt: userData.proveedor.created_at,
            updatedAt: userData.proveedor.updated_at,
            usuario: mappedUser,
          };

          setProveedor(mappedProveedor);
        } else {
          setProveedor(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Don't show notification for 404 errors - user might not exist in DB yet
        if (
          error instanceof Error &&
          'response' in error &&
          (error as any)?.response?.status !== 404
        ) {
          setNotification({
            open: true,
            message: 'Error al cargar datos del usuario',
            severity: 'error',
          });
        }
        // Clear user data when user is not found
        setCliente(null);
        setProveedor(null);
      } finally {
        setFetchingUserData(false);
      }
    },
    [setCliente, setProveedor, setNotification, fetchingUserData],
  );

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted) {
          setSession(session);
          setSupabaseUser(session?.user ?? null);

          if (session?.user?.email) {
            console.log('Fetching user data for email:', session.user.email);
            await fetchUserData(session.user.email);
          }

          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (!mounted) return;

      setSession(session);
      setSupabaseUser(session?.user ?? null);

      if (event === 'SIGNED_IN' && session?.user?.email) {
        await fetchUserData(session.user.email);
      } else if (event === 'SIGNED_OUT') {
        setCliente(null);
        setProveedor(null);
        resetAppState();
        queryClient.clear();
      } else if (event === 'TOKEN_REFRESHED' && session?.user?.email) {
        // Only fetch user data if we don't already have it
        if (!cliente && !proveedor) {
          await fetchUserData(session.user.email);
        }
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      setNotification({
        open: true,
        message: 'Sesión iniciada exitosamente',
        severity: 'success',
      });

      // fetch the user from the db:
      const dbUser = await api.get(`/auth/user/${supabaseUser?.email}`);
      console.log('DB USER: ', dbUser);

      // Navigate based on user type
      if (isProveedor) {
        navigate('/proveedor-dashboard');
      } else {
        navigate('/usuario-dashboard');
      }
    },
    onError: (error: AuthError) => {
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
    mutationFn: async (params: SignUpParams) => {
      const { email, password, nombre, type, ...extraData } = params;

      console.log('Starting sign up process for:', email, type);

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

      console.log('Supabase user created successfully:', authData.user?.id);

      // Then create user in our database via API
      try {
        if (type === 'cliente') {
          console.log('Creating customer profile...');
          const response = await api.post('/auth/signup/customer', {
            email: email.toLowerCase(),
            nombre,
            telefono: extraData.telefono,
          });
          console.log('Customer created:', response.data);
        } else if (type === 'proveedor') {
          console.log('Creating supplier profile...');
          const response = await api.post('/auth/signup/supplier', {
            email: email.toLowerCase(),
            nombre,
            nombre_negocio: extraData.nombre_negocio,
            descripcion: extraData.descripcion,
            telefono_contacto: extraData.telefono,
          });
          console.log('Supplier created:', response.data);
        }
      } catch (dbError) {
        console.error('Database creation error:', dbError);
        // If database creation fails, we should still allow the user to continue
        // They can complete their profile later
        console.warn('User created in Supabase but database profile creation failed');
      }

      return authData;
    },
    onSuccess: () => {
      setNotification({
        open: true,
        message: 'Cuenta creada exitosamente. Por favor confirma tu email.',
        severity: 'success',
      });
      navigate('/email-confirmation');
    },
    onError: (error: AuthError | Error) => {
      let message = 'Error al crear la cuenta';

      if ('message' in error) {
        if (error.message.includes('User already registered')) {
          message = 'El email ya está registrado';
        } else if (error.message.includes('Password should be')) {
          message = 'La contraseña debe tener al menos 6 caracteres';
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
      setNotification({
        open: true,
        message: 'Sesión cerrada exitosamente',
        severity: 'success',
      });
      navigate('/');
    },
    onError: (error: AuthError) => {
      setNotification({
        open: true,
        message: 'Error al cerrar sesión',
        severity: 'error',
      });
    },
  });

  return {
    // Auth state
    session,
    supabaseUser,
    loading,

    // User data
    cliente: cliente
      ? {
          ...cliente,
          id: String(cliente.idCliente), // Auto-map id for legacy compatibility
        }
      : null,
    proveedor: proveedor
      ? {
          ...proveedor,
          id: String(proveedor.idProveedor), // Auto-map id for legacy compatibility
        }
      : null,
    user: cliente
      ? {
          ...cliente,
          id: String(cliente.idCliente), // Legacy alias for cliente with id mapping
        }
      : null,

    // Role flags
    isCliente,
    isProveedor,
    isLoggedIn,

    // Auth methods
    signInWithEmail: async (email: string, password: string) => {
      await signInMutation.mutateAsync({ email, password });
    },
    signUpWithEmail: async (params: SignUpParams) => {
      await signUpMutation.mutateAsync(params);
    },
    signOut: async () => {
      await signOutMutation.mutateAsync();
    },

    // Loading states
    signInLoading: signInMutation.isLoading,
    signUpLoading: signUpMutation.isLoading,
    signOutLoading: signOutMutation.isLoading,

    // Error states
    signUpError: signUpMutation.error instanceof AuthError ? signUpMutation.error : null,
  };
};
