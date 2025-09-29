import Reviews from '@/components/Reviews';
import { Title } from '@/components/StyledComponents';
import { Supplier } from '@/types/supplier';
import { Avatar, Box, Button, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';

interface MobileResultsListSupplierProps {
  suppliers: Supplier[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}

export const MobileResultsListSupplier: React.FC<MobileResultsListSupplierProps> = ({
  suppliers,
  setPage,
  setLimit,
}) => {
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
    <>
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
              supplier,
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
                    {nombreNegocio || nombre}
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
    </>
  );
};