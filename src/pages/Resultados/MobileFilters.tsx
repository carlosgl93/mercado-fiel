import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, List, ListItemButton, ListItemText } from '@mui/material';

import { Title } from '@/components/StyledComponents';
import { FiltersController } from './FiltersController';
import FiltersSearchBar from './FiltersSearchBar';

type MobileFiltersProps = {
  closeFilters: () => void;
};

export const MobileFilters = ({ closeFilters }: MobileFiltersProps) => {
  const { comuna, servicio, especialidad, removeComuna, selectEspecialidad } = FiltersController();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignContent: 'center',
        p: '1rem',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: '1.75rem',
        }}
      >
        <Button
          variant="outlined"
          onClick={closeFilters}
          sx={{
            display: 'flex',
            borderRadius: '1rem',
            borderColor: '#99979c',
          }}
        >
          Cerrar <CloseIcon />
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Title
          variant="h6"
          sx={{
            fontSize: '1.2rem',
          }}
        >
          Comuna donde recibirás apoyo.
        </Title>
      </Box>
      <FiltersSearchBar />
      {comuna && (
        <List>
          <ListItemButton
            onClick={() => removeComuna(comuna!)}
            sx={{
              color: 'secondary.main',
              display: 'grid',
              gridTemplateColumns: '90% 10%',
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'primary.dark',
              borderRadius: '1.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'primary.dark',
              ':hover': {
                backgroundColor: 'primary.light',
                color: 'primary.dark',
              },
              my: '1vh',
            }}
          >
            <ListItemText primary={comuna.name} />
          </ListItemButton>
        </List>
      )}

      <Box
        sx={{
          my: '1rem',
        }}
      >
        <Button
          sx={{
            mt: '3rem',
          }}
          onClick={closeFilters}
          variant="contained"
        >
          Buscar
        </Button>
      </Box>
    </Box>
  );
};
