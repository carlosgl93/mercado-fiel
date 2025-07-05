import { InputLabel } from '@mui/material';
import ServiceSelector from './ServiceSelector';

export const ServiceQuestion = ({
  handleSelectServicio,
}: {
  handleSelectServicio: (serviceId: string) => void;
}) => (
  <>
    <InputLabel htmlFor="service-selector">¿Qué servicio necesitas?</InputLabel>
    <ServiceSelector handleSelectServicio={handleSelectServicio} />
  </>
);
