import { List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useRecibeApoyo from '@/store/recibeApoyo';
import { Servicio } from '@/types/Servicio';
import { useServicios } from '@/hooks/useServicios';

const ServiceTypeList = () => {
  const [{ servicio }, { selectServicio, increaseStep }] = useRecibeApoyo();

  const { allServicios } = useServicios();
  const handleSelectServicio = (servicio: Servicio) => {
    selectServicio(servicio);
    increaseStep();
  };

  return (
    <>
      <List
        sx={{
          gap: 1,
        }}
      >
        {allServicios.map((item) => {
          const alreadySelected = servicio?.id === item.id;
          return (
            <ListItemButton
              onClick={() => handleSelectServicio(item)}
              sx={{
                color: alreadySelected ? 'secondary.main' : 'primary.main',
                display: 'grid',
                gridTemplateColumns: '90% 10%',
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'primary.dark',
                borderRadius: '0.25rem',
                minWidth: '300px',
                padding: '0.5rem 1rem',
                backgroundColor: alreadySelected ? 'primary.dark' : 'white',
                ':hover': {
                  backgroundColor: alreadySelected ? 'primary.dark' : 'primary.light',
                  color: alreadySelected ? 'white' : 'primary.dark',
                },
              }}
              key={item.id}
            >
              <ListItemText primary={item.serviceName} />
              <ListItemIcon
                sx={{
                  color: 'primary.main',
                  marginLeft: 'auto',
                }}
              >
                <ChevronRightIcon />
              </ListItemIcon>
            </ListItemButton>
          );
        })}
      </List>
    </>
  );
};

export default ServiceTypeList;
