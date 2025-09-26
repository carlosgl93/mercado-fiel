// Enhanced auth state types matching API response
export interface AuthCliente {
  idCliente: number;
  idUsuario: number;
  idDireccion: number | null;
  telefono: string | null;
  fechaRegistro: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthProveedor {
  idProveedor: number;
  idUsuario: number;
  nombreNegocio: string;
  descripcion?: string;
  telefonoContacto?: string;
  idDireccion?: number | null;
  latitud?: string;
  longitud?: string;
  destacado: boolean;
  email?: string;
  radioEntregaKm?: number;
  cobraEnvio: boolean;
  envioGratisDesde?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUserData {
  idUsuario: number;
  nombre: string;
  email: string;
  fechaRegistro: string;
  activo: boolean;
  profilePictureUrl: string | null;
  idPlan: number | null;
  createdAt: string;
  updatedAt: string;
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
