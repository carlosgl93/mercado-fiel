import asyncComponentLoader from '@/utils/loader';
import { Pages, Routes } from './types';

const routes: Routes = {
  [Pages.Welcome]: {
    component: asyncComponentLoader(() => import('@/pages/Welcome')),
    path: '/',
    title: 'Inicio',
  },
  [Pages.Nosotros]: {
    component: asyncComponentLoader(() => import('@/pages/Nosotros')),
    path: '/nosotros',
    title: 'Nosotros',
  },
  [Pages.Ingresar]: {
    component: asyncComponentLoader(() => import('@/pages/Ingresar')),
    path: '/ingresar',
    title: 'Ingresar',
  },
  [Pages.RegistrarPrestador]: {
    component: asyncComponentLoader(() => import('@/pages/RegistrarPrestador')),
    path: '/registrar-prestador',
    title: 'Registrarse',
  },
  [Pages.RegistrarUsuario]: {
    component: asyncComponentLoader(() => import('@/pages/RegistrarUsuario')),
    path: '/registrar-usuario',
    title: 'Registrarse',
  },
  [Pages.Prestador]: {
    component: asyncComponentLoader(() => import('@/pages/PersonaApoyo')),
    path: '/persona-de-apoyo',
    title: 'Registrarse',
  },
  [Pages.Comenzar]: {
    component: asyncComponentLoader(() => import('@/pages/Page2')),
    path: '/comenzar',
    title: 'Comenzar',
  },
  [Pages.Comienzo]: {
    component: asyncComponentLoader(() => import('@/pages/Comienzo')),
    path: '/comienzo',
  },
  [Pages.EntregaApoyo]: {
    component: asyncComponentLoader(() => import('@/pages/EntregaApoyo')),
    path: '/entrega-apoyo',
  },

  [Pages.Resultados]: {
    component: asyncComponentLoader(() => import('@/pages/Resultados')),
    path: '/resultados',
  },
  [Pages.PerfilProveedor]: {
    component: asyncComponentLoader(() => import('@/pages/PerfilProveedor')),
    path: '/perfil-proveedor/:id',
  },
  [Pages.PreviewPerfilPrestador]: {
    component: asyncComponentLoader(() => import('@/pages/PreviewPerfilPrestador')),
    path: '/preview-perfil-prestador/',
  },
  [Pages.ConstruirPerfil]: {
    component: asyncComponentLoader(() => import('@/pages/ConstruirPerfil')),
    path: '/construir-perfil',
  },
  // [Pages.Servicios]: {
  //   component: asyncComponentLoader(() => import('@/pages/ConstruirPerfil/Servicio')),
  //   path: '/construir-perfil/servicios',
  // },
  [Pages.Disponibilidad]: {
    component: asyncComponentLoader(() => import('@/pages/ConstruirPerfil/Disponibilidad')),
    path: '/construir-perfil/disponibilidad',
  },
  // [Pages.EditarComunasPrestador]: {
  //   component: asyncComponentLoader(() => import('@/pages/ConstruirPerfil/Comunas')),
  //   path: '/construir-perfil/comunas',
  // },
  // [Pages.Tarifas]: {
  //   component: asyncComponentLoader(() => import('@/pages/ConstruirPerfil/Tarifas')),
  //   path: '/construir-perfil/tarifas',
  // },
  [Pages.Experiencia]: {
    component: asyncComponentLoader(() => import('@/pages/ConstruirPerfil/Experiencia')),
    path: '/construir-perfil/experiencia',
  },

  [Pages.CuentaBancaria]: {
    component: asyncComponentLoader(() => import('@/pages/ConstruirPerfil/CuentaBancaria')),
    path: '/construir-perfil/cuentaBancaria',
  },

  [Pages.DetallesBasicos]: {
    component: asyncComponentLoader(() => import('@/pages/ConstruirPerfil/DetallesBasicos')),
    path: '/construir-perfil/detallesBasicos',
  },
  [Pages.Chat]: {
    component: asyncComponentLoader(() => import('@/pages/Chat')),
    path: '/chat/',
  },
  [Pages.PrestadorChat]: {
    component: asyncComponentLoader(() => import('@/pages/PrestadorChat')),
    path: '/prestador-chat',
  },
  [Pages.PrestadorInbox]: {
    component: asyncComponentLoader(() => import('@/pages/PrestadorInbox')),
    path: '/prestador-inbox',
  },
  [Pages.UsuarioInbox]: {
    component: asyncComponentLoader(() => import('@/pages/UsuarioInbox')),
    path: '/usuario-inbox',
  },
  // [Pages.PerfilCliente]: {
  //   component: asyncComponentLoader(() => import('@/pages/PerfilCliente')),
  //   path: '/perfil-cliente/:id',
  // },
  [Pages.UsuarioDashboard]: {
    component: asyncComponentLoader(() => import('@/pages/UsuarioDashboard')),
    path: '/usuario-dashboard',
  },
  [Pages.EmailVerificado]: {
    component: asyncComponentLoader(() => import('@/pages/EmailVerificado')),
    path: '/email-verificado',
  },
  [Pages.EmailVerificadoPrestador]: {
    component: asyncComponentLoader(() => import('@/pages/EmailVerificadoPrestador')),
    path: '/email-verificado-prestador',
  },
  [Pages.PrestadorDashboard]: {
    component: asyncComponentLoader(() => import('@/pages/PrestadorDashboard')),
    path: '/prestador-dashboard',
  },
  [Pages.Sesiones]: {
    component: asyncComponentLoader(() => import('@/pages/Sesiones')),
    path: '/sesiones',
  },
  [Pages.BackOffice]: {
    component: asyncComponentLoader(() => import('@/pages/BackOffice')),
    path: '/backoffice',
  },
  [Pages.BackOfficePrestadores]: {
    component: asyncComponentLoader(() => import('@/pages/BackOffice/Prestadores')),
    path: '/backoffice/prestadores',
  },
  [Pages.BackOfficePagos]: {
    component: asyncComponentLoader(() => import('@/pages/BackOffice/Pagos')),
    path: '/backoffice/pagos',
  },
  // [Pages.AdminLogin]: {
  //   component: asyncComponentLoader(() => import('@/pages/AdminLogin')),
  //   path: '/backoffice/login',
  // },
  [Pages.TermsConditions]: {
    component: asyncComponentLoader(() => import('@/pages/TermsConditions')),
    path: '/terms-conditions',
  },
  [Pages.Payment]: {
    component: asyncComponentLoader(() => import('@/pages/Payment')),
    path: '/payment',
  },
  [Pages.BookingConfirmation]: {
    component: asyncComponentLoader(() => import('@/pages/BookingConfirmation')),
    path: '/booking-confirmation',
  },

  [Pages.EncuentraClientes]: {
    component: asyncComponentLoader(() => import('@/pages/PrestadorDashboard/EncuentraClientes')),
    path: '/encuentra-clientes',
  },

  [Pages.Contacto]: {
    component: asyncComponentLoader(() => import('@/pages/Contacto')),
    path: '/contacto',
    title: 'Contacto',
  },
  [Pages.PreguntasFrecuentes]: {
    component: asyncComponentLoader(() => import('@/pages/PreguntasFrecuentes')),
    path: '/preguntas-frecuentes',
    title: 'Preguntas Frecuentes',
  },

  [Pages.NotFound]: {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
};

export const protectedRoutes = [
  '/prestador-dashboard',
  '/construir-perfil',
  '/construir-perfil/disponibilidad',
  '/construir-perfil/comunas',
  '/construir-perfil/tarifas',
  '/construir-perfil/experiencia',
  '/construir-perfil/cuentaBancaria',
  '/construir-perfil/historialLaboral',
  '/construir-perfil/educacionFormacion',
  '/construir-perfil/detallesBasicos',
  '/construir-perfil/servicios',
  '/chat',
  '/prestador-chat',
  '/prestador-inbox',
  '/usuario-inbox',
  '/perfil-usuario',
  '/usuario-dashboard',
  '/sesiones',
  '/preview-perfil-prestador',
  '/post-support',
  '/encuentra-clientes',
  '/ver-apoyo',
  '/mis-apoyos',
];

export default routes;
