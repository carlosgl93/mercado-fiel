import ElderlyOutlinedIcon from '@mui/icons-material/ElderlyOutlined';
import ElderlyIcon from '@mui/icons-material/Elderly';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import LoopIcon from '@mui/icons-material/Loop';
import AccessibleIcon from '@mui/icons-material/Accessible';
import AccessibleOutlinedIcon from '@mui/icons-material/AccessibleOutlined';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';

type SimpleOption = {
  id: number;
  label: string;
};

type ExperienceType = ['Personal', 'Profesional'];

type ExperienceOptionType = {
  id: number;
  label: string;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>> & {
    muiName: string;
  };
  checkedIcon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>> & {
    muiName: string;
  };
  specialities?: SimpleOption[];
};

export const experienceType: ExperienceType = ['Personal', 'Profesional'];

export const experienceOptions: ExperienceOptionType[] = [
  {
    id: 0,
    label: 'Adultos Mayores',
    icon: ElderlyOutlinedIcon,
    checkedIcon: ElderlyIcon,
    specialities: [
      {
        id: 1,
        label: 'Demencia senil',
      },
      {
        id: 2,
        label: 'Alzheimer',
      },
      {
        id: 3,
        label: 'Parkinson',
      },
    ],
  },
  {
    id: 1,
    label: 'Condiciones crónicas',
    icon: LoopOutlinedIcon,
    checkedIcon: LoopIcon,
    specialities: [
      { id: 1, label: 'Artritis' },
      { id: 2, label: 'Asma' },
      { id: 3, label: 'Enfermedad Cardiovascular' },
      { id: 4, label: 'EPOC o Enfermedad Respiratoria' },
      { id: 5, label: 'Diabetes' },
    ],
  },
  {
    id: 2,
    label: 'Discapacidad',
    icon: AccessibleOutlinedIcon,
    checkedIcon: AccessibleIcon,
    specialities: [
      { id: 1, label: 'Lesión Cerebral Adquirida' },
      { id: 2, label: 'Autismo' },
      { id: 3, label: 'Parálisis Cerebral' },
      { id: 4, label: 'Fibrosis Quística' },
      { id: 5, label: 'Síndrome de Down' },
      { id: 6, label: 'Epilepsia' },
      { id: 7, label: 'Discapacidad Auditiva' },
      { id: 8, label: 'Discapacidades Intelectuales' },
      { id: 9, label: 'Enfermedad del Neurona Motor' },
      { id: 10, label: 'Distrofia Muscular' },
      { id: 11, label: 'Discapacidades Físicas' },
      { id: 12, label: 'Espina Bífida' },
      { id: 13, label: 'Lesión de la Médula Espinal' },
      { id: 14, label: 'Discapacidad Visual' },
    ],
  },
  {
    id: 3,
    label: 'Salud mental',
    icon: PsychologyAltOutlinedIcon,
    checkedIcon: PsychologyIcon,
    specialities: [
      { id: 1, label: 'Ansiedad' },
      { id: 2, label: 'Trastorno Bipolar' },
      { id: 3, label: 'Depresión' },
      { id: 4, label: 'Trastornos Alimentarios' },
      { id: 5, label: 'Acumulación Compulsiva' },
      { id: 6, label: 'Trastorno Obsesivo-Compulsivo (TOC)' },
      { id: 7, label: 'Trastorno de Estrés Postraumático (TEPT)' },
      { id: 8, label: 'Esquizofrenia' },
      { id: 9, label: 'Abuso de Sustancias y Adicción' },
    ],
  },
];
