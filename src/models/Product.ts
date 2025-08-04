import { categorias, productos } from '../../functions/prisma/models';

export interface ProductDB extends productos {
  comentarios: {
    id_comentario: number;
    texto: string;
    calificacion: number;
  }[];
  categoria: categorias;
}
export type ProductForSupplierDB = {
  nombre_producto: string;
  precio_unitario: string;
  disponible: boolean;
  fecha_publicacion: string;
  comentarios: {
    id_comentario: number;
    texto: string;
    calificacion: number;
  }[];
  categoria: {
    id_categoria: number;
    nombre: string;
  };
  descripcion: string;
  imagen_url?: string;
};

export type ProductForSupplier = {
  nombreProducto: string;
  precioUnitario: string;
  disponible: boolean;
  fechaPublicacion: string;
  comentarios: {
    idComentario: number;
    texto: string;
    calificacion: number;
  }[];
  categoria: {
    idCategoria: number;
    nombre: string;
  };
  descripcion: string | null;
  imagenUrl?: string | null;
};

export function mapProductForSupplier(product: ProductForSupplierDB): ProductForSupplier {
  return {
    nombreProducto: product.nombre_producto,
    precioUnitario: product.precio_unitario,
    disponible: product.disponible,
    fechaPublicacion: product.fecha_publicacion,
    comentarios: product.comentarios.map((c) => ({
      idComentario: c.id_comentario,
      texto: c.texto,
      calificacion: c.calificacion,
    })),
    categoria: {
      idCategoria: product.categoria.id_categoria,
      nombre: product.categoria.nombre,
    },
    descripcion: product.descripcion,
    imagenUrl: product.imagen_url,
  };
}
