import {
  BackButtonContainer,
  Container,
  StyledTitle,
  Wrapper,
} from '@/pages/PrestadorDashboard/StyledPrestadorDashboardComponents';
import BackButton from '@/components/BackButton';
import { StyledText } from '../StyledConstruirPerfilComponents';
import { Box, Button } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ListAvailableDays } from './ListAvailableDays';
import { EditAvailableDays } from './EditAvailableDays';
import { useDisponibilidadNew } from '@/hooks/useDisponibilidadNew';
import Loading from '@/components/Loading';

export const Disponibilidad = () => {
  const { availability, isLoading, editDisponibilidad, handleEditDisponibilidad } =
    useDisponibilidadNew();

  return (
    <Wrapper>
      <BackButtonContainer>
        <BackButton
          action={editDisponibilidad ? handleEditDisponibilidad : undefined}
          to="/construir-perfil"
        />
      </BackButtonContainer>

      <StyledTitle>Disponibilidad</StyledTitle>
      <Container
        sx={{
          width: 'fit-content',
          p: '1.5rem',
        }}
      >
        {/* <SubTitle>Dias y horas disponible</SubTitle> */}
        <StyledText>
          Agrega que dias y horas estas disponible para que te lleguen solicitudes que te acomoden.
        </StyledText>
        <Box
          sx={{
            my: '1.5rem',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={handleEditDisponibilidad}
            sx={{ fontWeight: 'bold' }}
          >
            {editDisponibilidad ? 'Editando' : 'Editar'}
          </Button>
        </Box>
        {isLoading ? (
          <Loading />
        ) : !editDisponibilidad ? (
          <ListAvailableDays availability={availability} />
        ) : (
          <EditAvailableDays availability={availability} />
        )}
      </Container>
    </Wrapper>
  );
};
