import { productsApi } from '@/api';
import { useAuth } from '@/hooks/useAuthSupabase';
import { Category, CreateProductRequest } from '@/types/products';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
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
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
}

interface QuantityDiscountForm {
  cantidadMinima: number;
  descuentoPorcentaje?: number;
  precioDescuento?: number;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({ open, onClose }) => {
  const { supplier } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateProductRequest>({
    idProveedor: supplier?.idProveedor || 0,
    idCategoria: 0,
    nombreProducto: '',
    descripcion: '',
    precioUnitario: 0,
    imagenUrl: '',
    disponible: true,
    descuentosCantidad: [],
  });

  const [discounts, setDiscounts] = useState<QuantityDiscountForm[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Query for categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetch('/api/categories').then((res) => res.json()),
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
    setFormData({
      idProveedor: supplier?.idProveedor || 0,
      idCategoria: 0,
      nombreProducto: '',
      descripcion: '',
      precioUnitario: 0,
      imagenUrl: '',
      disponible: true,
      descuentosCantidad: [],
    });
    setDiscounts([]);
    setErrors({});
    onClose();
  };

  const handleInputChange =
    (field: keyof CreateProductRequest) =>
    (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
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

  const handleSelectChange = (field: keyof CreateProductRequest) => (event: any) => {
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
    (field: keyof CreateProductRequest) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
    };

  const addDiscount = () => {
    setDiscounts((prev) => [
      ...prev,
      {
        cantidadMinima: 1,
        descuentoPorcentaje: 0,
      },
    ]);
  };

  const removeDiscount = (index: number) => {
    setDiscounts((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDiscount = (
    index: number,
    field: keyof QuantityDiscountForm,
    value: string | number,
  ) => {
    setDiscounts((prev) =>
      prev.map((discount, i) =>
        i === index
          ? { ...discount, [field]: typeof value === 'string' ? Number(value) || 0 : value }
          : discount,
      ),
    );
  };

  const validateForm = (): boolean => {
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

    // Validate discounts
    discounts.forEach((discount, index) => {
      if (discount.cantidadMinima <= 0) {
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

      if (discount.precioDescuento && discount.precioDescuento >= formData.precioUnitario) {
        newErrors[`discount_${index}_price`] =
          'El precio con descuento debe ser menor al precio original';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const productData: CreateProductRequest = {
      ...formData,
      descuentosCantidad: discounts.filter(
        (discount) => discount.descuentoPorcentaje || discount.precioDescuento,
      ),
    };

    createProductMutation.mutate(productData);
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
                value={formData.idCategoria}
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
                          <TextField
                            fullWidth
                            label="Cantidad Mínima"
                            type="number"
                            value={discount.cantidadMinima}
                            onChange={(e) =>
                              updateDiscount(index, 'cantidadMinima', e.target.value)
                            }
                            error={!!errors[`discount_${index}_cantidad`]}
                            helperText={errors[`discount_${index}_cantidad`]}
                            inputProps={{ min: 1 }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Descuento %"
                            type="number"
                            value={discount.descuentoPorcentaje || ''}
                            onChange={(e) =>
                              updateDiscount(index, 'descuentoPorcentaje', e.target.value)
                            }
                            error={!!errors[`discount_${index}_percentage`]}
                            helperText={errors[`discount_${index}_percentage`]}
                            inputProps={{ min: 0, max: 99 }}
                            InputProps={{
                              endAdornment: <Typography>%</Typography>,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Precio Fijo"
                            type="number"
                            value={discount.precioDescuento || ''}
                            onChange={(e) =>
                              updateDiscount(index, 'precioDescuento', e.target.value)
                            }
                            error={!!errors[`discount_${index}_price`]}
                            helperText={errors[`discount_${index}_price`]}
                            InputProps={{
                              startAdornment: <Typography>$</Typography>,
                            }}
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
          disabled={createProductMutation.isLoading}
        >
          {createProductMutation.isLoading ? 'Creando...' : 'Crear Producto'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
