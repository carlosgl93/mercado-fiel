/**;
 *
 * @param dbCustomer: CustomerDB
 * @returns  Returns Customer
 *
 */

import { Customer, CustomerDB } from '../../models/Customer';

export function mapDBCustomer(dbCustomer: CustomerDB): Customer {
  return {
    idUsuario: dbCustomer.id_usuario,
    nombre: dbCustomer.nombre,
    email: dbCustomer.email,
    contrasenaHash: dbCustomer.contrasena_hash,
    tipoUsuario: dbCustomer.tipo_usuario,
    fechaRegistro: dbCustomer.fecha_registro,
    activo: dbCustomer.activo,
    createdAt: dbCustomer.created_at,
    updatedAt: dbCustomer.updated_at,
    profilePictureUrl: dbCustomer.profile_picture_url,
  };
}
