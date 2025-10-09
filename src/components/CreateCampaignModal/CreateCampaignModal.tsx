import { comprasColectivasApi } from '@/api';
import { CreateCompraColectivaRequest } from '@/types/api/comprasColectivas';
import { Product } from '@/types/products';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
// Temporarily removing DatePicker due to date-fns compatibility issues
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { es } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

interface CreateCampaignModalProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  onSuccess?: () => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  open,
  onClose,
  product,
  onSuccess,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const queryClient = useQueryClient();

  // State for selected discount and user's desired quantity
  const [selectedDiscountIndex, setSelectedDiscountIndex] = useState<number | null>(null);
  const [userDesiredQuantity, setUserDesiredQuantity] = useState<number>();

  const today = new Date();
  const defaultFechaFin = new Date();
  defaultFechaFin.setMonth(today.getMonth() + 1);

  const [formData, setFormData] = useState<
    Omit<CreateCompraColectivaRequest, 'id_producto' | 'id_descuento_aplicado' | 'cantidad_inicial'>
  >({
    nombre: `Compra Colectiva - ${product.nombreProducto}`,
    descripcion: ``,
    fecha_fin: defaultFechaFin.toISOString(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Available discounts from the product
  const availableDiscounts = product.descuentosCantidad || [];

  // Selected discount details
  const selectedDiscount =
    selectedDiscountIndex !== null ? availableDiscounts[selectedDiscountIndex] : null;
  const targetQuantity = selectedDiscount?.cantidadMinima || 0;
  const discountPercentage = selectedDiscount?.descuentoPorcentaje || 0;
  const discountedPrice = selectedDiscount
    ? product.precioUnitario * (1 - discountPercentage / 100)
    : product.precioUnitario;

  // Minimum quantity user must commit (20% of target)
  const minimumUserQuantity = Math.ceil(targetQuantity * 0.2);

  const createCampaignMutation = useMutation(
    (data: CreateCompraColectivaRequest) => comprasColectivasApi.createCompraColectiva(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['collective-products']);
        queryClient.invalidateQueries(['campaigns']);
        onSuccess?.();
        handleClose();
      },
      onError: (error: any) => {
        console.error('Error creating campaign:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
      },
    },
  );

  const handleClose = () => {
    setSelectedDiscountIndex(null);
    setUserDesiredQuantity(0);
    setFormData({
      nombre: `Compra Colectiva - ${product.nombreProducto}`,
      descripcion: '',
      fecha_fin: '',
    });
    setErrors({});
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (selectedDiscountIndex === null) {
      newErrors.discount = 'Debes seleccionar un descuento';
    }

    if (!userDesiredQuantity || userDesiredQuantity <= 0) {
      newErrors.userQuantity = 'Tu cantidad deseada debe ser mayor a 0';
    }

    // Validate 20% minimum rule
    if (selectedDiscount && userDesiredQuantity && userDesiredQuantity < minimumUserQuantity) {
      newErrors.userQuantity = `Debes comprometerte a comprar al menos ${minimumUserQuantity} ${
        product.unitType === 'kg' ? 'kg' : 'unidades'
      } (20% del objetivo de ${targetQuantity})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !selectedDiscount) {
      console.log('Validation failed', errors);
      return;
    }

    const requestData: CreateCompraColectivaRequest = {
      ...formData,
      id_producto: product.idProducto,
      id_descuento_aplicado: selectedDiscount.idDescuento,
      cantidad_inicial: userDesiredQuantity || 0,
    };

    createCampaignMutation.mutate(requestData);
  };

  // Show available discounts info
  const hasDiscounts = availableDiscounts.length > 0;

  useEffect(() => {
    if (selectedDiscount && userDesiredQuantity) {
      const newDescription = `Producto: ${product.nombreProducto}, cantidad objetivo: ${
        selectedDiscount.cantidadMinima
      }, cantidad restante: ${selectedDiscount.cantidadMinima - userDesiredQuantity}`;
      setFormData((prev) => ({ ...prev, descripcion: newDescription }));
    }
  }, [selectedDiscount, userDesiredQuantity]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
      <DialogTitle>
        <Typography variant="h6" component="h2">
          Crear Compra Colectiva
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Producto: {product.nombreProducto}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {!hasDiscounts ? (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Este producto no tiene descuentos por cantidad configurados por el proveedor. No es
              posible crear una compra colectiva para este producto.
            </Typography>
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            {/* Campaign Name */}
            <TextField
              fullWidth
              label="Nombre de la Campaña"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
            />

            {/* Discount Selection */}
            <FormControl fullWidth required error={!!errors.discount}>
              <InputLabel>Seleccionar Descuento</InputLabel>
              <Select
                value={selectedDiscountIndex ?? ''}
                label="Seleccionar Descuento"
                onChange={(e) => {
                  const index = e.target.value as number;
                  setSelectedDiscountIndex(index);
                  // Reset user quantity when changing discount
                  setUserDesiredQuantity(0);
                }}
              >
                {availableDiscounts.map((discount, index) => {
                  const discountPrice =
                    product.precioUnitario * (1 - (discount.descuentoPorcentaje || 0) / 100);
                  const savings = product.precioUnitario - discountPrice;
                  return (
                    <MenuItem key={index} value={index}>
                      <Box>
                        <Typography variant="body1">
                          {discount.descuentoPorcentaje}% de descuento - Mínimo{' '}
                          {discount.cantidadMinima} {product.unitType === 'kg' ? 'kg' : 'unidades'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Precio: ${discountPrice.toLocaleString('es-CL')} (ahorras $
                          {savings.toLocaleString('es-CL')} por{' '}
                          {product.unitType === 'kg' ? 'kg' : 'unidad'})
                        </Typography>
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
              {errors.discount && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {errors.discount}
                </Typography>
              )}
            </FormControl>

            {/* Show selected discount details */}
            {selectedDiscount && (
              <Alert severity="info">
                <Typography variant="body2" gutterBottom>
                  <strong>Descuento seleccionado:</strong> {discountPercentage}% de descuento
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Cantidad objetivo:</strong> {targetQuantity}{' '}
                  {product.unitType === 'kg' ? 'kg' : 'unidades'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Precio con descuento:</strong> ${discountedPrice.toLocaleString('es-CL')}{' '}
                  por {product.unitType === 'kg' ? 'kg' : 'unidad'}
                </Typography>
                <Typography variant="body2">
                  <strong>Tu compromiso mínimo:</strong> {minimumUserQuantity}{' '}
                  {product.unitType === 'kg' ? 'kg' : 'unidades'} (20% del objetivo)
                </Typography>
              </Alert>
            )}

            {/* User's Desired Quantity */}
            {selectedDiscount && (
              <TextField
                fullWidth
                type="number"
                label={`Tu Cantidad Deseada (${
                  product.unitType === 'kg' ? 'Kilogramos' : 'Unidades'
                })`}
                value={userDesiredQuantity}
                onChange={(e) => {
                  if (e.target.value === '0' || e.target.value === '') {
                    setUserDesiredQuantity(undefined);
                    return;
                  }
                  setUserDesiredQuantity(Number(e.target.value));
                }}
                error={!!errors.userQuantity}
                helperText={
                  errors.userQuantity ||
                  `Mínimo requerido: ${minimumUserQuantity} ${
                    product.unitType === 'kg' ? 'kg' : 'unidades'
                  } - Máximo disponible: ${targetQuantity} ${
                    product.unitType === 'kg' ? 'kg' : 'unidades'
                  }`
                }
                inputProps={{
                  min: minimumUserQuantity,
                  max: targetQuantity,
                }}
                required
              />
            )}

            {/* Show estimated cost */}
            {selectedDiscount && userDesiredQuantity && userDesiredQuantity > 0 && (
              <Alert severity="success">
                <Typography variant="body2" gutterBottom>
                  <strong>Tu inversión estimada:</strong> $
                  {(discountedPrice * userDesiredQuantity).toLocaleString('es-CL')}
                </Typography>
                <Typography variant="body2">
                  <strong>Ahorras:</strong> $
                  {(
                    (product.precioUnitario - discountedPrice) *
                    userDesiredQuantity
                  ).toLocaleString('es-CL')}{' '}
                  comparado con el precio normal
                </Typography>
              </Alert>
            )}

            {/* End Date */}
            <TextField
              fullWidth
              type="date"
              label="Fecha de Finalización (Opcional)"
              value={formData.fecha_fin ? formData.fecha_fin.split('T')[0] : ''}
              onChange={(e) => {
                const dateValue = e.target.value;
                setFormData({
                  ...formData,
                  fecha_fin: dateValue ? new Date(dateValue + 'T23:59:59').toISOString() : '',
                });
              }}
              helperText="Si no se especifica, la campaña no tendrá límite de tiempo"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().split('T')[0],
              }}
            />

            {/* Description */}
            <TextField
              fullWidth
              label="Descripción (Opcional)"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              multiline
              rows={3}
              helperText="Describe los beneficios y detalles de esta compra colectiva"
            />

            {/* Business Rules Info */}
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>¿Cómo funciona?</strong>
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>Selecciona el descuento que quieres aprovechar</li>
                <li>Define cuánto quieres comprar (mínimo 20% del objetivo)</li>
                <li>Otros usuarios se pueden unir hasta completar el objetivo</li>
                <li>Una vez completado, todos obtienen el precio con descuento</li>
                <li>Máximo 5 participantes por campaña</li>
              </Typography>
            </Alert>

            {createCampaignMutation.isError && (
              <Alert severity="error">
                {createCampaignMutation.error instanceof Error
                  ? createCampaignMutation.error.message
                  : 'Error al crear la campaña. Intenta nuevamente.'}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={createCampaignMutation.isLoading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={createCampaignMutation.isLoading || !hasDiscounts}
        >
          {createCampaignMutation.isLoading ? 'Creando...' : 'Crear Campaña'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};