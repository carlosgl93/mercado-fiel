import { Box, Button, List, ListItemButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchBar from './SearchBar';
import { TextContainer, Title } from '@/components/StyledComponents';
import { entregaApoyoSteps } from './entregaApoyoSteps';
import useEntregaApoyo from '@/store/entregaApoyo';

const Step1 = () => {
  const [{ selectedComunas }, { removeComuna, increaseStep }] = useEntregaApoyo();

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
          {entregaApoyoSteps[0].title}
        </Title>
        <Box>
          <Title
            variant="h6"
            sx={{
              fontSize: '1.1rem',
            }}
          >
            Comunas seleccionadas:
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
            {selectedComunas.map((comuna) => (
              <ListItemButton
                key={comuna.id}
                onClick={() => removeComuna(comuna)}
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
          my: '2.5vh',
        }}
      >
        <Button disabled={selectedComunas.length === 0} variant="contained" onClick={increaseStep}>
          Siguiente
        </Button>
      </Box>
    </>
  );
};

export default Step1;
