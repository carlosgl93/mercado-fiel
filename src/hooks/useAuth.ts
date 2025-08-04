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
      try {
        // First, try to get usuario data
        const usuarioResponse = await api.get(`/usuarios/email/${email}`);
        const usuarioData: UsuarioFromAPI = usuarioResponse.data.data;

        // Map the user data
        const mappedUser: User = mapDBUser({
          id_usuario: usuarioData.id_usuario,
          nombre: usuarioData.nombre,
          email: usuarioData.email,
          contrasena_hash: '', // We don't need the hash on frontend
          fecha_registro: usuarioData.fecha_registro,
          activo: usuarioData.activo,
          profile_picture_url: usuarioData.profile_picture_url,
          id_plan: usuarioData.id_plan,
          created_at: usuarioData.created_at,
          updated_at: usuarioData.updated_at,
        });

        // Check if user is a cliente
        try {
          const clienteResponse = await api.get(`/customers/usuario/${usuarioData.id_usuario}`);
          const clienteData: ClienteFromAPI = clienteResponse.data.data;

          const mappedCliente: Customer = {
            idCliente: clienteData.cliente.id_cliente,
            idUsuario: usuarioData.id_usuario,
            idDireccion: clienteData.cliente.id_direccion,
            telefono: clienteData.cliente.telefono,
            fechaRegistro: clienteData.fecha_registro,
            createdAt: clienteData.cliente.created_at,
            updatedAt: clienteData.cliente.updated_at,
            activo: usuarioData.activo,
            usuario: mappedUser,
            profilePictureUrl: usuarioData.profile_picture_url,
          };

          setCliente(mappedCliente);
        } catch (error) {
          // User is not a cliente, that's okay
          setCliente(null);
        }

        // Check if user is a proveedor
        try {
          const proveedorResponse = await api.get(`/suppliers/usuario/${usuarioData.id_usuario}`);
          const proveedorData: ProveedorFromAPI = proveedorResponse.data.data;

          const mappedProveedor: Supplier = {
            idProveedor: proveedorData.proveedor.id_proveedor,
            nombreNegocio: proveedorData.proveedor.nombre_negocio,
            descripcion: proveedorData.proveedor.descripcion,
            telefonoContacto: proveedorData.proveedor.telefono_contacto,
            latitud: proveedorData.proveedor.latitud,
            longitud: proveedorData.proveedor.longitud,
            destacado: proveedorData.proveedor.destacado,
            email: proveedorData.proveedor.email,
            createdAt: proveedorData.proveedor.created_at,
            updatedAt: proveedorData.proveedor.updated_at,
            usuario: mappedUser,
          };

          setProveedor(mappedProveedor);
        } catch (error) {
          // User is not a proveedor, that's okay
          setProveedor(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setNotification({
          open: true,
          message: 'Error al cargar datos del usuario',
          severity: 'error',
        });
      }
    },
    [setCliente, setProveedor, setNotification],
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
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserData, resetAppState, queryClient]);

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
    onSuccess: () => {
      setNotification({
        open: true,
        message: 'Sesión iniciada exitosamente',
        severity: 'success',
      });

      // Navigate based on user type
      if (isProveedor) {
        navigate('/prestador-dashboard');
      } else if (isCliente) {
        navigate('/usuario-dashboard');
      } else {
        navigate('/dashboard');
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

      if (authError) throw authError;

      // Then create user in our database via API
      if (type === 'cliente') {
        await api.post('/customers', {
          email: email.toLowerCase(),
          nombre,
          telefono: extraData.telefono,
        });
      } else if (type === 'proveedor') {
        await api.post('/suppliers', {
          email: email.toLowerCase(),
          nombre,
          nombre_negocio: extraData.nombre_negocio,
          descripcion: extraData.descripcion,
          telefono_contacto: extraData.telefono,
        });
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
