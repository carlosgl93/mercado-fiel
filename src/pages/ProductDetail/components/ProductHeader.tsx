import { Box, Button, Typography, alpha } from '@mui/material';
import React from 'react';

interface ProductHeaderProps {
  product: any;
  onNavigateToSupplier: () => void;
  formatCurrency: (amount: number) => string;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  product,
  onNavigateToSupplier,
  formatCurrency,
}) => {
  return (
    <Box display="flex" alignItems="flex-start" gap={3} sx={{ mb: 4 }}>
      <Box
        sx={{
          width: 120,
          height: 120,
          bgcolor: product.imagenUrl ? 'transparent' : alpha('#4CAF4F', 0.1),
          borderRadius: 2,
          backgroundImage: product.imagenUrl ? `url(${product.imagenUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!product.imagenUrl && (
          <Typography variant="h3" color="primary">
            {product.nombreProducto.charAt(0)}
          </Typography>
        )}
      </Box>

      <Box flex={1}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          {product.nombreProducto}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {product.descripcion || 'Sin descripción disponible'}
        </Typography>

        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            {formatCurrency(product.precioUnitario)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            por {product.unitType === 'kg' ? 'kilogramo' : 'unidad'}
          </Typography>
        </Box>

        {/* Supplier Link */}
        <Button
          variant="outlined"
          size="small"
          onClick={onNavigateToSupplier}
        >
          Ver proveedor
        </Button>
      </Box>
    </Box>
  );
};