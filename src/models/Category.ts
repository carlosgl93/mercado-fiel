export type CategoryDB = {
  id_categoria: number;
  nombre: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const mapDBCategoryToCategory = (categoryDB: CategoryDB): Category => {
  return {
    id: categoryDB.id_categoria.toString(),
    name: categoryDB.nombre,
    createdAt: categoryDB.created_at,
    updatedAt: categoryDB.updated_at,
  };
};
