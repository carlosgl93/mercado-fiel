import { productsApi } from '@/api';
import { Product, UpdateProductRequest } from '@/types/products';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ open, onClose, product }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<UpdateProductRequest>({
    nombreProducto: '',
    descripcion: '',
    precioUnitario: 0,
    imagenUrl: '',
    disponible: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        nombreProducto: product.nombreProducto,
        descripcion: product.descripcion || '',
        precioUnitario: Number(product.precioUnitario),
        imagenUrl: product.imagenUrl || '',
        disponible: product.disponible,
      });
    }
  }, [product]);

  // Mutation for updating product
  const updateProductMutation = useMutation({
    mutationFn: (productData: UpdateProductRequest) =>
      productsApi.updateProduct(product.idProducto, productData),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      handleClose();
    },
    onError: (error: any) => {
      console.error('Error updating product:', error);
    },
  });

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleInputChange =
    (field: keyof UpdateProductRequest) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: field === 'precioUnitario' ? Number(value) || 0 : value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    };

  const handleSwitchChange =
    (field: keyof UpdateProductRequest) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
    };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombreProducto?.trim()) {
      newErrors.nombreProducto = 'El nombre del producto es requerido';
    }

    if ((formData.precioUnitario || 0) <= 0) {
      newErrors.precioUnitario = 'El precio debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    updateProductMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Editar Producto</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre del Producto"
              value={formData.nombreProducto}
              onChange={handleInputChange('nombreProducto')}
              error={!!errors.nombreProducto}
              helperText={errors.nombreProducto}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Precio Unitario"
              type="number"
              value={formData.precioUnitario}
              onChange={handleInputChange('precioUnitario')}
              error={!!errors.precioUnitario}
              helperText={errors.precioUnitario}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch checked={formData.disponible} onChange={handleSwitchChange('disponible')} />
              }
              label="Producto disponible"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              multiline
              rows={3}
              value={formData.descripcion}
              onChange={handleInputChange('descripcion')}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="URL de Imagen"
              value={formData.imagenUrl}
              onChange={handleInputChange('imagenUrl')}
              helperText="URL de la imagen del producto (opcional)"
            />
          </Grid>

          {/* Show current category info */}
          {product.categoria && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Categoría actual: {product.categoria.nombre}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Para cambiar la categoría, contacta al administrador
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={updateProductMutation.isLoading}
        >
          {updateProductMutation.isLoading ? 'Actualizando...' : 'Actualizar Producto'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
