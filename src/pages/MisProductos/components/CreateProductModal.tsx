import { productsApi } from '@/api';
import { categoriesApi } from '@/api/categories';
import { useAuth } from '@/hooks/useAuthSupabase';
import { Category } from '@/types/api/categories';
import { CreateProductRequest } from '@/types/products';
import { useImageUpload } from '@/utils/supabaseStorage';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// Import new components
import { BasicProductInfoForm } from './BasicProductInfoForm';
import { ProductImageUpload } from './ProductImageUpload';
import { QuantityDiscountForm } from './QuantityDiscountForm';

// Import fixtures and utilities
import {
  DEV_DISCOUNT_FIXTURES,
  DEV_PRODUCT_FIXTURES,
  isDevelopmentMode,
  QuantityDiscountForm as QuantityDiscountFormType,
} from '../fixtures/productFixtures';
import {
  calculateDiscountedPrice,
  calculateDiscountPercentage,
  IMAGE_MAX_SIZE,
  SUPPORTED_IMAGE_TYPES,
  validateProductForm,
} from '../utils/productFormUtils';

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({ open, onClose }) => {
  const { supplier } = useAuth();
  const { uploadImage } = useImageUpload();
  const queryClient = useQueryClient();

  // Initialize form with fixtures in development mode
  const getInitialFormData = (): CreateProductRequest => {
    const baseData = {
      idProveedor: supplier?.idProveedor || 0,
      idCategoria: 0,
      nombreProducto: '',
      descripcion: '',
      precioUnitario: 0,
      unitType: 'unit' as 'kg' | 'unit',
      imagenUrl: '',
      disponible: true,
      elegibleCompraColectiva: false,
      descuentosCantidad: [],
    };

    if (isDevelopmentMode()) {
      return {
        ...DEV_PRODUCT_FIXTURES,
        idProveedor: supplier?.idProveedor || 0,
      };
    }

    return baseData;
  };

  const [formData, setFormData] = useState<CreateProductRequest>(getInitialFormData());
  const [discounts, setDiscounts] = useState<QuantityDiscountFormType[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Auto-fill discounts in development mode
  useEffect(() => {
    if (isDevelopmentMode() && open && discounts.length === 0) {
      setDiscounts(DEV_DISCOUNT_FIXTURES);
    }
  }, [open, discounts.length]);

  // Query for categories using axios api
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories(),
    enabled: open,
  });

  // Mutation for creating product
  const createProductMutation = useMutation({
    mutationFn: (productData: CreateProductRequest) => productsApi.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      handleClose();
    },
    onError: (error: any) => {
      console.error('Error creating product:', error);
    },
  });

  const handleClose = () => {
    setFormData(getInitialFormData());
    setDiscounts(isDevelopmentMode() ? DEV_DISCOUNT_FIXTURES : []);
    setErrors({});
    setSelectedImage(null);
    setImagePreview(null);
    setImageUploading(false);
    onClose();
  };

  // Event handlers
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

  // Image handling
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

  // Image upload
  const uploadProductImage = async (file: File): Promise<string> => {
    setImageUploading(true);
    try {
      const result = await uploadImage(file, 'product-images', 'products');
      if (!result.success) {
        throw new Error(result.error || 'Error al subir la imagen');
      }
      // Return the key instead of URL - this should be stored in the database
      // The backend should construct the proper URL when serving the product data
      return result.key || result.url!;
    } finally {
      setImageUploading(false);
    }
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

  // Form validation
  const validateForm = (): boolean => {
    const newErrors = validateProductForm(formData, discounts, selectedImage);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      let imagenUrl = formData.imagenUrl;

      // Upload image if one is selected
      if (selectedImage) {
        imagenUrl = await uploadProductImage(selectedImage);
      }

      const productData: CreateProductRequest = {
        ...formData,
        imagenUrl,
        descuentosCantidad: discounts
          .filter((discount) => discount.descuentoPorcentaje > 0 && discount.cantidadMinima > 0)
          .map((discount) => ({
            cantidadMinima: discount.cantidadMinima,
            descuentoPorcentaje: discount.descuentoPorcentaje,
            precioDescuento: discount.precioDescuento,
          })),
      };

      createProductMutation.mutate(productData);
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors((prev) => ({
        ...prev,
        imagen:
          error instanceof Error ? error.message : 'Error al subir la imagen. Inténtalo de nuevo.',
      }));
    }
  };

  const categories: Category[] = categoriesResponse?.data || [];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Crear Nuevo Producto</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Basic Product Information */}
          <BasicProductInfoForm
            formData={formData}
            categories={categories}
            errors={errors}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onSwitchChange={handleSwitchChange}
            onPriceChange={handlePriceChange}
          />

          {/* Product Image Upload */}
          <ProductImageUpload
            imagePreview={imagePreview}
            errors={errors}
            onImageChange={handleImageChange}
            onRemoveImage={handleRemoveImage}
          />

          {/* Quantity Discounts */}
          <QuantityDiscountForm
            formData={formData}
            discounts={discounts}
            errors={errors}
            onAddDiscount={handleAddDiscount}
            onRemoveDiscount={handleRemoveDiscount}
            onUpdateDiscount={updateDiscount}
          />
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={createProductMutation.isLoading || imageUploading}
        >
          {imageUploading
            ? 'Subiendo imagen...'
            : createProductMutation.isLoading
            ? 'Creando...'
            : 'Crear Producto'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
