import { CartItemsData } from '@/types/carrito';
import { formatCurrency } from '@/utils/formatters';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import React from 'react';

interface CartDrawerProps {
  cartData?: CartItemsData;
  isLoading: boolean;
  onUpdateQuantity: (itemId: number, cantidad: number) => void;
  onRemoveItem: (itemId: number) => void;
  onClose: () => void;
  isUpdating?: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  cartData,
  isLoading,
  onUpdateQuantity,
  onRemoveItem,
  onClose,
  isUpdating = false,
}) => {
  const isEmpty = !cartData?.items.length;

  const handleIncreaseQuantity = (itemId: number, currentQuantity: number) => {
    onUpdateQuantity(itemId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (itemId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      onUpdateQuantity(itemId, currentQuantity - 1);
    } else {
      onRemoveItem(itemId);
    }
  };

  return (
    <Box
      sx={{
        width: { xs: '100vw', sm: 400 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCartIcon color="primary" />
          <Typography variant="h6" component="h2">
            Carrito de Compras
          </Typography>
        </Box>
        <IconButton onClick={onClose} edge="end">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {isLoading ? (
          <Box sx={{ p: 2 }}>
            {Array.from(new Array(3)).map((_, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Skeleton variant="rectangular" width="100%" height={80} />
              </Box>
            ))}
          </Box>
        ) : isEmpty ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              p: 4,
              textAlign: 'center',
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Tu carrito está vacío
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Agrega algunos productos para comenzar
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {cartData.items.map((item) => (
              <ListItem
                key={item.id_carrito}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  p: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                  <ListItemAvatar>
                    <Avatar
                      src={item.producto.imagenUrl || '/images/product-placeholder.png'}
                      alt={item.producto.nombreProducto}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {item.producto.nombreProducto}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {item.producto.proveedor?.nombreNegocio || 'Proveedor'}
                      </Typography>
                    }
                    sx={{ ml: 1, mr: 1 }}
                  />

                  <IconButton
                    size="small"
                    onClick={() => onRemoveItem(item.id_carrito)}
                    disabled={isUpdating}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Price and discount info */}
                <Box sx={{ mt: 1, ml: 8 }}>
                  {item.descuento_aplicado ? (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: 'line-through' }}
                        >
                          {formatCurrency(item.producto.precioUnitario)}
                        </Typography>
                        <Chip
                          label={`-${item.descuento_aplicado.descuento_porcentaje}%`}
                          color="success"
                          size="small"
                        />
                      </Box>
                      <Typography variant="body1" color="primary.main" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(item.precio_final)}
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        Ahorras {formatCurrency(item.ahorro)}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body1" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(item.precio_final)}
                    </Typography>
                  )}
                </Box>

                {/* Quantity controls */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 2,
                    ml: 8,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDecreaseQuantity(item.id_carrito, item.cantidad)}
                      disabled={isUpdating}
                      sx={{
                        border: 1,
                        borderColor: 'primary.main',
                        '&:hover': { bgcolor: 'primary.light' },
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>

                    <Typography
                      variant="body1"
                      sx={{
                        minWidth: 40,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.cantidad}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() => handleIncreaseQuantity(item.id_carrito, item.cantidad)}
                      disabled={isUpdating}
                      sx={{
                        border: 1,
                        borderColor: 'primary.main',
                        '&:hover': { bgcolor: 'primary.light' },
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(item.subtotal)}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Footer with summary */}
      {!isEmpty && cartData && (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 0,
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                Subtotal ({cartData.resumen.cantidad_productos} productos)
              </Typography>
              <Typography variant="body2">{formatCurrency(cartData.resumen.subtotal)}</Typography>
            </Box>

            {cartData.resumen.total_ahorro > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="success.main">
                  Descuentos
                </Typography>
                <Typography variant="body2" color="success.main">
                  -{formatCurrency(cartData.resumen.total_ahorro)}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="primary.main">
                {formatCurrency(cartData.resumen.total)}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={isUpdating}
            sx={{
              borderRadius: '20px',
              py: 1.5,
            }}
          >
            Proceder al Pago
          </Button>
        </Paper>
      )}
    </Box>
  );
};
