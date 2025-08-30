import { Product } from './products';

export interface CartItem {
  id_carrito: number;
  id_usuario: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  created_at: string;
  updated_at: string;
  producto: Product;
  precio_final: number;
  subtotal: number;
  descuento_aplicado?: {
    id_descuento: number;
    cantidad_minima: number;
    descuento_porcentaje?: number;
    precio_descuento?: number;
  };
  ahorro: number;
}

export interface CartSummary {
  cantidad_items: number;
  cantidad_productos: number;
  subtotal: number;
  total_ahorro: number;
  total: number;
}

export interface CartItemsData {
  items: CartItem[];
  resumen: CartSummary;
}

export interface AddCartItemRequest {
  id_producto: number;
  cantidad: number;
}

export interface UpdateCartItemRequest {
  cantidad: number;
}

// API Response types
export interface CartResponse {
  success: boolean;
  data: CartItem;
  message?: string;
}

export interface CartItemsResponse {
  success: boolean;
  data: CartItemsData;
}

export interface CartSummaryResponse {
  success: boolean;
  data: CartSummary;
}

// Cart state for frontend store (with camelCase for UI)
export interface CartState {
  items: CartItem[];
  summary: CartSummary;
  loading: boolean;
  error: string | null;
}
