import { Title } from '@/components/StyledComponents';
import { Avatar, Box, Button, List, ListItem, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserLookingFor, useUserLookingFor } from '../../hooks';
import { useAuth } from '../../hooks/useAuthSupabase';
import { Supplier } from '../../models';
import { Customer } from '../../models/Customer';
import { SuppliersListResponse } from '../../types/supplier';

export const MobileResultList = ({
  results,
  setPage,
  setLimit,
}: {
  results: Customer[] | SuppliersListResponse[] | undefined;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, supplier, customer, isAuthenticated } = useAuth();
  const { userLookingFor, handleSelectLookingFor } = useUserLookingFor();

  // Smart logic: infer what user is looking for based on their role
  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect non-logged users to /comienzo
      navigate('/comienzo', { replace: true });
      return;
    }

    // If userLookingFor is not set, infer from user role
    if (userLookingFor === null) {
      if (supplier?.idProveedor) {
        // Supplier/Proveedor looks for customers/clientes
        handleSelectLookingFor(UserLookingFor.CUSTOMERS);
      } else if (customer?.idCliente || user?.data?.cliente) {
        // Customer/Cliente looks for suppliers/proveedores
        handleSelectLookingFor(UserLookingFor.SUPPLIERS);
      }
    }
  }, [isAuthenticated, supplier, customer, user, userLookingFor, handleSelectLookingFor, navigate]);

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

  // This should not happen now since we auto-infer or redirect
  if (userLookingFor === null) {
    return null;
  }

  if (userLookingFor === UserLookingFor.CUSTOMERS) {
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
                to={`/perfil-cliente/${idUsuario}`}
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
  } else if (userLookingFor === UserLookingFor.SUPPLIERS) {
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
          {results?.data?.map((s: Supplier) => {
            const { idProveedor: id, usuario } = s;
            const { nombre, profilePictureUrl } = usuario || {};
            if (!usuario) return null; // Ensure usuario exists
            return (
              <Link
                key={id}
                to={`/perfil-proveedor/${id}`}
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
