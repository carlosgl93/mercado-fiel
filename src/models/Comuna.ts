export type ComunaDB = {
  created_at: string;
  id_comuna: number;
  id_region: number;
  nombre: string;
  updated_at: string;
};

export type Comuna = {
  id: number;
  name: string;
  regionId: number;
  createdAt: string;
  updatedAt: string;
};

export const mapComunaDBToComuna = (comuna: ComunaDB): Comuna => ({
  id: comuna.id_comuna,
  name: comuna.nombre,
  regionId: comuna.id_region,
  createdAt: comuna.created_at,
  updatedAt: comuna.updated_at,
});
