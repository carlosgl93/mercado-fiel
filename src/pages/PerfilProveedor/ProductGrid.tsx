import { Product } from '@/types/products';
import { Box, Container, Grid, Typography } from '@mui/material';
import React from 'react';
import { ProductCard } from '../ExplorarProductos/components/ProductCard';

interface ProductGridProps {
  products: Product[];
  cartQuantities?: Record<number, number>; // Map product ID to quantity
  onAddToCart?: (product: Product, cantidad: number) => void;
  onRemoveFromCart?: (product: Product, cantidad: number) => void;
  loading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  cartQuantities = {},
  onAddToCart,
  onRemoveFromCart,
  loading = false,
}) => {
  if (!products || products.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 6, sm: 8, md: 10 },
          px: { xs: 3, sm: 4, md: 5 },
        }}
      >
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ 
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontWeight: 600,
          }}
        >
          No hay productos disponibles
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            fontSize: { xs: '0.9rem', sm: '1rem' },
            lineHeight: 1.6,
          }}
        >
          Este proveedor aún no ha publicado productos.
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ 
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 2, sm: 3, md: 4 },
    }}>
      <Grid 
        container 
        spacing={{ xs: 3, sm: 4, md: 5 }} 
        sx={{
          mt: 0,
        }}
      >
        {products.map((product) => {
          console.log({product, cartQuantities});
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.idProducto}>
              <ProductCard product={product} disabled={loading} />
            </Grid>
          );})}
      </Grid>
    </Container>
  );
};