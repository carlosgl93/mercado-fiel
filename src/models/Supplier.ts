import { Address, AddressDB, mapDBAddress } from './Address';
import { UsuarioDB } from './Customer';
import { ProductDB, ProductForSupplier } from './Product';
import { mapDBUser, User } from './User';

// Backend interface (matches DB schema, snake_case)
export interface SupplierDB {
  id_proveedor: number;
  nombre_negocio: string;
  descripcion?: string;
  telefono_contacto?: string;
  direccion?: AddressDB;
  latitud?: string; // Prisma Decimal as string
  longitud?: string; // Prisma Decimal as string
  plan_actual?: string;
  destacado: boolean;
  email?: string;
  created_at: string;
  updated_at: string;
  usuario: UsuarioDB;
  productos?: ProductDB[];
  // Add more fields as needed from the proveedores table
}

// Frontend interface (camelCase)
export interface Supplier {
  idProveedor: number;
  nombreNegocio: string;
  descripcion?: string;
  direccion?: Address;
  latitud?: string;
  longitud?: string;
  planActual?: string;
  destacado: boolean;
  telefonoContacto?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  usuario: User;

  // Legacy compatibility fields (for backwards compatibility with existing components)
  id?: string;
  firstname?: string;
  lastname?: string;
  rut?: string;
  servicio?: string;
  profileImageUrl?: string;
  availability?: any[];
  settings?: {
    servicios?: boolean;
    detallesBasicos?: boolean;
    disponibilidad?: boolean;
    comunas?: boolean;
    experiencia?: boolean;
    cuentaBancaria?: boolean;
    historialLaboral?: boolean;
    educacionFormacion?: boolean;
    registroSuperIntendenciaSalud?: boolean;
    insignias?: boolean;
    inmunizacion?: boolean;
    idiomas?: boolean;
    antecedentesCulturales?: boolean;
    religion?: boolean;
    interesesHobbies?: boolean;
    sobreMi?: boolean;
    misPreferencias?: boolean;
    tarifas?: boolean;
  };
  offersFreeMeetAndGreet?: boolean;
  averageReviews?: number;
  totalReviews?: number;
  imageUrl?: string;
  especialidad?: string;
  description?: string;
  verified?: boolean;
  createdServicios?: any[];
  comunas?: any[];
  telefono?: string;
  gender?: string;
  dob?: string;
  address?: string;
  role?: string;
  // Add more fields as needed for frontend usage
}

export interface SupplierWithProducts extends Supplier {
  productos: ProductForSupplier[];
}

export const mapDBSupplier = (dbSupplier: SupplierDB): SupplierWithProducts => {
  return {
    idProveedor: dbSupplier.id_proveedor,
    nombreNegocio: dbSupplier.nombre_negocio,
    descripcion: dbSupplier.descripcion,
    telefonoContacto: dbSupplier.telefono_contacto,
    direccion: dbSupplier.direccion ? mapDBAddress(dbSupplier.direccion) : undefined,
    latitud: dbSupplier.latitud?.toString(),
    longitud: dbSupplier.longitud?.toString(),
    planActual: dbSupplier.plan_actual,
    destacado: dbSupplier.destacado,
    email: dbSupplier.email,
    usuario: mapDBUser(dbSupplier.usuario),
    createdAt: dbSupplier.created_at,
    updatedAt: dbSupplier.updated_at,
    productos:
      dbSupplier.productos?.map((p: ProductDB) => ({
        ...p,
        nombreProducto: p.nombre_producto,
        precioUnitario: p.precio_unitario?.toString(),
        fechaPublicacion: p.fecha_publicacion.toString(),
        comentarios: p.comentarios.map((c) => ({
          idComentario: c.id_comentario,
          texto: c.texto,
          calificacion: c.calificacion,
        })),
        categoria: {
          idCategoria: p.categoria.id_categoria,
          nombre: p.categoria.nombre,
        },
        descripcion: p.descripcion,
        imagenUrl: p.imagen_url,
      })) || [],
  };
};
