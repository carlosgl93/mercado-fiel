import { productsApi } from '@/api';
import { useAuth } from '@/hooks/useAuthSupabase';
import { Product, ProductFilters } from '@/types/products';
import { formatCurrency } from '@/utils/formatters';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocalOffer as LocalOfferIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

interface ProductsListProps {
  filters: ProductFilters;
  onEdit: (product: Product) => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({ filters, onEdit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { supplier } = useAuth();
  const queryClient = useQueryClient();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Get provider ID from supplier profile
  const providerId = supplier?.idProveedor;

  // Query for products
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', 'provider', providerId, filters],
    queryFn: () =>
      productsApi.getProducts({
        ...filters,
        proveedor: providerId?.toString(),
      }),
    enabled: !!providerId,
  });

  // Mutation for toggling availability
  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, disponible }: { id: number; disponible: boolean }) =>
      productsApi.toggleAvailability(id, disponible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseMenu();
    },
  });

  // Mutation for deleting product
  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      handleCloseMenu();
    },
  });

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, product: Product) => {
    setMenuAnchor(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedProduct(null);
  };

  const handleToggleAvailability = () => {
    if (selectedProduct) {
      toggleAvailabilityMutation.mutate({
        id: selectedProduct.idProducto,
        disponible: !selectedProduct.disponible,
      });
    }
  };

  const handleDeleteProduct = () => {
    if (selectedProduct && window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      deleteProductMutation.mutate(selectedProduct.idProducto);
    }
  };

  const handleEditProduct = () => {
    if (selectedProduct) {
      onEdit(selectedProduct);
      handleCloseMenu();
    }
  };

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton height={32} />
                <Skeleton height={24} />
                <Skeleton height={20} width="60%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error al cargar los productos. Por favor intenta nuevamente.
      </Alert>
    );
  }

  const products = productsResponse?.data.productos || [];

  if (products.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={8}
        textAlign="center"
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay productos disponibles
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {filters.disponible === false
            ? 'No tienes productos inactivos'
            : filters.disponible === true
            ? 'No tienes productos activos'
            : 'Comienza agregando tu primer producto'}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {products.map((product: Product) => (
          <Grid item xs={12} sm={6} md={4} key={product.idProducto}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {/* Product Image */}
              {product.imagenUrl ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imagenUrl}
                  alt={product.nombreProducto}
                  sx={{ objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'grey.100',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Sin imagen
                  </Typography>
                </Box>
              )}

              {/* Menu Button */}
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' },
                }}
                onClick={(e) => handleOpenMenu(e, product)}
              >
                <MoreVertIcon />
              </IconButton>

              <CardContent sx={{ flexGrow: 1 }}>
                {/* Product Status */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Chip
                    label={product.disponible ? 'Activo' : 'Inactivo'}
                    color={product.disponible ? 'success' : 'default'}
                    size="small"
                  />
                  {product.descuentosCantidad && product.descuentosCantidad.length > 0 && (
                    <Chip
                      icon={<LocalOfferIcon />}
                      label="Con descuentos"
                      color="secondary"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>

                {/* Product Name */}
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {product.nombreProducto}
                </Typography>

                {/* Product Description */}
                {product.descripcion && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {product.descripcion}
                  </Typography>
                )}

                {/* Price */}
                <Typography variant="h6" color="primary" gutterBottom>
                  {formatCurrency(Number(product.precioUnitario))}
                </Typography>

                {/* Category */}
                {product.categoria && (
                  <Typography variant="body2" color="text.secondary">
                    Categoría: {product.categoria.nombre}
                  </Typography>
                )}

                {/* Quantity Discounts Info */}
                {product.descuentosCantidad && product.descuentosCantidad.length > 0 && (
                  <Typography variant="body2" color="secondary" sx={{ mt: 1 }}>
                    {product.descuentosCantidad.length} descuento(s) por cantidad
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEditProduct}>
          <EditIcon sx={{ mr: 1 }} />
          Editar
        </MenuItem>

        <MenuItem onClick={handleToggleAvailability}>
          {selectedProduct?.disponible ? (
            <>
              <VisibilityOffIcon sx={{ mr: 1 }} />
              Desactivar
            </>
          ) : (
            <>
              <VisibilityIcon sx={{ mr: 1 }} />
              Activar
            </>
          )}
        </MenuItem>

        <MenuItem onClick={handleDeleteProduct} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>
    </>
  );
};
