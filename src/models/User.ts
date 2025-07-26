export interface UserDB {
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
}

export interface User {
  idUsuario: number;
  nombre: string;
  email: string;
  contrasenaHash: string;
  fechaRegistro: string;
  activo: boolean;
  profilePictureUrl?: string | null;
  idPlan?: number | null;
  createdAt: string;
  updatedAt: string;
}

export const mapDBUser = (dbUser: UserDB): User => {
  return {
    idUsuario: dbUser.id_usuario,
    nombre: dbUser.nombre,
    email: dbUser.email,
    contrasenaHash: dbUser.contrasena_hash,
    fechaRegistro: dbUser.fecha_registro,
    activo: dbUser.activo,
    profilePictureUrl: dbUser.profile_picture_url,
    idPlan: dbUser.id_plan,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at,
  };
};
