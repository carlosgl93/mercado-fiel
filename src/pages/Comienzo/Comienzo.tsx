import { useEffect } from 'react';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import { Text, TextContainer, Title } from '@/components/StyledComponents';
import StyledList from '@/components/StyledList';
import useEntregaApoyo from '@/store/entregaApoyo';
import useRecibeApoyo from '@/store/recibeApoyo';
import { LocalShipping, Security, Star, Verified } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Container, Grid, styled, Typography } from '@mui/material';

const comienzoOptions = [
  {
    text: 'Recibir apoyo',
    url: '/recibe-apoyo',
  },
  {
    text: 'Entregar apoyo',
    url: '/entrega-apoyo',
  },
];

// Styled components for the new sections
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(8, 0),
  textAlign: 'center',
}));

const BenefitCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[10],
  },
}));

const CTASection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  color: 'white',
  padding: theme.spacing(8, 0),
  textAlign: 'center',
}));

const benefits = [
  {
    icon: <Verified sx={{ fontSize: 60, color: '#4CAF50' }} />,
    title: 'Vendedores Verificados',
    description:
      'Todos nuestros vendedores pasan por un proceso riguroso de verificación para garantizar calidad y confianza.',
  },
  {
    icon: <Security sx={{ fontSize: 60, color: '#2196F3' }} />,
    title: 'Transacciones Seguras',
    description: 'Protegemos tus datos y pagos con tecnología de seguridad de última generación.',
  },
  {
    icon: <LocalShipping sx={{ fontSize: 60, color: '#FF9800' }} />,
    title: 'Entrega Rápida',
    description: 'Conectamos compradores y vendedores locales para entregas rápidas y económicas.',
  },
  {
    icon: <Star sx={{ fontSize: 60, color: '#FFC107' }} />,
    title: 'Mejor Precio',
    description:
      'Encuentra los mejores precios del mercado gracias a nuestra amplia red de vendedores.',
  },
];

const categories = [
  { name: 'Electrónicos', icon: '📱', color: '#E3F2FD' },
  { name: 'Ropa y Moda', icon: '👕', color: '#F3E5F5' },
  { name: 'Hogar y Jardín', icon: '🏠', color: '#E8F5E8' },
  { name: 'Deportes', icon: '⚽', color: '#FFF3E0' },
  { name: 'Alimentación', icon: '🍎', color: '#FFEBEE' },
  { name: 'Servicios', icon: '🔧', color: '#E0F2F1' },
];

function Comienzo() {
  const [, { resetRecibeApoyoState }] = useRecibeApoyo();
  const [, { resetEntregaApoyoState }] = useEntregaApoyo();

  useEffect(() => {
    resetRecibeApoyoState();
    resetEntregaApoyoState();
  }, []);

  return (
    <>
      <Meta title="Mercado Fiel - Tu marketplace de confianza" />

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Bienvenido a Mercado Fiel
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
            El marketplace que conecta compradores y vendedores de forma segura y confiable
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
                px: 4,
                py: 1.5,
              }}
              href="/recibe-apoyo"
            >
              Comenzar a Comprar
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                px: 4,
                py: 1.5,
              }}
              href="/entrega-apoyo"
            >
              Vender Productos
            </Button>
          </Box>
        </Container>
      </HeroSection>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
          ¿Por qué elegir Mercado Fiel?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          Conectamos a compradores y vendedores con total confianza y seguridad
        </Typography>

        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <BenefitCard>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>{benefit.icon}</Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </CardContent>
              </BenefitCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
            Categorías Destacadas
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Explora nuestras categorías más populares
          </Typography>

          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <CategoryCard sx={{ bgcolor: category.color }}>
                  <Typography variant="h2" component="div" sx={{ mb: 1 }}>
                    {category.icon}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {category.name}
                  </Typography>
                </CategoryCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <CTASection>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            ¿Listo para comenzar?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Únete a miles de usuarios que ya confían en Mercado Fiel
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
                px: 4,
                py: 1.5,
              }}
              href="/registrar-usuario"
            >
              Registrarse como Comprador
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                px: 4,
                py: 1.5,
              }}
              href="/registrar-prestador"
            >
              Registrarse como Vendedor
            </Button>
          </Box>
        </Container>
      </CTASection>

      {/* Original welcome section for logged users */}
      <FullSizeCenteredFlexBox
        sx={{
          flexDirection: 'column',
          justifyContent: 'start',
          gap: 2,
          pt: 8,
          pb: 4,
          minHeight: '40vh',
        }}
      >
        <TextContainer
          sx={{
            maxWidth: 500,
            textAlign: 'center',
          }}
        >
          <Title
            variant="h4"
            sx={{
              fontSize: '1.8rem',
              mb: 2,
            }}
          >
            ¿Qué quieres hacer hoy?
          </Title>
          <Text
            sx={{
              textAlign: 'center',
              mb: 3,
            }}
          >
            Elige una opción para continuar
          </Text>
        </TextContainer>
        <StyledList items={comienzoOptions} />
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default Comienzo;
