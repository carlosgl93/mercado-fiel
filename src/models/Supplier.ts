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
  // Add more fields as needed from the proveedores table
}

// Frontend interface (camelCase)
export interface Supplier {
  idProveedor: number;
  nombreNegocio: string;
  descripcion?: string;
  telefonoContacto?: string;
  direccion?: string;
  latitud?: string;
  longitud?: string;
  planActual?: string;
  destacado: boolean;
  email?: string;
  createdAt: string;
  updatedAt: string;
  // Add more fields as needed for frontend usage
}
