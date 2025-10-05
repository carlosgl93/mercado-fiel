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
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
// Temporarily removing DatePicker due to date-fns compatibility issues
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { es } from 'date-fns/locale';
import React, { useState } from 'react';
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

  const [formData, setFormData] = useState<Omit<CreateCompraColectivaRequest, 'id_producto'>>({
    nombre: `Compra Colectiva - ${product.nombreProducto}`,
    descripcion: '',
    cantidad_objetivo: 100,
    precio_objetivo: Number(product.precioUnitario),
    fecha_fin: '',
    cantidad_inicial: 20, // Default to 20% of 100
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
      },
    }
  );

  const handleClose = () => {
    setFormData({
      nombre: `Compra Colectiva - ${product.nombreProducto}`,
      descripcion: '',
      cantidad_objetivo: 100,
      precio_objetivo: Number(product.precioUnitario),
      fecha_fin: '',
      cantidad_inicial: 20,
    });
    setErrors({});
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.cantidad_objetivo || formData.cantidad_objetivo <= 0) {
      newErrors.cantidad_objetivo = 'La cantidad objetivo debe ser mayor a 0';
    }

    if (!formData.precio_objetivo || formData.precio_objetivo <= 0) {
      newErrors.precio_objetivo = 'El precio objetivo debe ser mayor a 0';
    }

    if (!formData.cantidad_inicial || formData.cantidad_inicial <= 0) {
      newErrors.cantidad_inicial = 'Tu cantidad inicial debe ser mayor a 0';
    }

    // Validate 20% minimum rule
    const minimumRequired = Math.ceil(formData.cantidad_objetivo * 0.2);
    if (formData.cantidad_inicial < minimumRequired) {
      newErrors.cantidad_inicial = `Debes comprometerte a comprar al menos el 20% del objetivo (${minimumRequired} ${product.unitType === 'kg' ? 'kg' : 'unidades'})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const requestData: CreateCompraColectivaRequest = {
      ...formData,
      id_producto: product.idProducto,
    };

    createCampaignMutation.mutate(requestData);
  };

  // Calculate minimum required based on current objetivo
  const minimumRequired = Math.ceil(formData.cantidad_objetivo * 0.2);

  return (
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Typography variant="h6" component="h2">
            Crear Compra Colectiva
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Producto: {product.nombreProducto}
          </Typography>
        </DialogTitle>

        <DialogContent>
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

            {/* Target Quantity */}
            <TextField
              fullWidth
              type="number"
              label={`Cantidad Objetivo (${product.unitType === 'kg' ? 'Kilogramos' : 'Unidades'})`}
              value={formData.cantidad_objetivo}
              onChange={(e) => {
                const newObjetivo = Number(e.target.value);
                setFormData({ 
                  ...formData, 
                  cantidad_objetivo: newObjetivo,
                  // Auto-adjust initial quantity to maintain 20% minimum
                  cantidad_inicial: Math.max(formData.cantidad_inicial, Math.ceil(newObjetivo * 0.2))
                });
              }}
              error={!!errors.cantidad_objetivo}
              helperText={errors.cantidad_objetivo || `Total de ${product.unitType === 'kg' ? 'kilogramos' : 'unidades'} que se quieren comprar en conjunto`}
              required
            />

            {/* Target Price */}
            <TextField
              fullWidth
              type="number"
              label="Precio Unitario Objetivo ($)"
              value={formData.precio_objetivo}
              onChange={(e) => setFormData({ ...formData, precio_objetivo: Number(e.target.value) })}
              error={!!errors.precio_objetivo}
              helperText={errors.precio_objetivo || `Precio por ${product.unitType === 'kg' ? 'kilogramo' : 'unidad'} al alcanzar el objetivo`}
              required
            />

            {/* Initial Quantity (Creator's commitment) */}
            <TextField
              fullWidth
              type="number"
              label={`Tu Compromiso Inicial (${product.unitType === 'kg' ? 'Kilogramos' : 'Unidades'})`}
              value={formData.cantidad_inicial}
              onChange={(e) => setFormData({ ...formData, cantidad_inicial: Number(e.target.value) })}
              error={!!errors.cantidad_inicial}
              helperText={
                errors.cantidad_inicial || 
                `Mínimo requerido: ${minimumRequired} ${product.unitType === 'kg' ? 'kg' : 'unidades'} (20% del objetivo)`
              }
              required
            />

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
                  fecha_fin: dateValue ? new Date(dateValue + 'T23:59:59').toISOString() : '' 
                });
              }}
              helperText="Si no se especifica, la campaña no tendrá límite de tiempo"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().split('T')[0]
              }}
            />

            {/* Business Rules Info */}
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Reglas de la Compra Colectiva:</strong>
              </Typography>
              <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
                <li>Como creador, debes comprometerte a comprar al menos el 20% del objetivo total</li>
                <li>Máximo 5 participantes por campaña</li>
                <li>Los participantes pueden comprar cualquier cantidad disponible</li>
                <li>La campaña se completa al alcanzar la cantidad objetivo</li>
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
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={createCampaignMutation.isLoading}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={createCampaignMutation.isLoading}
          >
            {createCampaignMutation.isLoading ? 'Creando...' : 'Crear Campaña'}
          </Button>
        </DialogActions>
      </Dialog>
  );
};