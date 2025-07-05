import { Box } from '@mui/material';
import Meta from '@/components/Meta';
import { Text, Title } from '../../components/StyledComponents';
import { SessionController } from './SessionController';
import Loading from '@/components/Loading';
import { ListSesiones } from './ListSesiones';

function Sesiones() {
  const { userAppointments, userAppointmentsLoading } = SessionController();

  return (
    <>
      <Meta title="Sesiones agendadas" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '80vh',
          p: '1rem',
          mx: 'auto',
        }}
      >
        {userAppointmentsLoading ? (
          <Loading />
        ) : (
          <>
            <Title
              sx={{
                color: 'primary.main',
              }}
            >
              Tus sesiones
            </Title>

            {userAppointments?.length === 0 ? (
              <>
                <Text>No has agendado ninguna sesión aún.</Text>
              </>
            ) : (
              <ListSesiones />
            )}
          </>
        )}
      </Box>
    </>
  );
}

export default Sesiones;
