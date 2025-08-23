import {
  AccessTimeOutlined,
  GroupAddOutlined,
  HandymanOutlined,
  PercentOutlined,
  SellOutlined,
  ShoppingBasketOutlined,
  TrendingUp,
  VerifiedUserOutlined,
} from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { useMemo } from 'react';
import { Beneficio } from './types';

export const BeneficiosConstants = () => {
  const theme = useTheme();

  const styles = {
    root: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
    benefitIcon: { fontSize: 40, color: theme.palette?.success.main },
    section: { py: { xs: 6, md: 12 }, backgroundColor: 'white' },
    sectionWhite: { py: { xs: 6, md: 12 }, backgroundColor: 'white' },
    gridTextBox: { pr: { md: 4 } },
    gridTextBoxRight: { pl: { md: 4 } },
    heading: {
      fontWeight: 'bold',
      mb: 3,
      fontSize: { xs: '2rem', md: '3rem' },
      color: 'text.primary',
      mx: { xs: '1rem', md: '2rem' },
    },
    subheading: {
      mb: 4,
      color: 'text.secondary',
      lineHeight: 1.6,
      mx: { xs: '1rem', md: '2rem' },
    },
    beneficiosBox: {
      mb: 4,
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'center',
    },
    beneficioItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'initial',
      mx: { xs: '3rem' },
      mb: 2,
      gap: { xs: 4 },
    },
    button: {
      backgroundColor: theme.palette?.success.main,
      color: 'white',
      mt: 3,
      py: 2,
      px: 4,
      fontSize: '1.1rem',
      fontWeight: 'bold',
      borderRadius: 2,
      '&:hover': {
        backgroundColor: theme.palette?.success.dark,
      },
    },
    gridImage1: {
      width: '100%',
      height: '100%',
      borderRadius: 2,
      overflow: 'hidden',
    },
    gridImage2: {
      width: '100%',
      height: '100%',
      borderRadius: 2,
      overflow: 'hidden',
      backgroundColor: 'white',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  };

  const clientesBeneficios: Beneficio[] = useMemo(
    () => [
      {
        icon: <SellOutlined sx={styles.benefitIcon} />,
        title: 'Mejores precios',
        description:
          'Encuentra productos frescos y de calidad directamente de los mejores proveedores',
      },
      {
        icon: <ShoppingBasketOutlined sx={styles.benefitIcon} />,
        title: 'Variedad de productos',
        description: 'Accede a una amplia gama de productos locales',
      },
      {
        icon: <PercentOutlined sx={styles.benefitIcon} />,
        title: 'Ofertas exclusivas',
        description: 'Disfruta de descuentos especiales por compras grupales',
      },
      {
        icon: <VerifiedUserOutlined sx={styles.benefitIcon} />,
        title: 'Seguridad en tus compras',
        description: 'Compra con confianza en nuestra plataforma segura',
      },
    ],
    [],
  );

  const proveedoresBeneficios: Beneficio[] = useMemo(
    () => [
      {
        icon: <TrendingUp sx={styles.benefitIcon} />,
        title: 'Más visibilidad',
        description: 'Conecta con nuevos clientes y aumenta tus ingresos con facilidad',
      },
      {
        icon: <GroupAddOutlined sx={styles.benefitIcon} />,
        title: 'Acceso a más clientes',
        description: 'Llega a una audiencia más amplia',
      },
      {
        icon: <AccessTimeOutlined sx={styles.benefitIcon} />,
        title: 'Ventas 24/7',
        description: 'Tu negocio abierto las 24 horas del día',
      },
      {
        icon: <HandymanOutlined sx={styles.benefitIcon} />,
        title: 'Herramientas para tu negocio',
        description: 'Visualización de estadísticas, promociones, y más.',
      },
    ],
    [],
  );

  return {
    clientesBeneficios,
    proveedoresBeneficios,
    styles,
  };
};
