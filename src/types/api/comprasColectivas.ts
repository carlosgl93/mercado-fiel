// Types for Compras Colectivas (Collective Purchases)

export interface CompraColectiva {
  id_campana: number;
  nombre: string;
  descripcion?: string;
  id_proveedor: number;
  id_producto: number;
  precio_objetivo: number;
  cantidad_objetivo: number;
  min_participantes?: number;
  max_participantes?: number;
  cantidad_min_usuario: number;
  cantidad_max_usuario?: number;
  requiere_aprobacion: boolean;
  fecha_inicio: Date;
  fecha_fin?: Date;
  estado: 'abierta' | 'cerrada' | 'completada' | 'cancelada';
  created_at: Date;
  updated_at?: Date;

  // Relations
  producto?: {
    id_producto: number;
    nombre_producto: string;
    descripcion?: string;
    precio_unitario: number;
    imagen_url?: string;
    unit_type?: string;
    proveedor?: {
      id_proveedor: number;
      nombre_negocio: string;
    };
    categoria?: {
      id_categoria: number;
      nombre: string;
    };
  };
  proveedor?: {
    id_proveedor: number;
    nombre_negocio: string;
    email?: string;
  };
  progreso?: ProgresoCompraColectiva;
  participantes?: ParticipanteColectivo[];
  escalas_precios?: EscalaPrecio[];
  minimum_purchase?: number; // Calculated field
}

export interface ProgresoCompraColectiva {
  id_progreso: number;
  id_campana: number;
  participantes_actuales: number;
  cantidad_actual: number;
  monto_recaudado: number;
  porcentaje_completado: number;
  precio_actual?: number;
  siguiente_tier?: number;
  created_at: Date;
  updated_at?: Date;
}

export interface ParticipanteColectivo {
  id_participante: number;
  id_campana: number;
  id_usuario: number;
  cantidad: number;
  monto_aportado: number;
  fecha_aporte: Date;
  estado: 'activo' | 'inactivo';
  created_at: Date;
  updated_at?: Date;
  usuario?: {
    id_usuario: number;
    nombre: string;
  };
}

export interface EscalaPrecio {
  id_escala: number;
  id_campana: number;
  cantidad_minima: number;
  precio_unitario: number;
  descuento_porcentaje?: number;
  activa: boolean;
  created_at: Date;
  updated_at?: Date;
}

// Request types
export interface CreateCompraColectivaRequest {
  nombre: string;
  descripcion?: string;
  id_producto: number;
  cantidad_objetivo: number;
  precio_objetivo: number;
  fecha_fin?: string;
  cantidad_inicial: number; // Amount creator wants to purchase
}

export interface UpdateCompraColectivaRequest {
  nombre?: string;
  descripcion?: string;
  fecha_fin?: string;
  estado?: 'abierta' | 'cerrada' | 'completada' | 'cancelada';
}

export interface JoinCompraColectivaRequest {
  cantidad: number;
}

// Response types
export interface ComprasColectivasListResponse {
  success: boolean;
  data: {
    campaigns: CompraColectiva[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface CompraColectivaResponse {
  success: boolean;
  data: CompraColectiva;
  message?: string;
}

export interface CompraColectivaActionResponse {
  success: boolean;
  data?: any;
  message: string;
}

// Filter types for listing campaigns
export interface CompraColectivaFilters {
  page?: number;
  limit?: number;
  estado?: 'abierta' | 'cerrada' | 'completada' | 'cancelada';
  id_producto?: number;
  id_proveedor?: number;
}