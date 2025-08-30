import {
  AddCartItemRequest,
  CartItemsResponse,
  CartResponse,
  UpdateCartItemRequest,
} from '@/types/carrito';
import { mapCartItemFromApi, mapCartItemToApi } from '@/utils/caseMapping';
import api from './api';

export const carritoApi = {
  // Get cart items for current user
  getCartItems: async (userId: number): Promise<CartItemsResponse> => {
    const response = await api.get(`/carrito/${userId}`);

    return {
      success: response.data.success,
      data: {
        items: response.data.data.items.map(mapCartItemFromApi),
        resumen: mapCartItemFromApi(response.data.data.resumen),
      },
    };
  },

  // Add item to cart
  addCartItem: async (userId: number, itemData: AddCartItemRequest): Promise<CartResponse> => {
    const mappedData = mapCartItemToApi(itemData);
    const response = await api.post(`/carrito/${userId}`, mappedData);

    return {
      success: response.data.success,
      data: mapCartItemFromApi(response.data.data),
      message: response.data.message,
    };
  },

  // Update cart item quantity
  updateCartItem: async (
    userId: number,
    itemId: number,
    itemData: UpdateCartItemRequest,
  ): Promise<CartResponse> => {
    const mappedData = mapCartItemToApi(itemData);
    const response = await api.put(`/carrito/${userId}/${itemId}`, mappedData);

    return {
      success: response.data.success,
      data: mapCartItemFromApi(response.data.data),
      message: response.data.message,
    };
  },

  // Remove item from cart
  removeCartItem: async (
    userId: number,
    itemId: number,
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/carrito/${userId}/${itemId}`);

    return {
      success: response.data.success,
      message: response.data.message,
    };
  },

  // Clear entire cart
  clearCart: async (userId: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/carrito/${userId}`);

    return {
      success: response.data.success,
      message: response.data.message,
    };
  },

  // Get cart summary (total items, total price)
  getCartSummary: async (
    userId: number,
  ): Promise<{
    success: boolean;
    data: {
      totalItems: number;
      totalPrice: number;
      totalDiscount: number;
      finalPrice: number;
    };
  }> => {
    const response = await api.get(`/carrito/${userId}/resumen`);

    return {
      success: response.data.success,
      data: response.data.data,
    };
  },
};
