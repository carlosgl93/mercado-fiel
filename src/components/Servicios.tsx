import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Title } from './StyledComponents';

const content = [
  {
    title: 'Soporte terapéutico',
    image: `/images/terapeutico.jpg`,
  },
  {
    title: 'Servicios de enfermería',
    image: `/images/enfermeria.jpg`,
  },
  {
    title: 'Cuidadora',
    image: `/images/cuidadora.jpg`,
  },
  {
    title: 'Sana compañía',
    image: `/images/sana-compania.jpg`,
  },
];

function Servicios() {
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
        Cómo puedes usar Mercado Fiel
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
            flexDirection: 'column',
            alignItems: 'center',
            mb: '1rem',
            textAlign: 'center',
            width: {
              xs: '100%',
              md: 'auto',
            },
          }}
        ></Box>
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
              xs: '2rem',
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
                    xs: '2rem',
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
                    src={item.image}
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
          mt: {
            md: 0,
          },
        }}
      >
        <Link to={'/comienzo'}>
          <Button
            variant="contained"
            sx={{
              p: '1rem',
              px: '2rem',
              borderRadius: '1000em',
              width: '100%',
            }}
          >
            Regístrate para recibir apoyo
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

export default Servicios;
