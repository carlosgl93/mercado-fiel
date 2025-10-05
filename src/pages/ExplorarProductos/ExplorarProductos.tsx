import { productsApi } from '@/api';
import { useShoppingCartService } from '@/services/shoppingCartService';
import { Product, ProductFilters } from '@/types/products';
import { FilterList as FilterListIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  Alert,
  AppBar,
  Box,
  Card,
  CardContent,
  Container,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Skeleton,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { ProductCard } from './components/ProductCard';
import { ProductFiltersComponent } from './components/ProductFilters';

export const ExplorarProductos: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    addProductToCart,
    removeProductFromCart,
    getProductQuantityInCart,
    cartItems,
    snackbar,
    closeSnackbar,
  } = useShoppingCartService();

  // State for filters
  const [filters, setFilters] = useState<ProductFilters>({
    disponible: true,
    page: 1,
    limit: 12,
    sortBy: 'created_at',
    sortOrder: 'desc',
    elegibleCompraColectiva: true,
  });

  // State for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchTerm || undefined, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query for products
  const {
    data: productsData,
    isLoading: loadingProducts,
    error: productsError,
  } = useQuery(['productos', filters], () => productsApi.getProducts(filters), {
    keepPreviousData: true,
  });

  console.log({ productsData });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };

  const handleAddToCartProduct = (product: Product, cantidad = 1) => {
    addProductToCart(product, cantidad);
  };

  const handleRemoveFromCartProduct = (product: Product, cantidad = 1) => {
    removeProductFromCart(product, cantidad);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header with search and cart */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 'bold' }}
          >
            Explorar Productos
          </Typography>

          {/* Search bar */}
          <TextField
            size="small"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: isMobile ? 200 : 300,
              mr: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Filters button */}
          <IconButton onClick={() => setIsFiltersOpen(true)} sx={{ mr: 1 }}>
            <FilterListIcon />
          </IconButton>

          {/* Cart button */}
          {/* <ShoppingCartButton /> */}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Products Grid */}
        {loadingProducts ? (
          <Grid container spacing={3}>
            {Array.from(new Array(12)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card>
                  <Skeleton variant="rectangular" width="100%" height={200} />
                  <CardContent>
                    <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : productsError ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error al cargar los productos. Por favor intenta nuevamente.
          </Alert>
        ) : !productsData?.data.productos.length ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No se encontraron productos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Intenta ajustar los filtros de búsqueda
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {productsData.data.productos.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.idProducto}>
                  <ProductCard
                    product={product}
                    cartQuantity={getProductQuantityInCart(product.idProducto)}
                    onAddToCart={handleAddToCartProduct}
                    onRemoveFromCart={handleRemoveFromCartProduct}
                    disabled={false}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {productsData.data.pagination.pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={productsData.data.pagination.pages}
                  page={productsData.data.pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? 'small' : 'medium'}
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Filters Drawer */}
      <Drawer anchor="right" open={isFiltersOpen} onClose={() => setIsFiltersOpen(false)}>
        <ProductFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setIsFiltersOpen(false)}
        />
      </Drawer>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
};
