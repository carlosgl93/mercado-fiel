import Reviews from '@/components/Reviews';
import { Text, Title } from '@/components/StyledComponents';
import { useShoppingCartService } from '@/services/shoppingCartService';
import { Product } from '@/types/products';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { Alert, Box, Container, Snackbar, Typography } from '@mui/material';
import { SupplierWithProducts } from '../../models';
import {
  StyledAbout,
  StyledAvatar,
  StyledBackButton,
  StyledCTAs,
  StyledHeroBox,
  StyledHeroContent,
  StyledName,
  StyledShortListButton,
} from './DesktopPerfilPrestadorStyledComponents';
import { ProductGrid } from './ProductGrid';
import { styles } from './styles';

type DesktopProfileProps = {
  proveedor: SupplierWithProducts;
};

export const DesktopProfile = ({ proveedor }: DesktopProfileProps) => {
  // Shopping cart functionality
  const {
    addProductToCart,
    removeProductFromCart,
    getCartQuantitiesMap,
    snackbar,
    closeSnackbar,
    isUpdating,
  } = useShoppingCartService();

  const { nombreNegocio, usuario, descripcion, productos } = proveedor;
  const { nombre, profilePictureUrl } = usuario || {};

  // Get cart quantities mapping
  const cartQuantities = getCartQuantitiesMap();

  // Cart handlers for Product type with proper IDs
  const handleAddToCart = (product: Product, cantidad: number) => {
    addProductToCart(product, cantidad);
  };

  const handleRemoveFromCart = (product: Product, cantidad: number) => {
    removeProductFromCart(product, cantidad);
  };

  return (
    <>
      <StyledHeroBox>
        <Box sx={styles.topBar}>
          <StyledBackButton
            variant="contained"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => {
              window.history.back();
            }}
          >
            Atrás
          </StyledBackButton>
        </Box>
        <StyledHeroContent>
          <Box>
            <StyledAvatar
              alt={`Imagen de perfil de ${nombreNegocio}`}
              src={profilePictureUrl || ''}
              sx={{
                width: { md: 150, lg: 180 },
                height: { md: 150, lg: 180 },
                mb: 3,
                border: '4px solid',
                borderColor: 'primary.main',
                boxShadow: 4,
              }}
            />
          </Box>
          <Box sx={{ ml: { md: 4, lg: 6 } }}>
            <StyledName
              sx={{
                fontSize: { md: '2.5rem', lg: '3rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                mb: 3,
                color: 'text.primary',
              }}
            >
              {nombreNegocio}
            </StyledName>
            {/* TODO: implement real reviews */}
            <Box sx={{ mb: 4 }}>
              <Reviews average={0} total_reviews={0} />
            </Box>

            <StyledCTAs sx={{ mt: 4 }}>
              <StyledShortListButton
                startIcon={<BookmarkBorderOutlinedIcon />}
                sx={{
                  borderRadius: 4,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Guardar Proveedor
              </StyledShortListButton>
            </StyledCTAs>
          </Box>
        </StyledHeroContent>
      </StyledHeroBox>

      <StyledAbout sx={{ py: { md: 6, lg: 8 } }}>
        <Container maxWidth="lg">
          <Title
            align="center"
            sx={{
              fontSize: { md: '2.5rem', lg: '3rem' },
              fontWeight: 800,
              lineHeight: 1.2,
              mb: { md: 4, lg: 5 },
              color: 'text.primary',
            }}
          >
            Sobre {nombreNegocio}
          </Title>
          <Text
            align="center"
            sx={{
              fontSize: { md: '1.3rem', lg: '1.4rem' },
              lineHeight: { md: 1.7, lg: 1.8 },
              fontWeight: '400',
              color: 'text.secondary',
              maxWidth: '85%',
              mx: 'auto',
            }}
          >
            {descripcion}
          </Text>
        </Container>
      </StyledAbout>

      {/* Products Section */}
      <Container maxWidth="xl" sx={{ py: { md: 6, lg: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: { md: 5, lg: 6 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { md: '2.5rem', lg: '3rem' },
              fontWeight: 800,
              lineHeight: 1.2,
              color: 'primary.main',
              mb: { md: 2, lg: 3 },
            }}
          >
            Productos Disponibles
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { md: '1.2rem', lg: '1.3rem' },
              color: 'text.secondary',
              lineHeight: 1.6,
              maxWidth: '700px',
              mx: 'auto',
              fontWeight: 400,
            }}
          >
            Explora nuestra cuidadosa selección de productos de la más alta calidad, disponibles
            para agregar directamente a tu carrito
          </Typography>
        </Box>
        <ProductGrid
          products={productos}
          cartQuantities={cartQuantities}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          loading={isUpdating}
        />
      </Container>

      {/* Snackbar for cart notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
