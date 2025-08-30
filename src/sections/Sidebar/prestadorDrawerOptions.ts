import { MoneyRounded } from '@mui/icons-material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InventoryIcon from '@mui/icons-material/Inventory';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

export const supplierDrawerOptions = [
  {
    title: 'Panel',
    path: '/proveedor-dashboard',
    icon: HomeOutlinedIcon,
  },
  {
    title: 'Mis Productos',
    path: '/mis-productos',
    icon: InventoryIcon,
  },
  {
    title: 'Pedidos Recibidos',
    path: '/pedidos-recibidos',
    icon: ShoppingBagIcon,
  },
  {
    title: 'Clientes',
    path: '/clientes',
    icon: PeopleAltOutlinedIcon,
  },
  {
    title: 'Inbox',
    path: '/proveedor-inbox',
    icon: MailOutlinedIcon,
  },
  {
    title: 'Pagos',
    path: '/pagos',
    icon: MoneyRounded,
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
  { title: 'Explorar', path: '/resultados' },
];
