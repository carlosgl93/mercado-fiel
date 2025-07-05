import { Servicio } from '@/types/Servicio';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import HealingOutlinedIcon from '@mui/icons-material/HealingOutlined';
import AccessibleOutlinedIcon from '@mui/icons-material/AccessibleOutlined';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
export const services: Servicio[] = [
  {
    id: 0,
    icon: PsychologyOutlinedIcon,
    serviceName: 'Soporte Terapéutico',
    especialidades: [
      {
        id: 0,
        especialidadName: 'Kinesiología',
      },
      {
        id: 1,
        especialidadName: 'Quiropráctica',
      },
      {
        id: 2,
        especialidadName: 'Fonoaudiología',
      },
      {
        id: 5,
        especialidadName: 'Terapeuta Ocupacional',
      },
    ],
  },
  {
    id: 1,
    icon: HealingOutlinedIcon,
    serviceName: 'Servicios de enfermería',
    especialidades: [
      { id: 6, especialidadName: 'Técnico en enfermería' },
      {
        id: 7,
        especialidadName: 'Enfermería general',
      },
    ],
  },
  {
    id: 2,
    icon: AccessibleOutlinedIcon,
    serviceName: 'Cuidadora',
  },
  {
    id: 3,
    icon: AddReactionOutlinedIcon,
    serviceName: 'Sana Compañía',
  },
];
