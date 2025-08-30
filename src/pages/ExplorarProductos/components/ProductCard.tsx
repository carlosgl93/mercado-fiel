import { Product } from '@/types/products';
import { formatCurrency } from '@/utils/formatters';
import {
  Add as AddIcon,
  LocalOffer as LocalOfferIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (product: Product, cantidad: number) => void;
  onRemoveFromCart?: (product: Product, cantidad: number) => void;
  disabled?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQuantity,
  onAddToCart,
  onRemoveFromCart,
  disabled = false,
}) => {
  const theme = useTheme();

  // Calculate if there are quantity discounts
  const hasDiscounts = product.descuentosCantidad && product.descuentosCantidad.length > 0;
  const bestDiscount = hasDiscounts
    ? Math.max(...(product.descuentosCantidad?.map((d) => d.descuentoPorcentaje || 0) || []))
    : 0;

  // Find the applicable discount for current cart quantity
  const applicableDiscount = product.descuentosCantidad?.find(
    (discount) => cartQuantity >= discount.cantidadMinima,
  );

  const finalPrice = applicableDiscount
    ? product.precioUnitario * (1 - (applicableDiscount.descuentoPorcentaje || 0) / 100)
    : product.precioUnitario;

  const savings = applicableDiscount ? product.precioUnitario - finalPrice : 0;

  const handleAddToCart = () => {
    onAddToCart(product, 1);
  };

  const handleIncreaseQuantity = () => {
    onAddToCart(product, 1);
  };

  const handleDecreaseQuantity = () => {
    if (onRemoveFromCart) {
      onRemoveFromCart(product, 1);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      {/* Product Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.imagenUrl || '/images/product-placeholder.png'}
          alt={product.nombreProducto}
          sx={{
            objectFit: 'cover',
          }}
        />

        {/* Discount Badge */}
        {hasDiscounts && (
          <Chip
            icon={<LocalOfferIcon />}
            label={`Hasta ${bestDiscount}% OFF`}
            color="secondary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontWeight: 'bold',
            }}
          />
        )}

        {/* Stock Status */}
        {!product.disponible && (
          <Chip
            label="Agotado"
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Product Name */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            mb: 1,
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.nombreProducto}
        </Typography>

        {/* Supplier */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.proveedor?.nombreNegocio || 'Proveedor'}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.descripcion}
        </Typography>

        {/* Price Section */}
        <Box sx={{ mb: 2 }}>
          {applicableDiscount ? (
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                {formatCurrency(product.precioUnitario)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(finalPrice)}
                </Typography>
                <Chip
                  label={`-${applicableDiscount.descuentoPorcentaje}%`}
                  color="success"
                  size="small"
                />
              </Box>
              <Typography variant="caption" color="success.main">
                Ahorras {formatCurrency(savings)}
              </Typography>
            </Box>
          ) : (
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(product.precioUnitario)}
            </Typography>
          )}
        </Box>

        {/* Unit */}
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Por unidad
        </Typography>

        {/* Stock - Note: Stock field not available in current Product type */}
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Disponible
        </Typography>
      </CardContent>

      {/* Add to Cart Section */}
      <Box sx={{ p: 2, pt: 0 }}>
        {cartQuantity > 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={handleDecreaseQuantity}
                disabled={disabled}
                sx={{
                  border: 1,
                  borderColor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.light' },
                }}
              >
                <RemoveIcon />
              </IconButton>

              <Typography
                variant="body1"
                sx={{
                  minWidth: 40,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                {cartQuantity}
              </Typography>

              <IconButton
                size="small"
                onClick={handleIncreaseQuantity}
                disabled={disabled}
                sx={{
                  border: 1,
                  borderColor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.light' },
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>

            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(finalPrice * cartQuantity)}
            </Typography>
          </Box>
        ) : (
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddToCart}
            disabled={disabled || !product.disponible}
            startIcon={<ShoppingCartIcon />}
            sx={{
              borderRadius: '20px',
              py: 1,
            }}
          >
            Agregar al carrito
          </Button>
        )}

        {/* Next discount hint */}
        {hasDiscounts && cartQuantity > 0 && (
          <Box sx={{ mt: 1 }}>
            {(() => {
              const nextDiscount = product.descuentosCantidad?.find(
                (discount) => discount.cantidadMinima > cartQuantity,
              );

              if (nextDiscount) {
                const needed = nextDiscount.cantidadMinima - cartQuantity;
                return (
                  <Typography variant="caption" color="info.main">
                    Agrega {needed} más para {nextDiscount.descuentoPorcentaje}% de descuento
                  </Typography>
                );
              }
              return null;
            })()}
          </Box>
        )}
      </Box>
    </Card>
  );
};
