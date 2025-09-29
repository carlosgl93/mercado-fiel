import Reviews from '@/components/Reviews';
import { Title } from '@/components/StyledComponents';
import { Customer } from '@/models/Customer';
import { Avatar, Box, Button, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';

interface MobileResultsListCustomerProps {
  customers: Customer[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}

export const MobileResultsListCustomer: React.FC<MobileResultsListCustomerProps> = ({
  customers,
  setPage,
  setLimit,
}) => {
  if (!customers || customers.length === 0) {
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
        No hay clientes para mostrar con estos filtros.
      </Box>
    );
  }

  return (
    <>
      {customers.map((customer) => {
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
                mb: '1rem',
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
                      color: 'primary.main',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {nombre}
                  </Title>
                  <Reviews average={0} total_reviews={0} />
                </Box>
                <Button
                  variant="outlined"
                  sx={{
                    mt: '2vh',
                  }}
                >
                  Ver perfil
                </Button>
              </Box>
            </ListItem>
          </Link>
        );
      })}

      {/* Pagination Button */}
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
};