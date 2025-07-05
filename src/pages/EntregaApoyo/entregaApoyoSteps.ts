import { services } from '@/utils/services';

export const entregaApoyoSteps = [
  {
    title: '¿Dónde quieres entregar apoyo?',
    options: [],
  },
  {
    title: '¿Qué tipo de ayuda entregarás?',
    options: services,
  },
  {
    title: '¿Cuál es tu especialidad?',
    options: services,
  },
];
