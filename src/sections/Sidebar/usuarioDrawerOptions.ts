import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';

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
    title: 'Productos',
    path: '/explorar-productos',
    icon: InventoryIcon,
  },
  {
    title: 'Proveedores',
    path: '/resultados',
    icon: PeopleIcon,
  },
  // {
  //   title: 'Mis Pedidos',
  //   path: '/mis-pedidos',
  //   icon: ShoppingCartIcon,
  // },
  // {
  //   title: 'Inbox',
  //   path: '/usuario-inbox',
  //   icon: MailOutlinedIcon,
  // },
];

export const generalOptionsDrawerList = [
  { title: 'Contacto', path: '/contacto' },
  { title: 'Acerca de nosotros', path: '/nosotros' },
  { title: 'Buscar productos', path: '/resultados' },
];
