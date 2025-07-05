import { TextContainer, Title } from '@/components/StyledComponents';
import { entregaApoyoSteps } from './entregaApoyoSteps';
import ServiceTypeList from './ServiceTypeList';
import useEntregaApoyo from '@/store/entregaApoyo';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Step2 = () => {
  const [{ selectedServicio }, { decreaseStep, increaseStep }] = useEntregaApoyo();
  const router = useNavigate();

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
          {entregaApoyoSteps[1].title}
        </Title>
      </TextContainer>
      <ServiceTypeList />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          my: '2.5vh',
          gap: '5vw',
        }}
      >
        <Button variant="contained" onClick={decreaseStep}>
          Atras
        </Button>
        <Button
          disabled={selectedServicio === null}
          variant="contained"
          onClick={
            selectedServicio?.serviceName === 'Cuidadora' ||
            selectedServicio?.serviceName === 'Sana Compañía'
              ? () => router('/registrar-prestador')
              : increaseStep
          }
        >
          Siguiente
        </Button>
      </Box>
    </>
  );
};

export default Step2;
