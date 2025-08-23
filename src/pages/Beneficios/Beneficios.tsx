import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserLookingFor } from '../../hooks';
import { BeneficiosConstants } from './BeneficiosConstants';

export const Beneficios = () => {
  const { translatedLookingFor } = useUserLookingFor();
  const navigate = useNavigate();

  console.log({ lookingFor: translatedLookingFor() });

  const clientesSectionRef = useRef<HTMLDivElement>(null);
  const proveedoresSectionRef = useRef<HTMLDivElement>(null);
  const { clientesBeneficios, proveedoresBeneficios, styles } = BeneficiosConstants();

  // Auto-scroll based on translatedLookingFor
  useEffect(() => {
    const lookingFor = translatedLookingFor();
    if (lookingFor === 'Proveedores' && clientesSectionRef.current) {
      clientesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (lookingFor === 'Clientes' && proveedoresSectionRef.current) {
      proveedoresSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [translatedLookingFor]);

  return (
    <Box sx={styles.root}>
      {/* Sección Clientes */}
      <Container ref={clientesSectionRef} maxWidth="xl" sx={styles.section}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6} order={{ xs: 2, sm: 2, md: 1 }}>
            <Box sx={styles.gridTextBox}>
              <Typography variant="h2" component="h1" sx={styles.heading}>
                Compra fácil,
                <br />
                ahorra más
              </Typography>
              <Typography variant="h6" sx={styles.subheading}>
                Encuentra productos frescos y de calidad directamente de los mejores proveedores
              </Typography>
              <Box sx={styles.beneficiosBox}>
                {clientesBeneficios.map((beneficio, index) => (
                  <Box key={index} sx={styles.beneficioItem}>
                    {beneficio.icon}
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {beneficio.title}
                    </Typography>
                  </Box>
                ))}
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/registrar-usuario')}
                  sx={styles.button}
                >
                  Registrarme como Cliente
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <Box sx={styles.gridImage1}>
              <img
                src="/images/woman-with-groceries.jpeg"
                alt="Mujer sonriente con bolsa de compras con productos frescos"
                style={
                  styles.image as DetailedHTMLProps<
                    ImgHTMLAttributes<HTMLImageElement>,
                    HTMLImageElement
                  >
                }
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
      {/* Sección Proveedores */}
      <Container ref={proveedoresSectionRef} maxWidth="xl" sx={styles.sectionWhite}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={styles.gridImage2}>
              <img
                src="/images/farmer-with-tomatoes.jpeg"
                alt="Hombre sonriente con delantal verde sosteniendo caja de tomates"
                style={
                  styles.image as DetailedHTMLProps<
                    ImgHTMLAttributes<HTMLImageElement>,
                    HTMLImageElement
                  >
                }
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={styles.gridTextBoxRight}>
              <Typography variant="h2" component="h1" sx={styles.heading}>
                Vende más,
                <br />
                llega más
                <br />
                lejos
              </Typography>
              <Typography variant="h6" sx={styles.subheading}>
                Conecta con nuevos clientes y aumenta tus ingresos con facilidad
              </Typography>
              <Box sx={styles.beneficiosBox}>
                {proveedoresBeneficios.map((beneficio, index) => (
                  <Box key={index} sx={styles.beneficioItem}>
                    {beneficio.icon}
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {beneficio.title}
                    </Typography>
                  </Box>
                ))}
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/registrar-proveedor')}
                  sx={styles.button}
                >
                  Registrarme como Vendedor
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
