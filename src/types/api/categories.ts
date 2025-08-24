// Category-related types and interfaces (based on actual Prisma schema)

export interface Category {
  idCategoria: number;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryRequest {
  nombre: string;
}

export interface UpdateCategoryRequest {
  nombre: string;
}

export interface CategoriesListResponse {
  success: boolean;
  data: Category[];
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
}
