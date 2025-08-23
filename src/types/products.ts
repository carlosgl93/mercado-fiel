// Types for products and quantity discounts

export interface Product {
  idProducto: number;
  idProveedor: number;
  idCategoria: number;
  nombreProducto: string;
  descripcion?: string;
  precioUnitario: number;
  imagenUrl?: string;
  disponible: boolean;
  fechaPublicacion: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  proveedor?: {
    idProveedor: number;
    nombreNegocio: string;
    destacado: boolean;
    usuario?: {
      nombre: string;
      email: string;
    };
  };
  categoria?: {
    idCategoria: number;
    nombre: string;
  };
  descuentosCantidad?: QuantityDiscount[];
  _count?: {
    comentarios: number;
    campanasColectivas: number;
    listaDeseos: number;
  };
}

export interface QuantityDiscount {
  idDescuento: number;
  idProducto: number;
  cantidadMinima: number;
  descuentoPorcentaje?: number;
  precioDescuento?: number;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductRequest {
  idProveedor: number;
  idCategoria: number;
  nombreProducto: string;
  descripcion?: string;
  precioUnitario: number;
  imagenUrl?: string;
  disponible?: boolean;
  descuentosCantidad?: {
    cantidadMinima: number;
    descuentoPorcentaje?: number;
    precioDescuento?: number;
  }[];
}

export interface UpdateProductRequest {
  idCategoria?: number;
  nombreProducto?: string;
  descripcion?: string;
  precioUnitario?: number;
  imagenUrl?: string;
  disponible?: boolean;
}

export interface CreateQuantityDiscountRequest {
  cantidadMinima: number;
  descuentoPorcentaje?: number;
  precioDescuento?: number;
}

export interface UpdateQuantityDiscountRequest {
  cantidadMinima?: number;
  descuentoPorcentaje?: number;
  precioDescuento?: number;
  activo?: boolean;
}

export interface ProductsListResponse {
  success: boolean;
  data: {
    productos: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface QuantityDiscountsResponse {
  success: boolean;
  data: QuantityDiscount[];
}

// Filters for product listing
export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoria?: string;
  proveedor?: string;
  disponible?: boolean;
  sortBy?: 'created_at' | 'updated_at' | 'nombre_producto' | 'precio_unitario';
  sortOrder?: 'asc' | 'desc';
}

// Category type
export interface Category {
  idCategoria: number;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
}
