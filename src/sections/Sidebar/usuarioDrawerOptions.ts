import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

export const usuarioDrawerOptions = [
  {
    title: 'Panel',
    path: '/usuario-dashboard',
    icon: HomeOutlinedIcon,
  },
  {
    title: 'Perfil',
    path: '/perfil-usuario',
    icon: AccountCircleIcon,
  },
  {
    title: 'Sesiones',
    path: '/sesiones',
    icon: CalendarTodayOutlinedIcon,
  },

  {
    title: 'Buscar prestadores',
    path: '/resultados',
    icon: SearchOutlinedIcon,
  },
  // {
  //   title: 'Administrar prestadores',
  //   path: '/administrar-prestadores',
  //   icon: PeopleAltOutlinedIcon,
  // },
  // {
  //   title: 'Historial',
  //   path: '/historial',
  //   icon: HistoryOutlinedIcon,
  // },
  {
    title: 'Inbox',
    path: '/usuario-inbox',
    icon: MailOutlinedIcon,
  },
  // {
  //   title: 'Configuración',
  //   path: '/configuracion',
  //   icon: SettingsOutlinedIcon,
  // },
];

export const generalOptionsDrawerList = [
  { title: 'Contacto', path: '/contacto' },
  { title: 'Acerca de nosotros', path: '/nosotros' },
  { title: 'Buscar prestadores', path: '/resultados' },
];
