import Reviews from '@/components/Reviews';
import { FlexBox } from '@/components/styled';
import { Title } from '@/components/StyledComponents';
import { Customer } from '@/models/Customer';
import { Avatar, Box, Button, ListItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface DesktopResultsListCustomerProps {
  customers: Customer[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}

export const DesktopResultsListCustomer: React.FC<DesktopResultsListCustomerProps> = ({
  customers,
  setPage,
  setLimit,
}) => {
  const navigate = useNavigate();

  const handleNavigateToProfile = (customer: Customer) => {
    console.log({ customer });
    navigate(`/perfil-cliente/${customer.idCliente}`, {
      state: {
        prestador: customer,
      },
    });
  };

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
    <FlexBox flexDirection="column">
      {customers.map((customer) => {
        const { idCliente: id, profilePictureUrl, usuario } = customer;
        const { nombre } = usuario || {};

        if (!usuario) return null; // Ensure usuario exists

        return (
          <ListItem
            key={customer.idCliente}
            sx={{
              display: 'grid',
              gridTemplateColumns: '30% 70%',
              mb: '1rem',
              cursor: 'pointer',
            }}
            onClick={() => handleNavigateToProfile(customer)}
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
                <Reviews average={0} total_reviews={0} />
              </Box>
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
    </FlexBox>
  );
};