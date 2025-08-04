// Enhanced auth state types
export interface AuthUser {
  idUsuario: number;
  nombre: string;
  email: string;
  fechaRegistro: string;
  activo: boolean;
  profilePictureUrl?: string;
  idPlan?: number;
  createdAt: string;
  updatedAt: string;
  isLoggedIn: boolean;
}

export interface AuthCustomer extends AuthUser {
  idCliente: number;
  telefono?: string;
  idDireccion?: number;
  // Add other customer-specific fields
}

export interface AuthSupplier extends AuthUser {
  idProveedor: number;
  nombreNegocio: string;
  descripcion?: string;
  telefonoContacto?: string;
  idDireccion?: number;
  latitud?: string;
  longitud?: string;
  destacado: boolean;
  emailNegocio?: string;
  radioEntregaKm?: number;
  cobraEnvio: boolean;
  envioGratisDesde?: string;
  // Add other supplier-specific fields
}

export interface AuthState {
  user: AuthUser | null;
  customer: AuthCustomer | null;
  supplier: AuthSupplier | null;
  isInitialized: boolean;
  isLoading: boolean;
}
