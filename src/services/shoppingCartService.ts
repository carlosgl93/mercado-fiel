import { carritoApi } from '@/api';
import { useAuth } from '@/hooks';
import { shoppingCartState } from '@/store/shoppingCart/shoppingCartState';
import { AddCartItemRequest, CartItem } from '@/types/carrito';
import { Product } from '@/types/products';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useRecoilState } from 'recoil';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

/**
 * Centralized shopping cart service to handle all cart operations consistently.
 * This service provides a unified interface for adding, removing, updating cart items,
 * and managing cart state across the application.
 */
export const useShoppingCartService = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cartRecoilState, setCartState] = useRecoilState(shoppingCartState);

  // Snackbar state for user feedback
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Helper to check if user is authenticated
  const ensureAuthenticated = (): boolean => {
    if (!user || !user?.data?.idUsuario) {
      setSnackbar({
        open: true,
        message: 'Debes iniciar sesión para usar el carrito de compras',
        severity: 'error',
      });
      return false;
    }
    return true;
  };

  // Fetch cart items
  const {
    data: cartData,
    isLoading: isLoadingCart,
    refetch: refetchCart,
  } = useQuery(
    ['cart', user?.data?.idUsuario],
    () => carritoApi.getCartItems(user!.data.idUsuario),
    {
      enabled: !!user?.data?.idUsuario,
      onSuccess: (data) => {
        setCartState((prev: any) => ({
          ...prev,
          items: data?.data?.items || [],
        }));
      },
    },
  );

  // Add item to cart mutation
  const addToCartMutation = useMutation(
    (data: AddCartItemRequest) => carritoApi.addCartItem(user!.data.idUsuario, data),
    {
      onSuccess: () => {
        setSnackbar({ 
          open: true, 
          message: 'Producto agregado al carrito', 
          severity: 'success' 
        });
        refetchCart();
      },
      onError: (error: any) => {
        console.error('Error adding to cart:', error);
        setSnackbar({
          open: true,
          message: error?.response?.data?.message || 'Error al agregar producto al carrito',
          severity: 'error',
        });
      },
    },
  );

  // Update cart item mutation
  const updateCartMutation = useMutation(
    ({ itemId, data }: { itemId: number; data: { cantidad: number } }) =>
      carritoApi.updateCartItem(user!.data.idUsuario, itemId, data),
    {
      onSuccess: () => {
        refetchCart();
      },
      onError: (error: any) => {
        console.error('Error updating cart item:', error);
        setSnackbar({ 
          open: true, 
          message: 'Error al actualizar cantidad', 
          severity: 'error' 
        });
      },
    },
  );

  // Remove cart item mutation
  const removeFromCartMutation = useMutation(
    (itemId: number) => carritoApi.removeCartItem(user!.data.idUsuario, itemId),
    {
      onSuccess: () => {
        setSnackbar({ 
          open: true, 
          message: 'Producto eliminado del carrito', 
          severity: 'success' 
        });
        refetchCart();
      },
      onError: (error: any) => {
        console.error('Error removing from cart:', error);
        setSnackbar({ 
          open: true, 
          message: 'Error al eliminar producto', 
          severity: 'error' 
        });
      },
    },
  );

  /**
   * Add a product to the cart
   * @param product - The product to add (can use Product object or just productId)
   * @param quantity - Quantity to add (default: 1)
   */
  const addProductToCart = (product: Product | number, quantity = 1) => {
    if (!ensureAuthenticated()) return;

    const productId = typeof product === 'number' ? product : product.idProducto;
    
    if (!productId) {
      console.error('Invalid product ID:', product);
      setSnackbar({
        open: true,
        message: 'Error: ID de producto inválido',
        severity: 'error',
      });
      return;
    }

    console.log('🛒 Adding to cart:', { id_producto: productId, cantidad: quantity });
    
    addToCartMutation.mutate({ 
      id_producto: productId, 
      cantidad: quantity 
    });
  };

  /**
   * Remove or decrease quantity of a product in the cart
   * @param product - The product to remove/decrease (can use Product object or just productId)
   * @param quantity - Quantity to remove (default: 1)
   */
  const removeProductFromCart = (product: Product | number, quantity = 1) => {
    if (!ensureAuthenticated()) return;
    console.log('🛒 Removing from cart:', { product, quantity });

    const productId = typeof product === 'number' ? product : product.idProducto;
    console.log({productId})
    
    // Find the cart item for this product
    console.log({cartData})
    const cartItem = cartData?.data?.items?.find(
      (item: CartItem) => {
        const itemProductId = (item as any).idProducto || item.id_producto;
        return itemProductId === productId;
      }
    );

    if (!cartItem) {
      console.warn('Cart item not found for product:', productId);
      return;
    }
    console.log({cartItem})

    const currentQuantity = cartItem.cantidad;
    const newQuantity = currentQuantity - quantity;

    if (newQuantity <= 0) {
      // Remove item completely
      const itemId = cartItem.id_carrito || cartItem.idCarrito;
      removeFromCartMutation.mutate(itemId);
    } else {
      // Update quantity
      const itemId = cartItem.id_carrito || cartItem.idCarrito;
      updateCartMutation.mutate({ 
        itemId, 
        data: { cantidad: newQuantity } 
      });
    }
  };

  /**
   * Get the current quantity of a product in the cart
   * @param productId - The product ID to check
   * @returns Current quantity in cart (0 if not found)
   */
  const getProductQuantityInCart = (productId: number): number => {
    if (!cartData?.data?.items) return 0;

    const cartItem = cartData.data.items.find((item: CartItem) => {
      const itemProductId = (item as any).idProducto || item.id_producto;
      return itemProductId === productId;
    });

    return cartItem?.cantidad || 0;
  };

  /**
   * Check if a product is in the cart
   * @param productId - The product ID to check
   * @returns True if product is in cart, false otherwise
   */
  const isProductInCart = (productId: number): boolean => {
    return getProductQuantityInCart(productId) > 0;
  };

  /**
   * Get all cart quantities as a mapping of productId -> quantity
   * @returns Record<productId, quantity>
   */
  const getCartQuantitiesMap = (): Record<number, number> => {
    const quantities: Record<number, number> = {};
    
    if (cartData?.data?.items) {
      cartData.data.items.forEach((item: CartItem) => {
        const productId = (item as any).idProducto || item.id_producto;
        if (productId) {
          quantities[productId] = item.cantidad;
        }
      });
    }

    return quantities;
  };

  /**
   * Clear all items from cart
   */
  const clearCart = async () => {
    if (!ensureAuthenticated()) return;

    try {
      // Remove all items one by one (if API doesn't have bulk clear)
      if (cartData?.data?.items) {
        const removePromises = cartData.data.items.map((item: CartItem) => {
          const itemId = item.id_carrito;
          return carritoApi.removeCartItem(user!.data.idUsuario, itemId);
        });
        
        await Promise.all(removePromises);
        refetchCart();
        setSnackbar({
          open: true,
          message: 'Carrito vaciado exitosamente',
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      setSnackbar({
        open: true,
        message: 'Error al vaciar el carrito',
        severity: 'error',
      });
    }
  };

  /**
   * Toggle cart drawer open/closed
   */
  const toggleCart = () => {
    setCartState((prev: any) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  /**
   * Open cart drawer
   */
  const openCart = () => {
    setCartState((prev: any) => ({ ...prev, isOpen: true }));
  };

  /**
   * Close cart drawer
   */
  const closeCart = () => {
    setCartState((prev: any) => ({ ...prev, isOpen: false }));
  };

  /**
   * Close snackbar notifications
   */
  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    // State
    cartData,
    cartItems: cartData?.data?.items || [],
    cartSummary: cartData?.data?.resumen,
    isLoadingCart,
    isUpdating: addToCartMutation.isLoading || updateCartMutation.isLoading || removeFromCartMutation.isLoading,
    snackbar,
    isCartOpen: (cartRecoilState as any).isOpen,

    // Core operations
    addProductToCart,
    removeProductFromCart,
    clearCart,

    // Utility functions
    getProductQuantityInCart,
    isProductInCart,
    getCartQuantitiesMap,

    // Cart UI controls
    toggleCart,
    openCart,
    closeCart,
    closeSnackbar,

    // Advanced operations
    refetchCart,
  };
};
