import { atom } from 'recoil';
import { Supplier } from '../../models';

export const proveedorState = atom<null | Supplier>({
  key: 'proveedorState',
  default: null,
});

// Re-export types for backward compatibility
export type { Supplier as Prestador };

// Create a default prestador object for use in the app
export const defaultProveedor: Supplier = {
  idProveedor: 0,
  nombreNegocio: '',
  descripcion: '',
  destacado: false,
  email: '',
  createdAt: '',
  updatedAt: '',
  usuario: {
    idUsuario: 0,
    nombre: '',
    email: '',
    contrasenaHash: '',
    fechaRegistro: '',
    activo: false,
    profilePictureUrl: null,
    idPlan: null,
    createdAt: '',
    updatedAt: '',
  },
};
