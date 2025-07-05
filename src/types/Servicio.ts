import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export type Servicio = {
  id: number;
  especialidades?: Especialidad[] | undefined;
  serviceName: string;
  // eslint-disable-next-line
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  };
};

export type Especialidad = {
  id: number;
  especialidadName: string;
};
