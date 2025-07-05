import { Box, Button } from '@mui/material';
import { TextContainer, Title } from '@/components/StyledComponents';
import { recibeApoyoSteps } from './recibeApoyoSteps';
import useRecibeApoyo from '@/store/recibeApoyo';
import { useNavigate } from 'react-router-dom';
import SpecialityList from './SpecialityList';
import { useEffect } from 'react';

const Step4 = () => {
  const [{ step, servicio }, { decreaseStep, resetServicio }] = useRecibeApoyo();
  const router = useNavigate();

  const handleNext = () => {
    router('/registrar-usuario');
  };

  const handlePrevious = () => {
    resetServicio();
    decreaseStep();
  };

  useEffect(() => {
    if (!servicio) {
      handlePrevious();
    }
    if (servicio?.serviceName === 'Cuidadora' || servicio?.serviceName === 'Sana Compañía') {
      router('/registrar-usuario');
    }
  }, [servicio?.serviceName]);

  return (
    <>
      <TextContainer
        sx={{
          maxWidth: 500,
          textAlign: 'center',
        }}
      >
        <Title
          variant="h1"
          sx={{
            fontSize: '2rem',
            my: '2.5vh',
          }}
        >
          {recibeApoyoSteps[step].title}
        </Title>
      </TextContainer>
      <SpecialityList />
      <Box
        sx={{
          display: 'flex',
          my: '2.5vh',
          gap: '1rem',
        }}
      >
        <Button variant="contained" onClick={handlePrevious}>
          Atras
        </Button>
        <Button disabled={!servicio} variant="contained" onClick={handleNext}>
          Siguiente
        </Button>
      </Box>
    </>
  );
};

export default Step4;
