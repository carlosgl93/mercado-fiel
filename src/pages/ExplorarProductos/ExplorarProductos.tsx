import { carritoApi, productsApi } from '@/api';
import { useAuth } from '@/hooks/useAuthSupabase';
import { AddCartItemRequest, CartItem } from '@/types/carrito';
import { Product, ProductFilters } from '@/types/products';
import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import {
  Alert,
  AppBar,
  Badge,
  Box,
  Card,
  CardContent,
  Container,
  Drawer,
  Fab,
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
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CartDrawer } from './components/CartDrawer';
import { ProductCard } from './components/ProductCard';
import { ProductFiltersComponent } from './components/ProductFilters';

export const ExplorarProductos: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // State for filters
  const [filters, setFilters] = useState<ProductFilters>({
    disponible: true,
    page: 1,
    limit: 12,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  // State for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

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

  // Query for cart items
  const {
    data: cartData,
    isLoading: loadingCart,
    refetch: refetchCart,
  } = useQuery(
    ['carrito', user?.data.id_usuario],
    () => carritoApi.getCartItems(user!.data.id_usuario),
    {
      enabled: !!user,
    },
  );

  // Mutations for cart operations
  const addToCartMutation = useMutation(
    (data: AddCartItemRequest) => carritoApi.addCartItem(user!.data.id_usuario, data),
    {
      onSuccess: () => {
        setSnackbar({ open: true, message: 'Producto agregado al carrito', severity: 'success' });
        refetchCart();
      },
      onError: () => {
        setSnackbar({
          open: true,
          message: 'Error al agregar producto al carrito',
          severity: 'error',
        });
      },
    },
  );

  const updateCartMutation = useMutation(
    ({ itemId, data }: { itemId: number; data: { cantidad: number } }) =>
      carritoApi.updateCartItem(user!.data.id_usuario, itemId, data),
    {
      onSuccess: () => {
        refetchCart();
      },
      onError: () => {
        setSnackbar({ open: true, message: 'Error al actualizar cantidad', severity: 'error' });
      },
    },
  );

  const removeFromCartMutation = useMutation(
    (itemId: number) => carritoApi.removeCartItem(user!.data.id_usuario, itemId),
    {
      onSuccess: () => {
        setSnackbar({ open: true, message: 'Producto eliminado del carrito', severity: 'success' });
        refetchCart();
      },
      onError: () => {
        setSnackbar({ open: true, message: 'Error al eliminar producto', severity: 'error' });
      },
    },
  );

  // Helper functions
  const handleAddToCart = (product: Product, cantidad = 1) => {
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Debes iniciar sesión para agregar productos al carrito',
        severity: 'error',
      });
      return;
    }

    addToCartMutation.mutate({ id_producto: product.idProducto, cantidad });
  };

  const handleRemoveFromCart = (product: Product, cantidad = 1) => {
    if (!user) return;

    // Find the cart item for this product
    const cartItem = cartData?.data.items.find(
      (item: CartItem) => item.id_producto === product.idProducto,
    );
    if (!cartItem) return;

    const newQuantity = cartItem.cantidad - cantidad;

    if (newQuantity <= 0) {
      // Remove the item completely
      removeFromCartMutation.mutate(cartItem.id_carrito);
    } else {
      // Update the quantity
      updateCartMutation.mutate({
        itemId: cartItem.id_carrito,
        data: { cantidad: newQuantity },
      });
    }
  };

  const handleUpdateCartQuantity = (itemId: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCartMutation.mutate(itemId);
    } else {
      updateCartMutation.mutate({ itemId, data: { cantidad } });
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setFilters((prev) => ({ ...prev, page: value }));
  };

  const getCartItemQuantity = (productId: number): number => {
    const cartItem = cartData?.data.items.find((item: CartItem) => item.id_producto === productId);
    return cartItem?.cantidad || 0;
  };

  const getTotalCartItems = (): number => {
    return (
      cartData?.data.items.reduce((total: number, item: CartItem) => total + item.cantidad, 0) || 0
    );
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
          <IconButton onClick={() => setIsCartOpen(true)} disabled={!user}>
            <Badge badgeContent={getTotalCartItems()} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
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
                    cartQuantity={getCartItemQuantity(product.idProducto)}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                    disabled={!user || addToCartMutation.isLoading || updateCartMutation.isLoading}
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

      {/* Cart Drawer */}
      <Drawer anchor="right" open={isCartOpen} onClose={() => setIsCartOpen(false)}>
        <CartDrawer
          cartData={cartData?.data}
          isLoading={loadingCart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={(itemId: number) => removeFromCartMutation.mutate(itemId)}
          onClose={() => setIsCartOpen(false)}
          isUpdating={updateCartMutation.isLoading || removeFromCartMutation.isLoading}
        />
      </Drawer>

      {/* Mobile Cart FAB */}
      {isMobile && user && getTotalCartItems() > 0 && (
        <Fab
          color="primary"
          onClick={() => setIsCartOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <Badge badgeContent={getTotalCartItems()} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </Fab>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        message={snackbar.message}
      />
    </Box>
  );
};
