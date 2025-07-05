import { List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useRecibeApoyo from '@/store/recibeApoyo';
import { Especialidad } from '@/types/Servicio';
import { useServicios } from '@/hooks/useServicios';
import { useNavigate } from 'react-router-dom';

const SpecialityList = () => {
  const [{ servicio, especialidad }, { selectEspecialidad }] = useRecibeApoyo();
  const { allServicios } = useServicios();
  const router = useNavigate();

  const handleSelectSpeciality = (speciality: Especialidad) => {
    selectEspecialidad(speciality);
    router('/registrar-usuario');
  };

  const specialities =
    allServicios?.find((s) => s.serviceName === servicio?.serviceName)?.especialidades || [];

  return (
    <>
      <List
        sx={{
          gap: 1,
        }}
      >
        {specialities.map((item) => {
          const alreadySelected = especialidad?.id === item.id;
          return (
            <ListItemButton
              onClick={() => handleSelectSpeciality(item)}
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
              <ListItemText primary={item.especialidadName} />
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

export default SpecialityList;
