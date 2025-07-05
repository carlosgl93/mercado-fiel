import { ComoFuncionaContent } from '@/pages/Welcome/comoFuncionaContent';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Text, Title } from './StyledComponents';

type ComoFuncionaProps = {
  subtitle: string;
  steps: ComoFuncionaContent[];
};

const ComoFunciona = ({ subtitle, steps }: ComoFuncionaProps) => {
  return (
    <Box
      component="section"
      sx={{
        py: {
          xs: '2.5rem',
        },
        px: {
          xs: '1rem',
          sm: '2rem',
          md: '4rem',
        },
        textAlign: 'center',
        backgroundColor: '#f9f7f6',
      }}
    >
      <Box>
        <Title
          variant="h4"
          color="primary.dark"
          sx={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            mb: 6,
          }}
        >
          ¿Cómo funciona?
        </Title>
        <Text
          variant="subtitle1"
          sx={{
            fontSize: '1.5rem',
          }}
        >
          {subtitle}
        </Text>
        <ul>
          <li>
            <Text>
              {' '}
              Servicios Terapéuticos (Terapia Ocupacional, Kinesiología, Fonoaudiología, Podología y
              más)
            </Text>
          </li>
          <li>
            <Text>Servicios de Enfermería y Técnico en Enfermería (TENS)</Text>
          </li>
          <li>
            <Text>Servicios de Cuidado o Acompañamiento.</Text>
          </li>
        </ul>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
          gap: {
            xs: '2rem',
            md: '4rem',
          },
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mt: '2rem',
        }}
      >
        {steps.map((card, index) => (
          <Box
            key={index}
            sx={{
              width: {
                xs: '100%',
                sm: '30%',
              },
              backgroundColor: 'white',
              borderRadius: '1rem',
              p: '1rem',
              mb: {
                xs: '2rem',
                sm: 0,
              },
              position: 'relative', // Add position relative to the parent Box
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: '1rem',
              }}
            >
              <img
                src={card.image}
                alt={card.imgAlt}
                style={{
                  maxWidth: '10rem',
                  maxHeight: '10rem',
                }}
                loading="lazy"
              />
            </Box>
            <Typography
              variant="h2"
              color="primary.dark"
              sx={{
                fontSize: '2rem',
                fontWeight: 'bold',
                mb: '1rem',
              }}
            >
              {card.title}
            </Typography>
            <Typography variant="body1" sx={{}} color="primary.dark">
              {card.text}
            </Typography>
            <Box
              sx={{
                position: 'absolute', // Add position absolute to the child Box
                top: '-1rem', // Position the Box at the top of the parent Box
                left: '50%', // Position the Box in the center of the parent Box
                transform: 'translateX(-50%)', // Center the Box horizontally
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: '#2eba6d',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.5rem',
              }}
            >
              {index + 1}
            </Box>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          mt: '2rem',
        }}
      >
        <Link to={'/comienzo'}>
          <Button
            variant="contained"
            sx={{
              p: '1rem',
              borderRadius: '1000em',
              width: '10rem',
              fontSize: '1.25rem',
            }}
          >
            Comenzar
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default ComoFunciona;
