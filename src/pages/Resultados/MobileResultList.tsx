import { Text, Title } from '@/components/StyledComponents';
import { Avatar, Box, Button, List, ListItem, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { useUserLookingFor } from '../../hooks';
import { Customer } from '../../models/Customer';
import { Supplier } from '../../models/Supplier';

export const MobileResultList = ({
  results,
  setPage,
  setLimit,
}: {
  results: Customer[] | Supplier[] | undefined;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const theme = useTheme();
  const { userLookingFor } = useUserLookingFor();

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
    return (
      <>
        <List
          component={'ul'}
          sx={{
            minHeight: '90vh',
            m: 0,
            p: 0,
          }}
        >
          {(results as Customer[]).map((customer) => {
            const { idUsuario, profilePictureUrl, usuario } = customer;
            if (!usuario) return null; // Ensure usuario exists
            const { nombre } = usuario;
            return (
              <Link
                key={idUsuario}
                to={`/perfil-prestador/${idUsuario}`}
                style={{ textDecoration: 'none' }}
                state={{
                  customer,
                }}
              >
                <ListItem
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '30% 70%',
                    justifyContent: 'space-around',
                    gap: '1rem',
                  }}
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
                        height: '90px',
                        width: '90px',
                      }}
                      src={profilePictureUrl || ''}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      py: '3vh',
                      pr: '5vw',
                    }}
                  >
                    <Box>
                      <Title
                        variant="h6"
                        sx={{
                          fontSize: '1.25rem',
                          color: theme.palette.primary.main,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {nombre}
                      </Title>
                      {/* <Reviews
                              average={averageReviews || 0}
                              total_reviews={totalReviews || 0}
                            /> */}
                    </Box>
                    {/* <Text>{servicio}</Text> */}

                    {/* <Text>{especialidad}</Text> */}
                    <Button
                      variant="outlined"
                      sx={{
                        mt: '2vh',
                      }}
                    >
                      Ver perfil
                    </Button>
                  </Box>
                  {/* <Text>Availability: {availability.map((a) => a.name).join(', ')}</Text> */}
                </ListItem>
              </Link>
            );
          })}
        </List>
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
        <Box className="bottomSentinel" />
      </>
    );
  } else if (userLookingFor === 'suppliers') {
    return (
      <>
        <List
          component={'ul'}
          sx={{
            minHeight: '90vh',
            m: 0,
            p: 0,
          }}
        >
          {(results as Supplier[]).map((s) => {
            const { idProveedor: id, usuario } = s;
            const { nombre, profilePictureUrl } = usuario || {};
            if (!usuario) return null; // Ensure usuario exists
            return (
              <Link
                key={id}
                to={`/perfil-cliente/${id}`}
                style={{ textDecoration: 'none' }}
                state={{
                  supplier: s,
                }}
              >
                <ListItem
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '30% 70%',
                    justifyContent: 'space-around',
                    gap: '1rem',
                  }}
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
                        height: '90px',
                        width: '90px',
                      }}
                      src={profilePictureUrl || ''}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      py: '3vh',
                      pr: '5vw',
                    }}
                  >
                    <Box>
                      <Title
                        variant="h6"
                        sx={{
                          fontSize: '1.25rem',
                          color: theme.palette.primary.main,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {nombre}
                      </Title>
                      {/* <Reviews
                              average={averageReviews || 0}
                              total_reviews={totalReviews || 0}
                            /> */}
                    </Box>
                    {/* <Text>{servicio}</Text> */}

                    {/* <Text>{especialidad}</Text> */}
                    <Button
                      variant="outlined"
                      sx={{
                        mt: '2vh',
                      }}
                    >
                      Ver perfil
                    </Button>
                  </Box>
                  {/* <Text>Availability: {availability.map((a) => a.name).join(', ')}</Text> */}
                </ListItem>
              </Link>
            );
          })}
        </List>
      </>
    );
  }
};
