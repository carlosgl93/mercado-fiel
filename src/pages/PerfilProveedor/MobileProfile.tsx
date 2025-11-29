import Reviews from '@/components/Reviews';
import { trackSupplierProfileView } from '@/services/analyticsService';
import { useShoppingCartService } from '@/services/shoppingCartService';
import { Product } from '@/types/products';
import { Alert, Box, Snackbar, styled } from '@mui/material';
import { useEffect } from 'react';
import { SupplierWithProducts } from '../../models';
import {
  AboutContainer,
  AboutDescription,
  AboutTitle,
  HeroContainer,
  ReviewsContainer,
  StyledAvatar,
  StyledNameContainer,
  StyledTitle,
  Wrapper,
} from './MobilePerfilPrestadorStyledComponents';
import './mobileProfile.css';
import PerfilBackButton from './PerfilBackButton';
import { ProductGrid } from './ProductGrid';

export const SectionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'start',
  width: '100%',
  padding: '2rem 0',
  marginBottom: '3rem',
  [theme.breakpoints.up('sm')]: {
    padding: '3rem 0',
    marginBottom: '4rem',
  },
  [theme.breakpoints.up('md')]: {
    padding: '4rem 0',
    marginBottom: '5rem',
  },
}));

export const SectionTitle = styled(StyledTitle)(({ theme }) => ({
  marginTop: '1rem',
  color: theme.palette.secondary.dark,
  fontSize: '1.5rem',
}));

type MobileProfileProps = {
  proveedor: SupplierWithProducts;
};

export const MobileProfile = ({ proveedor }: MobileProfileProps) => {
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

  // Track supplier profile view
  useEffect(() => {
    if (proveedor?.idProveedor && nombreNegocio) {
      trackSupplierProfileView(proveedor.idProveedor, nombreNegocio, productos?.length || 0);
    }
  }, [proveedor?.idProveedor, nombreNegocio, productos?.length]);

  // Get cart quantities mapping
  const cartQuantities = getCartQuantitiesMap();

  // Cart handlers for Product type with proper IDs
  const handleAddToCart = (product: Product, cantidad: number) => {
    addProductToCart(product, cantidad);
  };

  const handleRemoveFromCart = (product: Product, cantidad: number) => {
    console.log({ product, cantidad });
    removeProductFromCart(product, cantidad);
  };

  return (
    <Wrapper>
      <HeroContainer>
        <PerfilBackButton />
        <StyledAvatar alt={`Imágen de perfil de ${nombreNegocio}`} src={profilePictureUrl || ''} />
        <StyledNameContainer>
          <StyledTitle>{nombreNegocio}</StyledTitle>
        </StyledNameContainer>
        <ReviewsContainer>
          {/* TODO: implement real reviews */}
          <Reviews average={0} total_reviews={0} />
        </ReviewsContainer>
      </HeroContainer>
      <AboutContainer
        sx={{
          px: { xs: 3, sm: 4 },
          py: { xs: 4, sm: 5 },
        }}
      >
        {/* <AboutTitle
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
            fontWeight: 800,
            lineHeight: 1.2,
            mb: { xs: '1.5rem', sm: '2rem' },
            color: 'text.primary',
          }}
        >Descr</AboutTitle> */}
        <AboutDescription
          sx={{
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            lineHeight: { xs: 1.7, sm: 1.8 },
            color: 'text.secondary',
            fontWeight: 400,
            maxWidth: '100%',
          }}
        >
          {descripcion}
        </AboutDescription>
      </AboutContainer>
      <SectionContainer
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 3, sm: 4, md: 5 },
        }}
      >
        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 5 } }}>
          <AboutTitle
            sx={{
              fontSize: { xs: '1.5rem', sm: '2.5rem', md: '2.75rem' },
              fontWeight: 800,
              lineHeight: 1.2,
              color: 'primary.main',
              mb: { xs: 1, sm: 1.5 },
            }}
          >
            Productos Disponibles
          </AboutTitle>
          {/* <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem' },
              color: 'text.secondary',
              lineHeight: 1.6,
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Descubre nuestra selección de productos de calidad
          </Typography> */}
        </Box>
        <ProductGrid
          products={productos}
          cartQuantities={cartQuantities}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          loading={isUpdating}
        />
      </SectionContainer>
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
    </Wrapper>
  );
};
