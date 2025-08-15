import { Email, LocationOn, Phone } from '@mui/icons-material';
import { Box, Divider, Grid, Link, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.dark,
        color: 'white',
        p: 4,
        mt: 4,
      }}
    >
      <Grid container spacing={4}>
        {/* Company Info */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Mercado Fiel
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
            La plataforma que conecta proveedores locales con consumidores, promoviendo el comercio
            justo y las compras colaborativas.
          </Typography>
          <Typography variant="body2" color="grey.300">
            © 2025 Mercado Fiel. Todos los derechos reservados.
          </Typography>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Enlaces
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              variant="body2"
              color="inherit"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              Inicio
            </Typography>
            <Typography
              variant="body2"
              color="inherit"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/nosotros')}
            >
              Nosotros
            </Typography>
            <Typography
              variant="body2"
              color="inherit"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/contacto')}
            >
              Contacto
            </Typography>
            <Typography
              variant="body2"
              color="inherit"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/preguntas-frecuentes')}
            >
              FAQ
            </Typography>
          </Box>
        </Grid>

        {/* Services */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Servicios
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
              variant="body2"
              color="inherit"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/recibe-apoyo')}
            >
              Comprar
            </Typography>
            <Typography
              variant="body2"
              color="inherit"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/entrega-apoyo')}
            >
              Vender
            </Typography>
            <Typography
              variant="body2"
              color="inherit"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/registrar-usuario')}
            >
              Registro Comprador
            </Typography>
            <Typography
              variant="body2"
              color="inherit"
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/registrar-prestador')}
            >
              Registro Vendedor
            </Typography>
          </Box>
        </Grid>

        {/* Contact Info */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Contacto
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email sx={{ fontSize: 16 }} />
              <Typography variant="body2">contacto@mercadofiel.cl</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ fontSize: 16 }} />
              <Typography variant="body2">+56 9 1234 5678</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn sx={{ fontSize: 16 }} />
              <Typography variant="body2">Santiago, Chile</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Typography variant="body2" color="grey.300">
          Desarrollado por Benjamín Sepúlveda - Universidad de O'Higgins
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link href="/terms-conditions" color="grey.300" underline="hover" variant="body2">
            Términos y Condiciones
          </Link>
          <Link href="/preguntas-frecuentes" color="grey.300" underline="hover" variant="body2">
            FAQ
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
