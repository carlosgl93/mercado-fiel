import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box sx={{ backgroundColor: 'white', p: '2rem', borderRadius: '1rem', px: '10%' }}>
      <Typography variant="body1">Mercado Fiel © 2025</Typography>
      <Typography variant="body1" color="#232323">
        Más clientes para tus productos, mejores precios para tus comprasd
      </Typography>
    </Box>
  );
}
export default Footer;
