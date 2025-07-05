import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';

export const prestadorDrawerOptions = [
  {
    title: 'Panel',
    path: '/prestador-dashboard',
    icon: HomeOutlinedIcon,
  },
  {
    title: 'Sesiones',
    path: '/sesiones',
    icon: CalendarTodayOutlinedIcon,
  },
  // {
  //   title: 'Trabajos',
  //   path: '/trabajos',
  //   icon: FormatListBulletedOutlinedIcon,
  // },
  // {
  //   title: 'Clientes',
  //   path: '/clientes',
  //   icon: PeopleAltOutlinedIcon,
  // },
  // {
  //   title: 'Historial',
  //   path: '/historial',
  //   icon: HistoryOutlinedIcon,
  // },
  {
    title: 'Inbox',
    path: '/prestador-inbox',
    icon: MailOutlinedIcon,
  },
  // {
  //   title: 'Pagos',
  //   path: '/pagos',
  //   icon: AttachMoneyOutlinedIcon,
  // },
  // {
  //   title: 'Configuración',
  //   path: '/configuracion',
  //   icon: SettingsOutlinedIcon,
  // },
];

export const generalOptionsDrawerList = [
  { title: 'Ayuda', path: '/ayuda' },
  { title: 'Acerca de nosotros', path: '/nosotros' },
  { title: 'Buscar prestadores', path: '/resultados' },
];

export const providerGeneralOptions = [...generalOptionsDrawerList].filter(
  (o) => o.title !== 'Buscar prestadores',
);
