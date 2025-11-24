import { CreateProductRequest } from '@/types/products';

// Price calculation utilities
export const calculateDiscountedPrice = (originalPrice: number, discountPercentage: number): number => {
  return originalPrice * (1 - discountPercentage / 100);
};

export const calculateDiscountPercentage = (originalPrice: number, discountedPrice: number): number => {
  return ((originalPrice - discountedPrice) / originalPrice) * 100;
};

// Currency formatting utilities
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatCurrencyWithUnit = (amount: number, unitType: 'kg' | 'unit' = 'unit'): string => {
  const formatted = formatCurrency(amount);
  return unitType === 'kg' ? `${formatted}/kg` : `${formatted}/unidad`;
};

export const getUnitLabel = (unitType: 'kg' | 'unit' = 'unit'): string => {
  return unitType === 'kg' ? 'kilogramos' : 'unidades';
};

// Validation error types for better categorization
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  errorCount: number;
  errorSummary: string;
}

// Form validation utilities
export const validateProductForm = (
  formData: CreateProductRequest,
  discounts: any[],
  selectedImage: File | null,
): ValidationResult => {
  const newErrors: Record<string, string> = {};

  // Validate basic product information
  if (!formData.nombreProducto.trim()) {
    newErrors.nombreProducto = 'El nombre del producto es obligatorio';
  } else if (formData.nombreProducto.trim().length < 3) {
    newErrors.nombreProducto = 'El nombre debe tener al menos 3 caracteres';
  } else if (formData.nombreProducto.trim().length > 100) {
    newErrors.nombreProducto = 'El nombre no puede exceder 100 caracteres';
  }

  if (!formData.idProveedor || formData.idProveedor <= 0) {
    newErrors.idProveedor =
      'Error: ID de proveedor no válido. Intenta cerrar sesión e ingresar nuevamente.';
  }

  if (!formData.idCategoria || formData.idCategoria <= 0) {
    newErrors.idCategoria = 'Debes seleccionar una categoría para el producto';
  }

  if (formData.precioUnitario <= 0) {
    newErrors.precioUnitario = 'El precio debe ser mayor a $0';
  } else if (formData.precioUnitario > 10000000) {
    newErrors.precioUnitario = 'El precio no puede exceder $10.000.000';
  }

  // Validate description length if provided
  if (formData.descripcion && formData.descripcion.length > 500) {
    newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
  }

  // Validate image if selected
  if (selectedImage) {
    if (!selectedImage.type.startsWith('image/')) {
      newErrors.imagen = 'El archivo debe ser una imagen (JPG, PNG o WebP)';
    } else if (selectedImage.size > 5 * 1024 * 1024) {
      newErrors.imagen = 'La imagen debe ser menor a 5MB';
    }
  }

  // Validate discounts
  const discountErrors: string[] = [];
  discounts.forEach((discount, index) => {
    if (!discount.cantidadMinima || discount.cantidadMinima <= 0) {
      newErrors[`discount_${index}_cantidad`] = 'La cantidad debe ser mayor a 0';
      discountErrors.push(`Descuento ${index + 1}: cantidad inválida`);
    }

    if (discount.descuentoPorcentaje <= 0) {
      newErrors[`discount_${index}_percentage`] = 'El descuento debe ser mayor a 0%';
      discountErrors.push(`Descuento ${index + 1}: porcentaje inválido`);
    }

    if (discount.descuentoPorcentaje >= 100) {
      newErrors[`discount_${index}_percentage`] = 'El descuento debe ser menor a 100%';
      discountErrors.push(`Descuento ${index + 1}: porcentaje muy alto`);
    }

    if (discount.precioDescuento >= formData.precioUnitario) {
      newErrors[`discount_${index}_price`] =
        'El precio con descuento debe ser menor al precio original';
      discountErrors.push(`Descuento ${index + 1}: precio mayor o igual al original`);
    }

    if (discount.precioDescuento <= 0) {
      newErrors[`discount_${index}_price`] = 'El precio debe ser mayor a $0';
      discountErrors.push(`Descuento ${index + 1}: precio inválido`);
    }
  });

  // Generate error summary
  const errorCount = Object.keys(newErrors).length;
  const errorSummary = generateErrorSummary(newErrors, discountErrors);

  return {
    isValid: errorCount === 0,
    errors: newErrors,
    errorCount,
    errorSummary,
  };
};

// Generate user-friendly error summary
const generateErrorSummary = (errors: Record<string, string>, discountErrors: string[]): string => {
  const errorCategories: string[] = [];

  // Check for basic info errors
  if (errors.nombreProducto) errorCategories.push('nombre del producto');
  if (errors.idCategoria) errorCategories.push('categoría');
  if (errors.precioUnitario) errorCategories.push('precio');
  if (errors.descripcion) errorCategories.push('descripción');
  if (errors.imagen) errorCategories.push('imagen');
  if (errors.idProveedor) errorCategories.push('información de proveedor');

  // Add discount errors
  if (discountErrors.length > 0) {
    errorCategories.push(`${discountErrors.length} descuento(s)`);
  }

  if (errorCategories.length === 0) {
    return '';
  }

  if (errorCategories.length === 1) {
    return `Por favor corrige el error en: ${errorCategories[0]}`;
  }

  if (errorCategories.length === 2) {
    return `Por favor corrige los errores en: ${errorCategories[0]} y ${errorCategories[1]}`;
  }

  const last = errorCategories.pop();
  return `Por favor corrige los errores en: ${errorCategories.join(', ')} y ${last}`;
};

// Constants
export const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const DISCOUNT_MAX_PERCENTAGE = 99;
export const DISCOUNT_MIN_PERCENTAGE = 0;
export const DISCOUNT_STEP = 0.5;
