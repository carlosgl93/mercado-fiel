import { UsuarioDB } from './Customer';
import { mapDBUser, User } from './User';

// Backend interface (matches DB schema, snake_case)
export interface SupplierDB {
  id_proveedor: number;
  nombre_negocio: string;
  descripcion?: string;
  telefono_contacto?: string;
  direccion?: string;
  latitud?: string; // Prisma Decimal as string
  longitud?: string; // Prisma Decimal as string
  plan_actual?: string;
  destacado: boolean;
  email?: string;
  created_at: string;
  updated_at: string;
  usuario: UsuarioDB;
  // Add more fields as needed from the proveedores table
}

// Frontend interface (camelCase)
export interface Supplier {
  idProveedor: number;
  nombreNegocio: string;
  descripcion?: string;
  direccion?: string;
  latitud?: string;
  longitud?: string;
  planActual?: string;
  destacado: boolean;
  telefonoContacto?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  usuario: User;
  // Add more fields as needed for frontend usage
}

export const mapDBSupplier = (dbSupplier: SupplierDB): Supplier => {
  return {
    idProveedor: dbSupplier.id_proveedor,
    nombreNegocio: dbSupplier.nombre_negocio,
    descripcion: dbSupplier.descripcion,
    telefonoContacto: dbSupplier.telefono_contacto,
    direccion: dbSupplier.direccion,
    latitud: dbSupplier.latitud?.toString(),
    longitud: dbSupplier.longitud?.toString(),
    planActual: dbSupplier.plan_actual,
    destacado: dbSupplier.destacado,
    email: dbSupplier.email,
    usuario: mapDBUser(dbSupplier.usuario),
    createdAt: dbSupplier.created_at,
    updatedAt: dbSupplier.updated_at,
  };
};
