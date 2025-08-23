import { FC } from 'react';
import { PathRouteProps } from 'react-router-dom';

import type { SvgIconProps } from '@mui/material/SvgIcon';

enum Pages {
  Welcome,
  Nosotros,
  Ingresar,
  Beneficios,
  RegistrarUsuario,
  RegistrarProveedor,
  ProveedorPerfil,
  EmailConfirmation,
  AuthCallback,
  Comenzar,
  Prestador,
  Comienzo,
  EntregaApoyo,
  NotFound,
  PerfilProveedor,
  Resultados,
  EmailVerificado,
  PerfilCliente,
  EmailVerificadoPrestador,
  ProveedorDashboard,
  Chat,
  UsuarioDashboard,
  ConstruirPerfil,
  // Servicios,
  Disponibilidad,
  PreviewPerfilPrestador,
  // EditarComunasPrestador,
  PrestadorInbox,
  UsuarioInbox,
  PrestadorChat,
  // Tarifas,
  Experiencia,
  CuentaBancaria,
  // EducacionFormacion,
  DetallesBasicos,
  Sesiones,
  BackOffice,
  BackOfficePrestadores,
  BackOfficePagos,
  TermsConditions,
  Payment,
  // AdminLogin,
  // SobreMi,
  BookingConfirmation,
  EncuentraClientes,
  // MisApoyos,
  // CrearApoyo,
  Contacto,
  PreguntasFrecuentes,
  MisProductos,
}

type PathRouteCustomProps = {
  title?: string;
  component: FC;
  icon?: FC<SvgIconProps>;
  path: string;
};

type Routes = Record<Pages, PathRouteProps & PathRouteCustomProps>;

export { Pages };
export type { Routes };
