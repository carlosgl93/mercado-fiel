import { Avatar, Box, Button, ListItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Reviews from '../../components/Reviews';
import { FlexBox } from '../../components/styled';
import { Text, Title } from '../../components/StyledComponents';
import { useUserLookingFor } from '../../hooks';
import { Customer, Supplier } from '../../models';

const DesktopResultList = ({
  results,
  setPage,
  setLimit,
}: {
  results: Customer[] | Supplier[] | undefined;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { userLookingFor } = useUserLookingFor();
  const navigate = useNavigate();
  const handleNavigateToProfile = (liClicked: Supplier | Customer) => {
    console.log({ liClicked });
    if (userLookingFor === 'customers') {
      navigate(`/perfil-cliente/${(liClicked as Customer).idCliente}`, {
        state: {
          prestador: liClicked as Customer,
        },
      });
    } else {
      navigate(`/perfil-proveedor/${(liClicked as Supplier).idProveedor}`, {
        state: {
          proveedor: liClicked as Supplier,
        },
      });
    }
  };

  if (!results || results.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
          px: '2rem',
        }}
      >
        No hay resultados para mostrar con estos filtros.
      </Box>
    );
  }

  if (userLookingFor === null) {
    return (
      <Text>Selecciona si buscas proveedores o clientes en los filtros para ver resultados.</Text>
    );
  }

  if (userLookingFor === 'customers') {
    // render customer results
    return (
      <FlexBox flexDirection={'column'}>
        {(results as Customer[]).map((c) => {
          const { idCliente: id, profilePictureUrl, usuario } = c;
          const { nombre } = usuario || {};
          return (
            <ListItem
              key={c.idCliente}
              sx={{
                display: 'grid',
                gridTemplateColumns: '30% 70%',
                mb: '1rem',
              }}
              onClick={() => handleNavigateToProfile(c)}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'start',
                  alignContent: 'start',
                  alignItems: 'start',
                }}
              >
                <Avatar
                  sx={{
                    height: '120px',
                    width: '120px',
                  }}
                  src={profilePictureUrl || ''}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  py: '3vh',
                }}
              >
                <Box>
                  <Title
                    variant="h6"
                    color="primary"
                    sx={{
                      fontSize: '1.4rem',
                    }}
                  >
                    {nombre}
                  </Title>
                  {/* TODO: implement reviews in the model? */}
                  <Reviews average={0} total_reviews={0} />
                </Box>
                {/* <Text>Servicio: {servicio}</Text> */}
                {/* <Text>{especialidad}</Text> */}
                <Button
                  variant="outlined"
                  sx={{
                    mt: '1vh',
                    maxWidth: '50%',
                  }}
                >
                  Ver perfil
                </Button>
              </Box>
            </ListItem>
          );
        })}
        {/* TODO: implement proper pagination */}
        <Box>
          <Button
            variant="outlined"
            onClick={() => {
              setPage((prev) => prev + 1);
              setLimit((prev) => prev + 10);
            }}
            sx={{
              mt: '1rem',
              width: '100%',
              maxWidth: '200px',
            }}
          >
            Cargar más resultados
          </Button>
        </Box>
      </FlexBox>
    );
  } else if (userLookingFor === 'suppliers') {
    // render supplier results
    return (
      <FlexBox flexDirection={'column'}>
        {(results as Supplier[]).map((s) => {
          const { idProveedor: id, usuario } = s;
          const { nombre, profilePictureUrl } = usuario || {};
          return (
            <ListItem
              key={s.idProveedor}
              sx={{
                display: 'grid',
                gridTemplateColumns: '30% 70%',
                mb: '1rem',
              }}
              onClick={() => handleNavigateToProfile(s)}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'start',
                  alignContent: 'start',
                  alignItems: 'start',
                }}
              >
                <Avatar
                  sx={{
                    height: '120px',
                    width: '120px',
                  }}
                  src={profilePictureUrl || ''}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  py: '3vh',
                }}
              >
                <Box>
                  <Title
                    variant="h6"
                    color="primary"
                    sx={{
                      fontSize: '1.4rem',
                    }}
                  >
                    {nombre}
                  </Title>
                  {/* TODO: implement reviews in the model? */}
                  <Reviews average={0} total_reviews={0} />
                </Box>
                {/* <Text>Servicio: {servicio}</Text> */}
                {/* <Text>{especialidad}</Text> */}
                <Button
                  variant="outlined"
                  sx={{
                    mt: '1vh',
                    maxWidth: '50%',
                  }}
                >
                  Ver perfil
                </Button>
              </Box>
            </ListItem>
          );
        })}
        {/* TODO: implement proper pagination */}

        <Box>
          <Button
            variant="outlined"
            onClick={() => {
              setPage((prev) => prev + 1);
              setLimit((prev) => prev + 10);
            }}
            sx={{
              mt: '1rem',
              width: '100%',
              maxWidth: '200px',
            }}
          >
            Cargar más resultados
          </Button>
        </Box>
      </FlexBox>
    );
  }
};

export default DesktopResultList;
