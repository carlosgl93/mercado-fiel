import { Box, Button } from '@mui/material';
import { TextContainer, Title } from '@/components/StyledComponents';
import { recibeApoyoSteps } from './recibeApoyoSteps';
import useRecibeApoyo from '@/store/recibeApoyo';
import ServiceTypeList from './ServiceTypeList';

const Step3 = () => {
  const [{ step, servicio }, { decreaseStep, increaseStep, resetServicio }] = useRecibeApoyo();

  const handleNext = () => {
    increaseStep();
  };

  const handlePrevious = () => {
    resetServicio();
    decreaseStep();
  };

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
      <ServiceTypeList />
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

export default Step3;
