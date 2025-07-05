import { TextContainer, Title } from '@/components/StyledComponents';
import { entregaApoyoSteps } from './entregaApoyoSteps';
import SpecialityList from './SpecialityList';
import useEntregaApoyo from '@/store/entregaApoyo';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Step3 = () => {
  const [{ especialidadesFromServicio, selectedEspecialidad }, { decreaseStep }] =
    useEntregaApoyo();
  const router = useNavigate();

  return (
    <>
      <TextContainer
        sx={{
          maxWidth: 500,
          textAlign: 'center',
          my: '2.5vh',
        }}
      >
        <Title
          variant="h1"
          sx={{
            fontSize: '2rem',
          }}
        >
          {entregaApoyoSteps[2].title}
        </Title>
      </TextContainer>
      <SpecialityList items={especialidadesFromServicio} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '5vw',
          my: '2.5vh',
        }}
      >
        <Button variant="contained" onClick={decreaseStep}>
          Atras
        </Button>
        <Button
          disabled={selectedEspecialidad === null}
          variant="contained"
          onClick={() => router('/registrar-prestador')}
        >
          Siguiente
        </Button>
      </Box>
    </>
  );
};

export default Step3;
