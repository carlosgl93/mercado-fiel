import { StyledSelect, Title } from '@/components/StyledComponents';
import { IconButton, List, ListItemButton, ListItemText } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Box } from '@mui/system';
import FiltersSearchBar from './FiltersSearchBar';
import useRecibeApoyo from '@/store/recibeApoyo';

import { Servicio } from '@/types/Servicio';
import { ChangeEvent } from 'react';
import { useServicios } from '@/hooks/useServicios';

const DesktopFilters = () => {
  const [{ servicio, especialidad, comuna }, { removeComuna, selectServicio, selectEspecialidad }] =
    useRecibeApoyo();
  const { allServicios } = useServicios();
  const especialidades = servicio?.especialidades;
  const handleSelectServicio = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedService = allServicios.find((s: Servicio) => s.serviceName === e.target.value);
    selectServicio(selectedService as Servicio);
  };

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

      {/* SERVICIO */}
      <Box>
        <Title
          variant="h6"
          sx={{
            fontSize: '1.2rem',
          }}
        >
          Servicio
        </Title>
        {allServicios && (
          <StyledSelect value={servicio?.serviceName || ''} onChange={handleSelectServicio}>
            <option>Selecciona un servicio</option>
            {allServicios.map((servicio: Servicio) => {
              return (
                <option key={servicio.id} value={servicio.serviceName}>
                  {servicio.serviceName}
                </option>
              );
            })}
          </StyledSelect>
        )}

        {servicio && especialidades?.length && (
          <>
            <Title
              variant="h6"
              sx={{
                fontSize: '1.2rem',
              }}
            >
              Especialidad
            </Title>
            <StyledSelect
              value={especialidad?.especialidadName}
              onChange={(e) => {
                selectEspecialidad(
                  servicio?.especialidades?.find((esp) => esp.especialidadName === e.target.value),
                );
              }}
            >
              <option value="">Selecciona una especialidad</option>
              {servicio.especialidades?.map((especialidad) => {
                return (
                  <option key={especialidad.id} value={especialidad.especialidadName}>
                    {especialidad.especialidadName}
                  </option>
                );
              })}
            </StyledSelect>
          </>
        )}
      </Box>

      {/* ESPECIALIDAD */}

      {/* DISPONIBILIDAD */}
      {/* <Title
        variant="h6"
        sx={{
          fontSize: '1.2rem',
        }}
      >
        Disponibilidad
      </Title>
      <StyledUnorderedList>
        {availability.map((day) => {
          return (
            <StyledListItem key={day.id}>
              <StyledCheckboxInput
                type="checkbox"
                id={day.name}
                name="availability"
                value={day.name}
                onClick={() => setAvailability(day)}
              />
              <label htmlFor={day.name}>{day.name}</label>
            </StyledListItem>
          );
        })}
      </StyledUnorderedList> */}
    </Box>
  );
};
export default DesktopFilters;
