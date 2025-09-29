import Reviews from '@/components/Reviews';
import { FlexBox } from '@/components/styled';
import { Title } from '@/components/StyledComponents';
import { Supplier } from '@/types/supplier';
import { Avatar, Box, Button, ListItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

interface DesktopResultsListSupplierProps {
  suppliers: Supplier[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}

export const DesktopResultsListSupplier: React.FC<DesktopResultsListSupplierProps> = ({
  suppliers,
  setPage,
  setLimit,
}) => {
  const navigate = useNavigate();

  const handleNavigateToProfile = (supplier: Supplier) => {
    console.log({ supplier });
    navigate(`/perfil-proveedor/${supplier.idProveedor}`, {
      state: {
        proveedor: supplier,
      },
    });
  };

  if (!suppliers || suppliers.length === 0) {
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
        No hay proveedores para mostrar con estos filtros.
      </Box>
    );
  }

  return (
    <FlexBox flexDirection="column">
      {suppliers.map((supplier) => {
        const { idProveedor: id, usuario, nombreNegocio } = supplier;
        const { nombre, profilePictureUrl } = usuario || {};

        if (!usuario) return null; // Ensure usuario exists

        return (
          <Link
            key={id}
            to={`/perfil-proveedor/${id}`}
            style={{ textDecoration: 'none' }}
            state={{
              supplier: supplier,
            }}
          >
            <ListItem
              key={id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '30% 70%',
                mb: '1rem',
                cursor: 'pointer',
              }}
              onClick={() => handleNavigateToProfile(supplier)}
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
                    {nombreNegocio || nombre}
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
    </FlexBox>
  );
};