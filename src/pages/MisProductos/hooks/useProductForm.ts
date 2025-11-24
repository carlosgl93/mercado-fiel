import { CreateProductRequest } from '@/types/products';
import { useState } from 'react';
import { QuantityDiscountForm as QuantityDiscountFormType } from '../fixtures/productFixtures';
import {
  calculateDiscountedPrice,
  calculateDiscountPercentage,
  IMAGE_MAX_SIZE,
  SUPPORTED_IMAGE_TYPES,
  validateProductForm,
} from '../utils/productFormUtils';

interface UseProductFormOptions {
  initialData: CreateProductRequest;
  onValidationError?: (errorSummary: string) => void;
}

export const useProductForm = ({ initialData, onValidationError }: UseProductFormOptions) => {
  const [formData, setFormData] = useState<CreateProductRequest>(initialData);
  const [discounts, setDiscounts] = useState<QuantityDiscountFormType[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Basic input handlers
  const handleInputChange =
    (field: keyof CreateProductRequest) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]:
          field === 'precioUnitario'
            ? value === ''
              ? 0
              : Number(value) || prev.precioUnitario
            : value,
      }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    };

  const handleSelectChange = (field: keyof CreateProductRequest) => (event: any) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'idCategoria' ? Number(value) : value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSwitchChange =
    (field: keyof CreateProductRequest) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.checked }));
    };

  const handlePriceChange = (value: number | undefined) => {
    setFormData((prev) => ({ ...prev, precioUnitario: value || 0 }));
    if (errors.precioUnitario) {
      setErrors((prev) => ({ ...prev, precioUnitario: '' }));
    }
  };

  // Image handlers
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, imagen: 'Por favor selecciona una imagen válida' }));
      return;
    }

    if (file.size > IMAGE_MAX_SIZE) {
      setErrors((prev) => ({ ...prev, imagen: 'La imagen debe ser menor a 5MB' }));
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Clear errors
    if (errors.imagen) {
      setErrors((prev) => ({ ...prev, imagen: '' }));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imagenUrl: '' }));
  };

  // Discount handlers
  const handleAddDiscount = () => {
    setDiscounts((prev) => [
      ...prev,
      {
        cantidadMinima: 1,
        descuentoPorcentaje: 0,
        precioDescuento: formData.precioUnitario,
        isPercentageMode: true,
      },
    ]);
  };

  const handleRemoveDiscount = (index: number) => {
    setDiscounts((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDiscount = (
    index: number,
    field: keyof QuantityDiscountFormType,
    value: number | boolean,
  ) => {
    setDiscounts((prev) =>
      prev.map((discount, i) => {
        if (i === index) {
          const updatedDiscount = { ...discount, [field]: value };

          // Sync percentage and fixed price based on mode
          if (
            field === 'descuentoPorcentaje' &&
            discount.isPercentageMode &&
            formData.precioUnitario > 0
          ) {
            updatedDiscount.precioDescuento = calculateDiscountedPrice(
              formData.precioUnitario,
              value as number,
            );
          } else if (
            field === 'precioDescuento' &&
            !discount.isPercentageMode &&
            formData.precioUnitario > 0
          ) {
            updatedDiscount.descuentoPorcentaje = calculateDiscountPercentage(
              formData.precioUnitario,
              value as number,
            );
          } else if (field === 'isPercentageMode') {
            // When switching modes, recalculate the inactive field
            if (value === true) {
              // Switching to percentage mode - calculate percentage from current fixed price
              updatedDiscount.descuentoPorcentaje = calculateDiscountPercentage(
                formData.precioUnitario,
                discount.precioDescuento,
              );
            } else {
              // Switching to fixed price mode - calculate fixed price from current percentage
              updatedDiscount.precioDescuento = calculateDiscountedPrice(
                formData.precioUnitario,
                discount.descuentoPorcentaje,
              );
            }
          }

          return updatedDiscount;
        }
        return discount;
      }),
    );
  };

  // Validation
  const validateForm = (): boolean => {
    const validationResult = validateProductForm(formData, discounts, selectedImage);
    setErrors(validationResult.errors);

    if (!validationResult.isValid && onValidationError) {
      onValidationError(validationResult.errorSummary);
    }

    return validationResult.isValid;
  };

  // Reset form
  const resetForm = (newInitialData: CreateProductRequest) => {
    setFormData(newInitialData);
    setDiscounts([]);
    setErrors({});
    setSelectedImage(null);
    setImagePreview(null);
  };

  return {
    // State
    formData,
    discounts,
    errors,
    selectedImage,
    imagePreview,
    // Handlers
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handlePriceChange,
    handleImageChange,
    handleRemoveImage,
    handleAddDiscount,
    handleRemoveDiscount,
    updateDiscount,
    // Validation
    validateForm,
    // Reset
    resetForm,
    // Setters (for advanced use)
    setFormData,
    setDiscounts,
    setErrors,
  };
};
