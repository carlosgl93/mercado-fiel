/**;
 *
 * @param dbCustomer: CustomerDB
 * @returns  Returns Customer
 *
 */

import { mapDBUser } from '../../models';
import { Customer, CustomerDB } from '../../models/Customer';

export function mapDBCustomer(dbCustomer: CustomerDB): Customer {
  return {
    idCliente: dbCustomer.id_cliente,
    idUsuario: dbCustomer.id_usuario,
    idDireccion: dbCustomer.id_direccion ?? null,
    telefono: dbCustomer.telefono ?? null,
    fechaRegistro: dbCustomer.fecha_registro,
    createdAt: dbCustomer.created_at,
    updatedAt: dbCustomer.updated_at,
    activo: dbCustomer.usuario?.activo ?? false,
    profilePictureUrl: dbCustomer.usuario?.profile_picture_url ?? null,
    usuario: mapDBUser(dbCustomer.usuario),
    direccion: dbCustomer.direccion
      ? {
          idDireccion: dbCustomer.direccion.id_direccion,
          calle: dbCustomer.direccion.calle,
          numero: dbCustomer.direccion.numero,
          departamento: dbCustomer.direccion.departamento ?? null,
          idComuna: dbCustomer.direccion.id_comuna,
          idRegion: dbCustomer.direccion.id_region,
          codigoPostal: dbCustomer.direccion.codigo_postal ?? null,
          referencia: dbCustomer.direccion.referencia ?? null,
          latitud: dbCustomer.direccion.latitud ?? null,
          longitud: dbCustomer.direccion.longitud ?? null,
          direccionCompleta: dbCustomer.direccion.direccion_completa ?? null,
          activa: dbCustomer.direccion.activa,
          createdAt: dbCustomer.direccion.created_at,
          updatedAt: dbCustomer.direccion.updated_at,
          comuna: dbCustomer.direccion.comuna
            ? {
                idComuna: dbCustomer.direccion.comuna.id_comuna,
                idRegion: dbCustomer.direccion.comuna.id_region,
                nombre: dbCustomer.direccion.comuna.nombre,
                createdAt: dbCustomer.direccion.comuna.created_at,
                updatedAt: dbCustomer.direccion.comuna.updated_at,
                region: dbCustomer.direccion.comuna.region
                  ? {
                      idRegion: dbCustomer.direccion.comuna.region.id_region,
                      codigoRegion: dbCustomer.direccion.comuna.region.codigo_region,
                      nombre: dbCustomer.direccion.comuna.region.nombre,
                      createdAt: dbCustomer.direccion.comuna.region.created_at,
                      updatedAt: dbCustomer.direccion.comuna.region.updated_at,
                    }
                  : undefined,
              }
            : undefined,
        }
      : undefined,
  };
}
