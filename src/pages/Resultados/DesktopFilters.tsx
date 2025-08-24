import { StyledSelect, Title } from '@/components/StyledComponents';
import useRecibeApoyo from '@/store/recibeApoyo';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { IconButton, List, ListItemButton, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import FiltersSearchBar from './FiltersSearchBar';

import Loading from '../../components/Loading';
import { useCategories, useComunas, UserLookingFor, useUserLookingFor } from '../../hooks';
import { Category } from '../../types/api/categories';

const DesktopFilters = () => {
  const { userLookingFor, handleSelectLookingFor } = useUserLookingFor();
  const { getCategories, isLoadingCategories, selectedCategory, handleSelectCategory } =
    useCategories();
  const { isLoadingAllComunas } = useComunas();
  const [{ comuna }, { removeComuna }] = useRecibeApoyo();

  if (isLoadingCategories) return <Loading />;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        gap: '1rem',
      }}
    >
      <Box>
        <Title
          variant="h6"
          sx={{
            fontSize: '1.2rem',
          }}
        >
          ¿Qué buscas?
        </Title>
        <StyledSelect
          value={userLookingFor || ''}
          onChange={(e) => handleSelectLookingFor(e.target.value as UserLookingFor)}
        >
          <option>¿Proveedores o clientes?</option>
          {Object.values(UserLookingFor).map((userType) => {
            return (
              <option key={userType} value={userType}>
                {userType === UserLookingFor.SUPPLIERS ? 'Proveedores' : 'Clientes'}
              </option>
            );
          })}
        </StyledSelect>
      </Box>

      {isLoadingAllComunas ? (
        <Loading />
      ) : (
        <Box>
          <Title
            variant="h6"
            sx={{
              fontSize: '1.2rem',
            }}
          >
            Comunas
          </Title>
          <FiltersSearchBar />
          {comuna && (
            <List>
              <ListItemButton
                onClick={() => removeComuna(comuna!)}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '90% 10%',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'primary.dark',
                  borderRadius: '0.25rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'primary.main',
                  color: 'secondary.main',
                  ':hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.dark',
                  },
                  my: '1vh',
                }}
              >
                <ListItemText primary={comuna.name} />

                <IconButton
                  sx={{
                    color: 'secondary.contrastText',
                  }}
                >
                  <CancelOutlinedIcon />
                </IconButton>
              </ListItemButton>
            </List>
          )}
        </Box>
      )}

      {userLookingFor === UserLookingFor.SUPPLIERS && (
        <Box>
          <Title
            variant="h6"
            sx={{
              fontSize: '1.2rem',
            }}
          >
            Categoría
          </Title>
          {getCategories && (
            <StyledSelect
              value={selectedCategory.id || ''}
              onChange={(e) => handleSelectCategory(e.target.value)}
            >
              <option>Selecciona una categoría</option>
              {getCategories.map((category: Category) => {
                return (
                  <option key={category.idCategoria} value={category.idCategoria}>
                    {category.nombre}
                  </option>
                );
              })}
            </StyledSelect>
          )}
        </Box>
      )}
    </Box>
  );
};
export default DesktopFilters;
