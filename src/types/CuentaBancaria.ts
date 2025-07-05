export type CuentaBancaria = {
  id?: number;
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
  titular: string;
  rut: string;
  prestadorId: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: string | number | undefined;
};
