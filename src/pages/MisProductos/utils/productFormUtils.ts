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

// Form validation utilities
export const validateProductForm = (
  formData: CreateProductRequest,
  discounts: any[],
  selectedImage: File | null
): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  if (!formData.nombreProducto.trim()) {
    newErrors.nombreProducto = 'El nombre del producto es requerido';
  }

  if (!formData.idCategoria) {
    newErrors.idCategoria = 'Selecciona una categoría';
  }

  if (formData.precioUnitario <= 0) {
    newErrors.precioUnitario = 'El precio debe ser mayor a 0';
  }

  // Validate image if selected
  if (selectedImage) {
    if (!selectedImage.type.startsWith('image/')) {
      newErrors.imagen = 'Por favor selecciona una imagen válida';
    } else if (selectedImage.size > 5 * 1024 * 1024) {
      newErrors.imagen = 'La imagen debe ser menor a 5MB';
    }
  }

  // Validate discounts
  discounts.forEach((discount, index) => {
    if (!discount.cantidadMinima || discount.cantidadMinima <= 0) {
      newErrors[`discount_${index}_cantidad`] = 'La cantidad mínima debe ser mayor a 0';
    }

    if (discount.descuentoPorcentaje <= 0) {
      newErrors[`discount_${index}_percentage`] = 'El descuento debe ser mayor a 0%';
    }

    if (discount.descuentoPorcentaje >= 100) {
      newErrors[`discount_${index}_percentage`] = 'El descuento debe ser menor a 100%';
    }

    if (discount.precioDescuento >= formData.precioUnitario) {
      newErrors[`discount_${index}_price`] =
        'El precio con descuento debe ser menor al precio original';
    }

    if (discount.precioDescuento <= 0) {
      newErrors[`discount_${index}_price`] = 'El precio con descuento debe ser mayor a 0';
    }
  });

  return newErrors;
};

// Constants
export const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const DISCOUNT_MAX_PERCENTAGE = 99;
export const DISCOUNT_MIN_PERCENTAGE = 0;
export const DISCOUNT_STEP = 0.5;
