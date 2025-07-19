export interface CustomerDB extends UsuarioDB {
  id_cliente: number;
  id_usuario: number;
  direccion?: string | null;
  telefono?: string | null;
  fecha_registro: string;
  created_at: string;
  updated_at: string;
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
  idUsuario: number;
  nombre: string;
  email: string;
  contrasenaHash: string;
  tipoUsuario: string;
  fechaRegistro: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  profilePictureUrl: string | null;
}
