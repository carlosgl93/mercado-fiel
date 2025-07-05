import { Box, Button, List, ListItemButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchBar from './SearchBar';
import { TextContainer, Title } from '@/components/StyledComponents';
import { recibeApoyoSteps } from './recibeApoyoSteps';
import useRecibeApoyo from '@/store/recibeApoyo';
import { useComunas } from '@/hooks';

const Step2 = () => {
  const [, { increaseStep, decreaseStep }] = useRecibeApoyo();
  const { selectedComunas, handleRemoveComuna, resetComunas } = useComunas();

  const handleNext = () => {
    increaseStep();
  };

  const handlePrevious = () => {
    resetComunas();
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
          {recibeApoyoSteps[1].title}
        </Title>
        <Box>
          <Title
            variant="h6"
            sx={{
              fontSize: '1.1rem',
              my: 0,
            }}
          >
            Comuna seleccionada:
          </Title>
          <List
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              maxWidth: '600px',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            {selectedComunas &&
              selectedComunas.map((comuna) => (
                <ListItemButton
                  key={comuna.id}
                  onClick={() => handleRemoveComuna(comuna)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: '0.5rem',
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    maxWidth: 'fit-content',
                  }}
                >
                  {comuna.name}
                  <CloseIcon sx={{ marginLeft: '0.5rem' }} />
                </ListItemButton>
              ))}
          </List>
        </Box>
      </TextContainer>
      <SearchBar />
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
        <Button disabled={!selectedComunas.length} variant="contained" onClick={handleNext}>
          Siguiente
        </Button>
      </Box>
    </>
  );
};

export default Step2;
