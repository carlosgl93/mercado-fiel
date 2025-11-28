import { productsApi } from '@/api';
import { categoriesApi } from '@/api/categories';
import { useAuth } from '@/hooks/useAuthSupabase';
import { Category } from '@/types/api/categories';
import { CreateProductRequest } from '@/types/products';
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
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';
import { notificationState } from '../../../store/snackbar';

// Import components
import { BasicProductInfoForm } from './BasicProductInfoForm';
import { ProductImageUpload } from './ProductImageUpload';
import { QuantityDiscountForm } from './QuantityDiscountForm';

// Import hooks and utilities
import { DEV_DISCOUNT_FIXTURES, isDevelopmentMode } from '../fixtures/productFixtures';
import { useProductForm, useProductImageUpload } from '../hooks';

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({ open, onClose }) => {
  const { supplier } = useAuth();
  const queryClient = useQueryClient();
  const setNotification = useSetRecoilState(notificationState);

  // Initialize form data
  const getInitialFormData = (): CreateProductRequest => {
    return {
      idProveedor: supplier?.idProveedor || 0,
      idCategoria: 0,
      nombreProducto: '',
      descripcion: '',
      precioUnitario: 0,
      unitType: 'kg' as 'kg' | 'unit',
      imagenUrl: '',
      disponible: true,
      elegibleCompraColectiva: true,
      descuentosCantidad: [],
    };
  };

  // Use custom hooks for form management
  const {
    formData,
    discounts,
    errors,
    selectedImage,
    imagePreview,
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handlePriceChange,
    handleImageChange,
    handleRemoveImage,
    handleAddDiscount,
    handleRemoveDiscount,
    updateDiscount,
    validateForm,
    resetForm,
    setDiscounts,
    setErrors,
  } = useProductForm({
    initialData: getInitialFormData(),
    onValidationError: (errorSummary) => {
      setNotification({
        open: true,
        message: errorSummary,
        severity: 'error',
      });
    },
  });

  // Use custom hook for image upload
  const { uploadProductImage, imageUploading } = useProductImageUpload({
    onError: (errorMessage) => {
      setErrors((prev) => ({
        ...prev,
        imagen: errorMessage,
      }));
      setNotification({
        open: true,
        message: `❌ ${errorMessage}. Por favor intenta nuevamente.`,
        severity: 'error',
      });
    },
  });

  // Query for categories
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
      setNotification({
        open: true,
        message: '✅ Producto creado exitosamente',
        severity: 'success',
      });
      handleClose();
    },
    onError: (error: any) => {
      console.error('Error creating product:', error);
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Error al crear el producto';
      setNotification({
        open: true,
        message: `❌ ${errorMessage}. Por favor intenta nuevamente.`,
        severity: 'error',
      });
    },
  });

  // Handle modal close
  const handleClose = () => {
    resetForm(getInitialFormData());
    setDiscounts(isDevelopmentMode() ? DEV_DISCOUNT_FIXTURES : []);
    onClose();
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    if (formData.idProveedor === 0 && supplier?.idProveedor) {
      formData.idProveedor = supplier.idProveedor;
    } else {
      setErrors({
        idProveedor:
          'Error: ID de proveedor no válido. Intenta cerrar sesión e ingresar nuevamente.',
      });
      return;
    }

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
      console.error('Error in form submission:', error);
      // Error handling is already done in useProductImageUpload hook
    }
  };

  const categories: Category[] = categoriesResponse?.data || [];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Crear nuevo producto</Typography>
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
