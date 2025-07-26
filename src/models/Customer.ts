export interface CustomerDB extends Omit<UsuarioDB, 'cliente'> {
  id_cliente: number;
  id_usuario: number;
  id_direccion?: number | null;
  telefono?: string | null;
  fecha_registro: string;
  created_at: string;
  updated_at: string;
  usuario?: {
    id_usuario: number;
    nombre: string;
    email: string;
    activo: boolean;
    fecha_registro: string;
    plan: number;
    profile_picture_url?: string | null;
  };
  direccion?: {
    id_direccion: number;
    calle: string;
    numero: string;
    departamento?: string | null;
    id_comuna: number;
    id_region: number;
    codigo_postal?: string | null;
    referencia?: string | null;
    latitud?: number | null;
    longitud?: number | null;
    direccion_completa?: string | null;
    activa: boolean;
    created_at: string;
    updated_at: string;
    comuna?: {
      id_comuna: number;
      id_region: number;
      nombre: string;
      created_at: string;
      updated_at: string;
      region?: {
        id_region: number;
        codigo_region: string;
        nombre: string;
        created_at: string;
        updated_at: string;
      };
    };
  };
}

export interface UsuarioDB {
  id_usuario: number;
  nombre: string;
  email: string;
  contrasena_hash: string;
  fecha_registro: string;
  activo: boolean;
  profile_picture_url?: string | null;
  id_plan?: number | null;
  created_at: string;
  updated_at: string;
  cliente?: CustomerDB | null;
}

// Frontend interface (camelCase)
export interface Customer {
  idCliente: number;
  idUsuario: number;
  idDireccion?: number | null;
  telefono?: string | null;
  fechaRegistro: string;
  createdAt: string;
  updatedAt: string;
  activo: boolean;
  usuario?: {
    idUsuario: number;
    nombre: string;
    email: string;
    activo: boolean;
    fechaRegistro: string;
    plan: number;
  };
  profilePictureUrl?: string | null;
  direccion?: {
    idDireccion: number;
    calle: string;
    numero: string;
    departamento?: string | null;
    idComuna: number;
    idRegion: number;
    codigoPostal?: string | null;
    referencia?: string | null;
    latitud?: number | null;
    longitud?: number | null;
    direccionCompleta?: string | null;
    activa: boolean;
    createdAt: string;
    updatedAt: string;
    comuna?: {
      idComuna: number;
      idRegion: number;
      nombre: string;
      createdAt: string;
      updatedAt: string;
      region?: {
        idRegion: number;
        codigoRegion: string;
        nombre: string;
        createdAt: string;
        updatedAt: string;
      };
    };
  };
}
