import {
  CreateProductRequest,
  CreateQuantityDiscountRequest,
  ProductFilters,
  ProductResponse,
  ProductsListResponse,
  QuantityDiscount,
  QuantityDiscountsResponse,
  UpdateProductRequest,
  UpdateQuantityDiscountRequest,
} from '@/types/products';
import {
  mapProductFromApi,
  mapProductToApi,
  mapQuantityDiscountFromApi,
  mapQuantityDiscountToApi,
} from '@/utils/caseMapping';
import api from './api';

const PRODUCTS_ENDPOINT = '/productos';

export const productsApi = {
  // Get all products with filters
  getProducts: async (filters: ProductFilters = {}): Promise<ProductsListResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`${PRODUCTS_ENDPOINT}?${params.toString()}`);

    // Map response to camelCase
    return {
      success: response.data.success,
      data: {
        productos: response.data.data.productos.map(mapProductFromApi),
        pagination: response.data.data.pagination,
      },
    };
  },

  // Get product by ID
  getProduct: async (id: number, includeStats = false): Promise<ProductResponse> => {
    const params = includeStats ? '?includeStats=true' : '';
    const response = await api.get(`${PRODUCTS_ENDPOINT}/${id}${params}`);

    return {
      success: response.data.success,
      data: mapProductFromApi(response.data.data),
    };
  },

  // Create new product
  createProduct: async (productData: CreateProductRequest): Promise<ProductResponse> => {
    const mappedData = mapProductToApi(productData);
    const response = await api.post(PRODUCTS_ENDPOINT, mappedData);

    return {
      success: response.data.success,
      data: mapProductFromApi(response.data.data),
    };
  },

  // Update product
  updateProduct: async (
    id: number,
    productData: UpdateProductRequest,
  ): Promise<ProductResponse> => {
    const mappedData = mapProductToApi(productData);
    const response = await api.put(`${PRODUCTS_ENDPOINT}/${id}`, mappedData);

    return {
      success: response.data.success,
      data: mapProductFromApi(response.data.data),
    };
  },

  // Toggle product availability
  toggleAvailability: async (
    id: number,
    disponible: boolean,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch(`${PRODUCTS_ENDPOINT}/${id}/disponibilidad`, { disponible });

    return {
      success: response.data.success,
      message: response.data.message,
    };
  },

  // Delete product
  deleteProduct: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`${PRODUCTS_ENDPOINT}/${id}`);

    return {
      success: response.data.success,
      message: response.data.message,
    };
  },

  // Get product stats
  getProductStats: async (id: number): Promise<any> => {
    const response = await api.get(`${PRODUCTS_ENDPOINT}/${id}/stats`);
    return response.data;
  },

  // Quantity Discounts endpoints
  getQuantityDiscounts: async (productId: number): Promise<QuantityDiscountsResponse> => {
    const response = await api.get(`${PRODUCTS_ENDPOINT}/${productId}/descuentos`);

    return {
      success: response.data.success,
      data: response.data.data.map(mapQuantityDiscountFromApi),
    };
  },

  addQuantityDiscounts: async (
    productId: number,
    discounts: CreateQuantityDiscountRequest[],
  ): Promise<{ success: boolean; message: string }> => {
    const mappedDiscounts = discounts.map(mapQuantityDiscountToApi);
    const response = await api.post(`${PRODUCTS_ENDPOINT}/${productId}/descuentos`, {
      descuentos: mappedDiscounts,
    });

    return {
      success: response.data.success,
      message: response.data.message,
    };
  },

  updateQuantityDiscount: async (
    productId: number,
    discountId: number,
    discountData: UpdateQuantityDiscountRequest,
  ): Promise<{ success: boolean; message: string; data: QuantityDiscount }> => {
    const mappedData = mapQuantityDiscountToApi(discountData);
    const response = await api.put(
      `${PRODUCTS_ENDPOINT}/${productId}/descuentos/${discountId}`,
      mappedData,
    );

    return {
      success: response.data.success,
      message: response.data.message,
      data: mapQuantityDiscountFromApi(response.data.data),
    };
  },

  deleteQuantityDiscount: async (
    productId: number,
    discountId: number,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`${PRODUCTS_ENDPOINT}/${productId}/descuentos/${discountId}`);

    return {
      success: response.data.success,
      message: response.data.message,
    };
  },
};
