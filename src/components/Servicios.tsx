import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { Title } from './StyledComponents';

const content = [
  {
    title: 'Conecta con clientes y proveedores',
    smImage: `/images/exposicion-oportunidad-sm.jpg`,
    mdImage: `/images/exposicion-oportunidad-md-lg.jpg`,
  },
  {
    title: 'Ahorra en compras grupales',
    smImage: `/images/ahorra-comprando-en-grupo-sm.jpg`,
    mdImage: `/images/ahorra-comprando-en-grupo-md-lg.jpg`,
  },
  {
    title: 'Apoya el comercio local',
    smImage: `/images/apoya-el-comercio-local-sm.jpg`,
    mdImage: `/images/apoya-el-comercio-local-md-lg.jpg`,
  },
];

function Servicios() {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: {
          xs: '2rem',
          sm: 0,
        },
        gap: '2rem',

        px: {
          xs: '2rem',
          sm: '5rem',
        },
        py: {
          xs: '2rem',
          sm: '5rem',
        },
        backgroundColor: 'white',
      }}
    >
      <Title variant="h2" fontWeight="bold" textAlign="center">
        ¿Por qué usar Mercado Fiel?
      </Title>
      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
          justifyContent: 'center',
          alignItems: 'center',
          p: {
            xs: '1rem',
            sm: '2rem',
          },
          backgroundColor: 'white',
          borderRadius: '1rem',
          mb: {
            xs: '2rem',
            sm: 0,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              md: 'row',
            },
            justifyContent: 'center',
            alignItems: 'center',
            width: {
              xs: '100%',
              md: 'auto',
            },
            mt: {
              xs: '1rem',
              md: 0,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              mb: {
                sm: 0,
              },
            }}
          >
            {content.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  //   align all items to the start (flex-start)
                  alignItems: 'center',
                  mb: {
                    xs: '1rem',
                    sm: 0,
                  },
                  width: {
                    xs: '100%',
                    sm: '45%',
                    md: '30%',
                    lg: '20%',
                  },
                }}
              >
                <Box
                  sx={{
                    width: '10rem',
                    height: '10rem',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    mb: '1rem',
                  }}
                >
                  <img
                    src={isMobile ? item.smImage : item.mdImage}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <Typography
                  variant="h5"
                  color="primary.main"
                  fontWeight="500"
                  sx={{ textAlign: 'center' }}
                >
                  {item.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: {
            xs: '100%',
            md: '50%',
          },
          textAlign: 'center',
        }}
      >
        <Link to={'/comienzo'}>
          <Button
            variant="contained"
            sx={{
              p: '1rem',
              borderRadius: '1000em',
              width: '100%',
            }}
          >
            Empieza a vender o comprar mejor
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

export default Servicios;
