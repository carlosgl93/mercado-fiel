import { Title } from '@/components/StyledComponents';
import { Avatar, Box, Button, List, ListItem, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { UserLookingFor, useUserLookingFor } from '../../hooks';
import { Customer } from '../../models/Customer';
import { Supplier } from '../../models/Supplier';

type MobileResultsProps = {
  customers: Customer[] | undefined;
  suppliers: Supplier[] | undefined;
  page: number;
  setPage: (page: number) => void;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
};

export const MobileResultList = ({ customers }: MobileResultsProps) => {
  const theme = useTheme();
  const { userLookingFor } = useUserLookingFor();

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
        {userLookingFor === UserLookingFor.CUSTOMERS && customers ? (
          customers.map((customer) => {
            const { idUsuario, profilePictureUrl, nombre } = customer;
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
          })
        ) : (
          <></>
        )}
        {/*TODO: 'implement <MobileResultList /> for suppliers'}
        {/* //  <div key={r.}>
        //         {page.prestadores.map((prestador) => {
        //           const {
        //             id,
        //             email,
        //             firstname,
        //             lastname,
        //             servicio,
        //             especialidad,
        //             averageReviews,
        //             totalReviews,
        //             profileImageUrl,
        //           } = prestador;
        //           return (
        //             <Link
        //               key={id}
        //               to={`/perfil-prestador/${id}`}
        //               style={{ textDecoration: 'none' }}
        //               state={{
        //                 prestador,
        //               }}
        //             >
        //               <ListItem
        //                 sx={{
        //                   display: 'grid',
        //                   gridTemplateColumns: '30% 70%',
        //                   justifyContent: 'space-around',
        //                   gap: '1rem',
        //                 }}
        //               >
        //                 <Box
        //                   sx={{
        //                     display: 'flex',
        //                     flexDirection: 'column',
        //                     justifyContent: 'start',
        //                     alignContent: 'start',
        //                     alignItems: 'start',
        //                   }}
        //                 >
        //                   <Avatar
        //                     sx={{
        //                       height: '90px',
        //                       width: '90px',
        //                     }}
        //                     src={profileImageUrl}
        //                   />
        //                 </Box>
        //                 <Box
        //                   sx={{
        //                     display: 'flex',
        //                     flexDirection: 'column',
        //                     py: '3vh',
        //                     pr: '5vw',
        //                   }}
        //                 >
        //                   <Box>
        //                     <Title
        //                       variant="h6"
        //                       sx={{
        //                         fontSize: '1.25rem',
        //                         color: theme.palette.primary.main,
        //                         overflow: 'hidden',
        //                         textOverflow: 'ellipsis',
        //                       }}
        //                     >
        //                       {firstname ? firstname : email} {lastname}
        //                     </Title>
        //                     <Reviews
        //                       average={averageReviews || 0}
        //                       total_reviews={totalReviews || 0}
        //                     />
        //                   </Box>
        //                   <Text>{servicio}</Text>

        //                   <Text>{especialidad}</Text>
        //                   <Button
        //                     variant="outlined"
        //                     sx={{
        //                       mt: '2vh',
        //                     }}
        //                   >
        //                     Ver perfil
        //                   </Button>
        //                 </Box>
        //                 {/* <Text>Availability: {availability.map((a) => a.name).join(', ')}</Text> */}
        {/* //               </ListItem> */}
        {/* //             </Link> */}
        {/* //           ); */}
        {/* //         })} */}
        {/* //       </div>) */}
        {/* //       } */}
        {/* //  : ( */}
        {/* //   <Box
        //     sx={{
        //       px: '2rem',
        //     }}
        //   >
        //     {/* <Text>Conoces a alguien para esta comuna y servicio? Invitalo a Mercado Fiel!</Text> */}
        {/* //   </Box> */}
        {/* // )} */}
      </List>
      <Box className="bottomSentinel" />
    </>
  );
};
