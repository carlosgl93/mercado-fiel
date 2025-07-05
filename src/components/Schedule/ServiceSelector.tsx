import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ScheduleController } from './ScheduleController';

type ServiceSelectorProps = {
  handleSelectServicio: (serviceId: string) => void;
};

const ServiceSelector = ({ handleSelectServicio }: ServiceSelectorProps) => {
  const { prestadorCreatedServicios } = ScheduleController();

  return (
    <FormControl
      sx={{
        mx: 'auto',
      }}
    >
      <InputLabel id="service-selector-label">Selecciona el servicio</InputLabel>
      <Select
        labelId="service-selector"
        id="service-selector"
        label="Selecciona el servicio"
        onChange={(e) => handleSelectServicio(e.target.value)}
        sx={{
          width: {
            xs: '75vw',
            sm: '50vw',
            md: '33vw',
          },
        }}
        defaultValue={''}
      >
        <MenuItem value="">Selecciona un servicio:</MenuItem>
        {prestadorCreatedServicios?.map((e) => (
          <MenuItem key={e.id ? e.id : e.name} value={e.id}>
            {e.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ServiceSelector;
