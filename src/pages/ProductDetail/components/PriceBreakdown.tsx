import { Box, Divider, Typography } from '@mui/material';
import React from 'react';

interface PriceBreakdownProps {
  product: any;
  cartQuantity: number;
  currentPrice: number;
  totalPrice: number;
  formatCurrency: (amount: number) => string;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  product,
  cartQuantity,
  currentPrice,
  totalPrice,
  formatCurrency,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="body2">Precio unitario:</Typography>
        <Typography variant="body2">{formatCurrency(product.precioUnitario)}</Typography>
      </Box>

      {currentPrice < product.precioUnitario && cartQuantity > 0 && (
        <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="body2" color="primary">
            Precio con descuento:
          </Typography>
          <Typography variant="body2" color="primary" fontWeight="600">
            {formatCurrency(currentPrice)}
          </Typography>
        </Box>
      )}

      {cartQuantity > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6" fontWeight="600">
              Subtotal ({cartQuantity} {product.unitType === 'kg' ? 'kg' : 'unidades'}):
            </Typography>
            <Typography variant="h6" fontWeight="600" color="primary">
              {formatCurrency(totalPrice)}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};