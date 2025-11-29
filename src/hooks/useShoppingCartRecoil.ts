import { carritoApi } from '@/api';
import { trackAddToCart, trackRemoveFromCart } from '@/services/analyticsService';
import { cartTotalItemsSelector, shoppingCartState } from '@/store/shoppingCart/shoppingCartState';
import { AddCartItemRequest, CamelCartItem } from '@/types/carrito';
import { Product } from '@/types/products';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useAuth } from './useAuthSupabase';

export const useShoppingCartRecoil = () => {
  const { user } = useAuth();
  const [cartState, setCartState] = useRecoilState(shoppingCartState);
  const totalItems = useRecoilValue(cartTotalItemsSelector);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Query for cart items
  const {
    data: cartData,
    isLoading: loadingCart,
    refetch: refetchCart,
  } = useQuery(
    ['carrito', user?.data.idUsuario],
    () => carritoApi.getCartItems(user!.data.idUsuario),
    {
      enabled: !!user,
      onSuccess: (data) => {
        // Update Recoil state with fetched cart items
        setCartState((prev) => ({
          ...prev,
          items: data?.data?.items || [],
        }));
      },
    },
  );

  // Mutations for cart operations
  const addToCartMutation = useMutation(
    (data: AddCartItemRequest & { product?: Product }) => 
      carritoApi.addCartItem(user!.data.idUsuario, { id_producto: data.id_producto, cantidad: data.cantidad }),
    {
      onSuccess: (_, variables) => {
        setSnackbar({ open: true, message: 'Producto agregado al carrito', severity: 'success' });
        
        // Track add to cart event
        if (variables.product) {
          trackAddToCart(variables.product, variables.cantidad, user?.data?.idUsuario);
        }
        
        refetchCart();
      },
      onError: () => {
        setSnackbar({
          open: true,
          message: 'Error al agregar producto al carrito',
          severity: 'error',
        });
      },
    },
  );

  const updateCartMutation = useMutation(
    ({ itemId, data }: { itemId: number; data: { cantidad: number } }) =>
      carritoApi.updateCartItem(user!.data.idUsuario, itemId, data),
    {
      onSuccess: () => {
        refetchCart();
      },
      onError: () => {
        setSnackbar({ open: true, message: 'Error al actualizar cantidad', severity: 'error' });
      },
    },
  );

  const removeFromCartMutation = useMutation(
    (params: { itemId: number; product?: Product; quantity?: number }) => 
      carritoApi.removeCartItem(user!.data.idUsuario, params.itemId),
    {
      onSuccess: (_, variables) => {
        setSnackbar({ open: true, message: 'Producto eliminado del carrito', severity: 'success' });
        
        // Track remove from cart event
        if (variables.product) {
          trackRemoveFromCart(variables.product, variables.quantity || 1, user?.data?.idUsuario);
        }
        
        refetchCart();
      },
      onError: () => {
        setSnackbar({ open: true, message: 'Error al eliminar producto', severity: 'error' });
      },
    },
  );

  // Cart actions
  const openCart = () => {
    setCartState((prev) => ({ ...prev, isOpen: true }));
  };

  const closeCart = () => {
    setCartState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleAddToCart = (productId: number, cantidad = 1, product?: Product) => {
    console.log('🛒 Cart operation starting...');
    console.log('🛒 Full user object:', user);
    console.log('🛒 User ID:', user?.data?.idUsuario);

    if (!user || !user?.data?.idUsuario) {
      console.log('🚫 No user ID available for cart operation');
      console.log('🚫 User state:', user);
      setSnackbar({
        open: true,
        message: 'Debes iniciar sesión para agregar productos al carrito',
        severity: 'error',
      });
      return;
    }

    addToCartMutation.mutate({ id_producto: productId, cantidad, product });
  };

  const handleRemoveFromCart = (productId: number, cantidad = 1, product?: Product) => {
    if (!user) return;

    // Find the cart item for this product
    const cartItem = cartData?.data.items.find(
      (item: CamelCartItem) => item.idProducto === productId,
    );
    if (!cartItem) return;

    const newQuantity = cartItem.cantidad - cantidad;
    const itemId = cartItem.idCarrito;

    if (newQuantity <= 0) {
      // Remove the item completely
      removeFromCartMutation.mutate({ itemId, product, quantity: cartItem.cantidad });
    } else {
      // Update the quantity
      updateCartMutation.mutate({
        itemId: itemId,
        data: { cantidad: newQuantity },
      });
    }
  };

  const handleRemoveProductCompletely = (productId: number, product?: Product) => {
    if (!user) return;

    // Find the cart item for this product
    const cartItem = cartData?.data.items.find(
      (item: CamelCartItem) => item.idProducto === productId,
    );
    if (!cartItem) {
      console.warn(`🛒 Product with ID ${productId} not found in cart`);
      return;
    }

    const itemId = cartItem.idCarrito;
    console.log(`🛒 Removing product ${productId} completely from cart (item ID: ${itemId})`);

    // Remove the item completely regardless of quantity
    removeFromCartMutation.mutate({ itemId, product, quantity: cartItem.cantidad });
  };

  const handleRemoveItemById = (itemId: number, product?: Product, quantity?: number) => {
    if (!user || !itemId) {
      console.error('🚫 No user or itemId provided for cart operation');
      setSnackbar({
        open: true,
        message: 'Error: Usuario o ID del item no válido',
        severity: 'error',
      });
      return;
    }

    console.log(`🛒 Removing cart item with ID: ${itemId}`);
    removeFromCartMutation.mutate({ itemId, product, quantity });
  };

  const handleUpdateCartQuantity = (itemId: number, cantidad: number, product?: Product) => {
    console.log('🛒 Update/Remove cart item - itemId:', itemId, 'cantidad:', cantidad);
    console.log('🛒 Cart data items:', cartData?.data?.items);

    if (!itemId) {
      console.error('🚫 No itemId provided for cart operation');
      setSnackbar({
        open: true,
        message: 'Error: ID del item no válido',
        severity: 'error',
      });
      return;
    }

    // Find the current item to get quantity for analytics
    const currentItem = cartData?.data.items.find(
      (item: CamelCartItem) => item.idCarrito === itemId,
    );

    if (cantidad <= 0) {
      console.log('🛒 Removing item with ID:', itemId);
      removeFromCartMutation.mutate({ 
        itemId, 
        product, 
        quantity: currentItem?.cantidad || 1 
      });
    } else {
      console.log('🛒 Updating item quantity - ID:', itemId, 'new quantity:', cantidad);
      updateCartMutation.mutate({ itemId, data: { cantidad } });
    }
  };

  const getCartItemQuantity = (productId: number): number => {
    const cartItem = cartData?.data.items.find(
      (item: CamelCartItem) => item.idProducto === productId,
    );
    return cartItem?.cantidad || 0;
  };

  const getTotalCartItems = (): number => {
    return (
      cartData?.data.items.reduce(
        (total: number, item: CamelCartItem) => total + item.cantidad,
        0,
      ) || 0
    );
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    // State
    isCartOpen: cartState.isOpen,
    cartData,
    loadingCart,
    snackbar,
    totalItems,

    // Actions
    openCart,
    closeCart,
    handleAddToCart,
    handleRemoveFromCart,
    handleRemoveProductCompletely,
    handleRemoveItemById,
    handleUpdateCartQuantity,
    closeSnackbar,

    // Helpers
    getCartItemQuantity,
    getTotalCartItems,

    // Mutations loading states
    isUpdating:
      addToCartMutation.isLoading ||
      updateCartMutation.isLoading ||
      removeFromCartMutation.isLoading,
  };
};
