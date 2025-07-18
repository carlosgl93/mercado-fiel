import { Email, LocationOn, Phone } from '@mui/icons-material';
import { Box, Divider, Grid, Link, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#2c3e50',
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
            <Link href="/" color="inherit" underline="hover">
              Inicio
            </Link>
            <Link href="/nosotros" color="inherit" underline="hover">
              Nosotros
            </Link>
            <Link href="/contacto" color="inherit" underline="hover">
              Contacto
            </Link>
            <Link href="/preguntas-frecuentes" color="inherit" underline="hover">
              FAQ
            </Link>
          </Box>
        </Grid>

        {/* Services */}
        <Grid item xs={12} sm={6} md={2}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Servicios
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Link href="/recibe-apoyo" color="inherit" underline="hover">
              Comprar
            </Link>
            <Link href="/entrega-apoyo" color="inherit" underline="hover">
              Vender
            </Link>
            <Link href="/registrar-usuario" color="inherit" underline="hover">
              Registro Comprador
            </Link>
            <Link href="/registrar-prestador" color="inherit" underline="hover">
              Registro Vendedor
            </Link>
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
