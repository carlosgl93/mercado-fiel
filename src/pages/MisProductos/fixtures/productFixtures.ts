import { CreateProductRequest } from '@/types/products';

// Interface for discount form data
export interface QuantityDiscountForm {
  cantidadMinima: number;
  descuentoPorcentaje: number;
  precioDescuento: number;
  isPercentageMode: boolean;
}

// Development form fixtures
export const DEV_PRODUCT_FIXTURES: CreateProductRequest = {
  idProveedor: 0, // Will be set from supplier
  idCategoria: 1, // Frutas
  nombreProducto: 'Manzanas Rojas Premium',
  descripcion:
    'Manzanas rojas frescas y jugosas, cultivadas localmente sin pesticidas. Perfectas para consumo directo o preparación de postres.',
  precioUnitario: 2500,
  unitType: 'kg',
  imagenUrl: '',
  disponible: true,
  elegibleCompraColectiva: true, // Always default to true
  descuentosCantidad: [],
};

export const DEV_DISCOUNT_FIXTURES: QuantityDiscountForm[] = [
  {
    cantidadMinima: 5,
    descuentoPorcentaje: 10,
    precioDescuento: 2250,
    isPercentageMode: true,
  },
  {
    cantidadMinima: 10,
    descuentoPorcentaje: 15,
    precioDescuento: 2125,
    isPercentageMode: true,
  },
];

// Alternative product fixtures for variety
export const DEV_PRODUCT_FIXTURES_ALT: CreateProductRequest[] = [
  {
    idProveedor: 0,
    idCategoria: 5, // Verduras
    nombreProducto: 'Lechuga Orgánica',
    descripcion: 'Lechuga fresca cultivada orgánicamente, libre de químicos.',
    precioUnitario: 1500,
    unitType: 'unit',
    imagenUrl: '',
    disponible: true,
    descuentosCantidad: [],
  },
  {
    idProveedor: 0,
    idCategoria: 2, // Carnes y Pescados
    nombreProducto: 'Salmón Fresco',
    descripcion: 'Salmón fresco del sur de Chile, excelente calidad.',
    precioUnitario: 12000,
    unitType: 'kg',
    imagenUrl: '',
    disponible: true,
    descuentosCantidad: [],
  },
  {
    idProveedor: 0,
    idCategoria: 3, // Panadería
    nombreProducto: 'Pan Artesanal',
    descripcion: 'Pan artesanal horneado diariamente con ingredientes naturales.',
    precioUnitario: 2800,
    unitType: 'unit',
    imagenUrl: '',
    disponible: true,
    descuentosCantidad: [],
  },
];

// Function to get random fixture
export const getRandomProductFixture = (): CreateProductRequest => {
  const fixtures = [DEV_PRODUCT_FIXTURES, ...DEV_PRODUCT_FIXTURES_ALT];
  return fixtures[Math.floor(Math.random() * fixtures.length)];
};

// Check if we're in development mode
export const isDevelopmentMode = (): boolean => {
  const isDev = import.meta.env.MODE === 'development' || import.meta.env.DEV;
  return isDev;
};
