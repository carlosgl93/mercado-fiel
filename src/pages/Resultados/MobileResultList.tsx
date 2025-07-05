import Reviews from '@/components/Reviews';
import { Text, Title } from '@/components/StyledComponents';
import { useGetPrestadores } from '@/hooks/useGetPrestadores';
import { Avatar, Box, Button, List, ListItem, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

export const MobileResultList = () => {
  const { infinitePrestadores } = useGetPrestadores();
  const theme = useTheme();

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
        {infinitePrestadores?.length && infinitePrestadores?.length > 0 ? (
          infinitePrestadores?.map((page, pageIndex) => {
            if (page.prestadores.length === 0) {
              return (
                <Box
                  key={pageIndex}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '60vh',
                    px: '2rem',
                  }}
                >
                  <Text>Aún no hay prestadores para esta combinacion de filtros</Text>
                </Box>
              );
            }
            return (
              <div key={pageIndex}>
                {page.prestadores.map((prestador) => {
                  const {
                    id,
                    email,
                    firstname,
                    lastname,
                    servicio,
                    especialidad,
                    averageReviews,
                    totalReviews,
                    profileImageUrl,
                  } = prestador;
                  return (
                    <Link
                      key={id}
                      to={`/perfil-prestador/${id}`}
                      style={{ textDecoration: 'none' }}
                      state={{
                        prestador,
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
                            src={profileImageUrl}
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
                              {firstname ? firstname : email} {lastname}
                            </Title>
                            <Reviews
                              average={averageReviews || 0}
                              total_reviews={totalReviews || 0}
                            />
                          </Box>
                          <Text>{servicio}</Text>

                          <Text>{especialidad}</Text>
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
              </div>
            );
          })
        ) : (
          <Box
            sx={{
              px: '2rem',
            }}
          >
            {/* <Text>Conoces a alguien para esta comuna y servicio? Invitalo a Mercado Fiel!</Text> */}
          </Box>
        )}
      </List>
      <Box className="bottomSentinel" />
    </>
  );
};
