import { ShoppingCart as ShoppingCartIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { Alert, Box, Button, Paper, Typography } from '@mui/material';
import React from 'react';
import { CartControls } from './CartControls';
import { PriceBreakdown } from './PriceBreakdown';

interface PurchasePanelProps {
  product: any;
  cartQuantity: number;
  currentPrice: number;
  totalPrice: number;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  formatCurrency: (amount: number) => string;
}

export const PurchasePanel: React.FC<PurchasePanelProps> = ({
  product,
  cartQuantity,
  currentPrice,
  totalPrice,
  onAddToCart,
  onRemoveFromCart,
  formatCurrency,
}) => {
  return (
    <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
      <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
        Agregar al Carrito
      </Typography>

      {/* Cart controls */}
      <Box sx={{ mb: 3 }}>
        {cartQuantity > 0 ? (
          <CartControls
            cartQuantity={cartQuantity}
            product={product}
            onAdd={onAddToCart}
            onRemove={onRemoveFromCart}
          />
        ) : (
          <Button
            variant="contained"
            fullWidth
            onClick={onAddToCart}
            disabled={!product.disponible}
            startIcon={<ShoppingCartIcon />}
            sx={{ borderRadius: '20px', py: 1.5, mb: 2 }}
          >
            Agregar al carrito
          </Button>
        )}
      </Box>

      <PriceBreakdown
        product={product}
        cartQuantity={cartQuantity}
        currentPrice={currentPrice}
        totalPrice={totalPrice}
        formatCurrency={formatCurrency}
      />

      {cartQuantity > 0 && (
        <Button variant="outlined" fullWidth size="large">
          Proceder al Pago
        </Button>
      )}

      {product.descuentosCantidad && product.descuentosCantidad.length > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <TrendingUpIcon sx={{ fontSize: 16, mr: 1 }} />
          ¡Compra más y ahorra! Ver descuentos por volumen arriba.
        </Alert>
      )}
    </Paper>
  );
};