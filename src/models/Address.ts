import { Direcciones } from '../../functions/prisma/models';
import { Comuna } from './Comuna';

export type AddressDB = Direcciones;
export type Address = {
  idDireccion: number;
  calle: string;
  numero?: string | null;
  departamento?: string | null;
  idComuna: number;
  idRegion: number;
  codigoPostal?: string | null;
  referencia?: string | null;
  latitud?: string | null;
  longitud?: string | null;
  direccionCompleta?: string | null;
  activa: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  comuna?: Comuna;
  region?: Region;
};

export type Region = {
  idRegion: number;
  codigoRegion: string;
  nombre: string;
  createdAt: string;
  updatedAt: string;
  comunas?: Comuna[];
  direcciones?: Address[];
};

export const mapDBAddress = (address: AddressDB): Address => {
  return {
    idDireccion: address.id_direccion,
    calle: address.calle,
    numero: address.numero,
    departamento: address.departamento,
    idComuna: address.id_comuna,
    idRegion: address.id_region,
    codigoPostal: address.codigo_postal,
    referencia: address.referencia,
    latitud: address.latitud ? address.latitud.toString() : null,
    longitud: address.longitud ? address.longitud.toString() : null,
    direccionCompleta: address.direccion_completa,
    activa: address.activa,
    createdAt: address.created_at,
    updatedAt: address.updated_at,
  };
};
