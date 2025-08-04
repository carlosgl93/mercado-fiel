import Loading from '@/components/Loading';
import { FlexBox } from '@/components/styled';
import { useComunas } from '@/hooks';
import { Box, List, styled, useTheme } from '@mui/material';
import { Suspense } from 'react';

export const MobileClientes = () => {
  const { getComunasNamesById } = useComunas();
  // const supportRequests = infiniteSupportRequests?.pages.map((page) => page.supportRequests);
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          minHeight: '80vh',
          backgroundColor: theme.palette.background.paper,
          p: '1rem',
          borderRadius: '0.5rem',
        }}
      >
        <Suspense fallback={<Loading />}>
          <List
            component={'ul'}
            sx={{
              minHeight: '90vh',
              m: 0,
              p: 0,
            }}
          >
            {/* {(supportRequests || []).length > 0 ? (
              supportRequests?.map((page, pageIndex) => {
                return (
                  <div key={pageIndex}>
                    {page.map((support: Apoyo) => {
                      const {
                        id,
                        comunasIds,
                        serviceName,
                        recurrency,
                        sessionsPerRecurrency,
                        title,
                        specialityName,
                      } = support;
                      const comunasNames = getComunasNamesById(comunasIds);

                      return (
                        <Link
                          key={id}
                          to={`/ver-apoyo/${id}`}
                          style={{ textDecoration: 'none' }}
                          state={{
                            apoyo: support,
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
                                alignItems: 'center',
                              }}
                            >
                              {createElement(getServiceIcon(serviceName), {
                                sx: {
                                  width: '5rem',
                                  height: '5rem',
                                  justifyContent: 'center',
                                  textAlign: 'center',
                                },
                              })}
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
                                  {capitalizeFirst(title)}
                                </Title>
                              </Box>
                              <EntryTextContainer>
                                <MedicalInformationIcon />
                                <Text>{serviceName}</Text>
                              </EntryTextContainer>
                              {specialityName && (
                                <EntryTextContainer>
                                  <LoupeIcon />
                                  <Text>{specialityName}</Text>
                                </EntryTextContainer>
                              )}
                              <EntryTextContainer>
                                <EventRepeatIcon />
                                <Text>
                                  {getRecurrencyText(recurrency, Number(sessionsPerRecurrency))}
                                </Text>
                              </EntryTextContainer>
                              <EntryTextContainer>
                                <LocationOnIcon />
                                <Text>{comunasNames}</Text>
                              </EntryTextContainer>
                              <Button
                                variant="outlined"
                                sx={{
                                  mt: '2vh',
                                }}
                              >
                                Ver detalles
                              </Button>
                            </Box>
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
                  px: 'auto',
                }}
              >
                <Text>Aún no hay usuarios buscando apoyo para tu servicio y/o comuna</Text>
              </Box>
            )} */}
          </List>
        </Suspense>
      </Box>
    </>
  );
};

const EntryTextContainer = styled(FlexBox)({
  alignContent: 'center',
  alignItems: 'center',
  gap: '1rem',
});
