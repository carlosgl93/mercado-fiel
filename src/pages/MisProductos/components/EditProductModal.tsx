import { productsApi } from '@/api';
import { categoriesApi } from '@/api/categories';
import { CLPCurrencyInput, NumberInput, PercentageInput } from '@/components/NumberInput';
import { Category } from '@/types/api/categories';
import { Product, UpdateProductRequest } from '@/types/products';
import { uploadImageToSupabase } from '@/utils/supabaseStorage';
import {
  Add as AddIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product;
}

interface QuantityDiscountForm {
  cantidadMinima: number;
  descuentoPorcentaje: number | undefined;
  precioDescuento: number | undefined;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ open, onClose, product }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<UpdateProductRequest>({
    nombreProducto: '',
    descripcion: '',
    precioUnitario: 0,
    imagenUrl: '',
    disponible: true,
    idCategoria: 0,
  });

  const [discounts, setDiscounts] = useState<QuantityDiscountForm[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Query for categories using axios api
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories(),
    enabled: open,
  });

  // Update form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        nombreProducto: product.nombreProducto,
        descripcion: product.descripcion || '',
        precioUnitario: Number(product.precioUnitario),
        imagenUrl: product.imagenUrl || '',
        disponible: product.disponible,
        idCategoria: product.idCategoria,
      });

      // Set existing discounts
      if (product.descuentosCantidad && product.descuentosCantidad.length > 0) {
        setDiscounts(
          product.descuentosCantidad.map((discount) => ({
            cantidadMinima: discount.cantidadMinima,
            descuentoPorcentaje: discount.descuentoPorcentaje,
            precioDescuento: discount.precioDescuento,
          })),
        );
      } else {
        setDiscounts([]);
      }

      // Set image preview if exists
      if (product.imagenUrl) {
        setImagePreview(product.imagenUrl);
      } else {
        setImagePreview(null);
      }
      setSelectedImage(null);
    }
  }, [product]);

  // Mutation for updating product
  const updateProductMutation = useMutation({
    mutationFn: (productData: UpdateProductRequest) =>
      productsApi.updateProduct(product.idProducto, productData),
    onError: (error: any) => {
      console.error('Error updating product:', error);
    },
  });

  const handleClose = () => {
    setErrors({});
    setDiscounts([]);
    setSelectedImage(null);
    setImagePreview(null);
    setImageUploading(false);
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

  const handleSelectChange = (field: keyof UpdateProductRequest) => (event: any) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'idCategoria' ? Number(value) : value,
    }));

    // Clear error when user selects
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, imagen: 'Por favor selecciona una imagen válida' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, imagen: 'La imagen debe ser menor a 5MB' }));
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      if (errors.imagen) {
        setErrors((prev) => ({ ...prev, imagen: '' }));
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imagenUrl: '' }));
  };

  const uploadProductImage = async (file: File): Promise<string> => {
    setImageUploading(true);

    try {
      const result = await uploadImageToSupabase(file, 'product-images', 'products');

      if (!result.success) {
        throw new Error(result.error || 'Error al subir la imagen');
      }

      return result.url!;
    } finally {
      setImageUploading(false);
    }
  };

  const addDiscount = () => {
    setDiscounts((prev) => [
      ...prev,
      {
        cantidadMinima: 1,
        descuentoPorcentaje: undefined,
        precioDescuento: undefined,
      },
    ]);
  };

  const removeDiscount = (index: number) => {
    setDiscounts((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDiscount = (
    index: number,
    field: keyof QuantityDiscountForm,
    value: number | undefined,
  ) => {
    setDiscounts((prev) =>
      prev.map((discount, i) => {
        if (i === index) {
          const updatedDiscount = { ...discount, [field]: value };
          
          // If updating percentage discount, automatically calculate fixed price
          if (field === 'descuentoPorcentaje' && value && formData.precioUnitario && formData.precioUnitario > 0) {
            const discountAmount = (formData.precioUnitario * value) / 100;
            updatedDiscount.precioDescuento = formData.precioUnitario - discountAmount;
          }
          
          return updatedDiscount;
        }
        return discount;
      }),
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombreProducto?.trim()) {
      newErrors.nombreProducto = 'El nombre del producto es requerido';
    }

    if (!formData.idCategoria) {
      newErrors.idCategoria = 'Selecciona una categoría';
    }

    if ((formData.precioUnitario || 0) <= 0) {
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

      if (!discount.descuentoPorcentaje && !discount.precioDescuento) {
        newErrors[`discount_${index}_value`] =
          'Debe especificar un descuento por porcentaje o precio fijo';
      }

      if (
        discount.descuentoPorcentaje &&
        (discount.descuentoPorcentaje <= 0 || discount.descuentoPorcentaje >= 100)
      ) {
        newErrors[`discount_${index}_percentage`] = 'El porcentaje debe estar entre 1 y 99';
      }

      if (discount.precioDescuento && formData.precioUnitario && discount.precioDescuento >= formData.precioUnitario) {
        newErrors[`discount_${index}_price`] =
          'El precio con descuento debe ser menor al precio original';
      }
    });

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

      const productData: UpdateProductRequest = {
        ...formData,
        imagenUrl,
      };

      // Update basic product info
      await updateProductMutation.mutateAsync(productData);

      // Handle discounts separately if they changed
      if (discounts.length > 0) {
        // Get current discounts to delete them first
        try {
          const currentDiscountsResponse = await productsApi.getQuantityDiscounts(product.idProducto);
          
          // Delete existing discounts
          if (currentDiscountsResponse.data && currentDiscountsResponse.data.length > 0) {
            await Promise.all(
              currentDiscountsResponse.data.map((discount) =>
                productsApi.deleteQuantityDiscount(product.idProducto, discount.idDescuento)
              )
            );
          }
        } catch (error) {
          console.log('No existing discounts to delete or error deleting:', error);
        }

        // Add new discounts
        const discountsToAdd = discounts
          .filter((discount) => discount.descuentoPorcentaje || discount.precioDescuento)
          .map((discount) => ({
            cantidadMinima: discount.cantidadMinima,
            descuentoPorcentaje: discount.descuentoPorcentaje,
            precioDescuento: discount.precioDescuento,
          }));

        if (discountsToAdd.length > 0) {
          await productsApi.addQuantityDiscounts(product.idProducto, discountsToAdd);
        }
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['product', product.idProducto]);
      handleClose();
    } catch (error) {
      console.error('Error updating product:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      if (errorMessage.includes('imagen')) {
        setErrors((prev) => ({
          ...prev,
          imagen: errorMessage,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: 'Error al actualizar el producto. Inténtalo de nuevo.',
        }));
      }
    }
  };

  const categories: Category[] = categoriesResponse?.data || [];

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
          {/* Error Alert */}
          {errors.general && (
            <Grid item xs={12}>
              <Alert severity="error">{errors.general}</Alert>
            </Grid>
          )}

          {/* Basic Product Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Información Básica
            </Typography>
          </Grid>

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
            <FormControl fullWidth error={!!errors.idCategoria}>
              <InputLabel>Categoría *</InputLabel>
              <Select
                value={formData.idCategoria || 0}
                onChange={handleSelectChange('idCategoria')}
                label="Categoría *"
              >
                <MenuItem value={0}>Seleccionar categoría</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.idCategoria} value={category.idCategoria}>
                    {category.nombre}
                  </MenuItem>
                ))}
              </Select>
              {errors.idCategoria && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                  {errors.idCategoria}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <CLPCurrencyInput
              fullWidth
              label="Precio Unitario"
              value={formData.precioUnitario || 0}
              onChange={(value) => setFormData((prev) => ({ ...prev, precioUnitario: value || 0 }))}
              error={!!errors.precioUnitario}
              helperText={errors.precioUnitario}
              required
              min={0}
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
            <Box>
              <Typography variant="body1" gutterBottom>
                Imagen del Producto (Opcional)
              </Typography>

              {!imagePreview ? (
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: errors.imagen ? 'error.main' : 'grey.300',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="body1" gutterBottom>
                    Haz clic para seleccionar una imagen
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Formatos soportados: JPG, PNG, WebP (máx. 5MB)
                  </Typography>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </Box>
              ) : (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      maxWidth: 300,
                      height: 200,
                      objectFit: 'cover',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'grey.300',
                    }}
                  />
                  <IconButton
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      },
                    }}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                  <Box sx={{ mt: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      startIcon={<ImageIcon />}
                    >
                      Cambiar imagen
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </Box>
                </Box>
              )}

              {errors.imagen && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.imagen}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch checked={formData.disponible} onChange={handleSwitchChange('disponible')} />
              }
              label="Producto disponible"
            />
          </Grid>

          {/* Quantity Discounts */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Descuentos por Cantidad (Opcional)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Configura descuentos automáticos cuando los clientes compren en cantidad.
                  </Typography>

                  {discounts.map((discount, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="subtitle2">Descuento #{index + 1}</Typography>
                        <IconButton
                          onClick={() => removeDiscount(index)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <NumberInput
                            fullWidth
                            label="Cantidad Mínima"
                            value={discount.cantidadMinima}
                            onChange={(value) =>
                              updateDiscount(index, 'cantidadMinima', value || 1)
                            }
                            error={!!errors[`discount_${index}_cantidad`]}
                            helperText={errors[`discount_${index}_cantidad`]}
                            min={1}
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <PercentageInput
                            fullWidth
                            label="Descuento %"
                            value={discount.descuentoPorcentaje}
                            onChange={(value) =>
                              updateDiscount(index, 'descuentoPorcentaje', value)
                            }
                            error={!!errors[`discount_${index}_percentage`]}
                            helperText={errors[`discount_${index}_percentage`]}
                            maxPercentage={99}
                            minPercentage={0}
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <CLPCurrencyInput
                            fullWidth
                            label="Precio Fijo"
                            value={discount.precioDescuento}
                            onChange={(value) => updateDiscount(index, 'precioDescuento', value)}
                            error={!!errors[`discount_${index}_price`]}
                            helperText={errors[`discount_${index}_price`]}
                            min={0}
                          />
                        </Grid>

                        {errors[`discount_${index}_value`] && (
                          <Grid item xs={12}>
                            <Alert severity="error" sx={{ mt: 1 }}>
                              {errors[`discount_${index}_value`]}
                            </Alert>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  ))}

                  <Button
                    startIcon={<AddIcon />}
                    onClick={addDiscount}
                    variant="outlined"
                    size="small"
                  >
                    Agregar Descuento
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={updateProductMutation.isLoading || imageUploading}
        >
          {imageUploading
            ? 'Subiendo imagen...'
            : updateProductMutation.isLoading
            ? 'Actualizando...'
            : 'Actualizar Producto'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
