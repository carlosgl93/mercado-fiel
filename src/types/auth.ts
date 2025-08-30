// Enhanced auth state types matching API response
export interface AuthCliente {
  id_cliente: number;
  id_usuario: number;
  id_direccion: number | null;
  telefono: string | null;
  fecha_registro: string;
  created_at: string;
  updated_at: string;
}

export interface AuthProveedor {
  id_proveedor: number;
  id_usuario: number;
  nombre_negocio: string;
  descripcion?: string;
  telefono_contacto?: string;
  id_direccion?: number | null;
  latitud?: string;
  longitud?: string;
  destacado: boolean;
  email?: string;
  radio_entrega_km?: number;
  cobra_envio: boolean;
  envio_gratis_desde?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUserData {
  id_usuario: number;
  nombre: string;
  email: string;
  fecha_registro: string;
  activo: boolean;
  profile_picture_url: string | null;
  id_plan: number | null;
  created_at: string;
  updated_at: string;
  cliente: AuthCliente | null;
  proveedor: AuthProveedor | null;
  isLoggedIn: boolean;
}

export interface AuthUser {
  success: boolean;
  data: AuthUserData;
  isLoggedIn: boolean;
}

// Legacy types for backward compatibility
export interface AuthCustomer extends AuthUserData {
  idCliente: number;
  telefono?: string;
  idDireccion?: number;
  isLoggedIn: boolean;
}

export interface AuthSupplier extends AuthUserData {
  idProveedor: number;
  nombreNegocio: string;
  descripcion?: string;
  telefonoContacto?: string;
  idDireccion?: number | null;
  latitud?: string | null;
  longitud?: string | null;
  destacado: boolean;
  emailNegocio?: string | null;
  radioEntregaKm?: number | null;
  cobraEnvio: boolean;
  envioGratisDesde?: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  customer: AuthCustomer | null;
  supplier: AuthSupplier | null;
  isInitialized: boolean;
  isLoading: boolean;
}
