// Types for supplier/provider business information

export interface Supplier {
  idProveedor: number;
  idUsuario: number;
  nombreNegocio: string;
  descripcion?: string;
  telefonoContacto?: string;
  idDireccion?: number;
  latitud?: number;
  longitud?: number;
  destacado: boolean;
  email?: string; // Business contact email
  radioEntregaKm?: number;
  cobraEnvio: boolean;
  envioGratisDesde?: number;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  usuario?: {
    idUsuario: number;
    nombre: string;
    email: string;
  };
  direccion?: {
    idDireccion: number;
    calle: string;
    numero?: string;
    departamento?: string;
    idComuna: number;
    idRegion: number;
    codigoPostal?: string;
    referencia?: string;
    direccionCompleta?: string;
  };
}

export interface UpdateBusinessRequest {
  nombreNegocio: string;
  descripcion?: string;
  telefonoContacto?: string;
  email?: string;
  radioEntregaKm?: number;
  cobraEnvio?: boolean;
  envioGratisDesde?: number;
}

export interface UpdateProfileRequest {
  nombre?: string;
  email?: string;
  profilePictureUrl?: string;
}

export interface SupplierResponse {
  success: boolean;
  data: Supplier;
  message?: string;
}

// Address types for future use
export interface Address {
  idDireccion: number;
  calle: string;
  numero?: string;
  departamento?: string;
  idComuna: number;
  idRegion: number;
  codigoPostal?: string;
  referencia?: string;
  direccionCompleta?: string;
  activa: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Region {
  idRegion: number;
  codigoRegion: string;
  nombre: string;
}

export interface Comuna {
  idComuna: number;
  idRegion: number;
  nombre: string;
}
