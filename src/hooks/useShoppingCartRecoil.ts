import { carritoApi } from '@/api';
import { cartTotalItemsSelector, shoppingCartState } from '@/store/shoppingCart/shoppingCartState';
import { AddCartItemRequest, CartItem } from '@/types/carrito';
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
    (data: AddCartItemRequest) => carritoApi.addCartItem(user!.data.idUsuario, data),
    {
      onSuccess: () => {
        setSnackbar({ open: true, message: 'Producto agregado al carrito', severity: 'success' });
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
    (itemId: number) => carritoApi.removeCartItem(user!.data.idUsuario, itemId),
    {
      onSuccess: () => {
        setSnackbar({ open: true, message: 'Producto eliminado del carrito', severity: 'success' });
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

  const handleAddToCart = (productId: number, cantidad = 1) => {
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

    addToCartMutation.mutate({ id_producto: productId, cantidad });
  };

  const handleRemoveFromCart = (productId: number, cantidad = 1) => {
    if (!user) return;

    // Find the cart item for this product
    const cartItem = cartData?.data.items.find(
      (item: CartItem) => ((item as any).idProducto || item.id_producto) === productId,
    );
    if (!cartItem) return;

    const newQuantity = cartItem.cantidad - cantidad;
    const itemId = (cartItem as any).idCarrito || cartItem.id_carrito;

    if (newQuantity <= 0) {
      // Remove the item completely
      removeFromCartMutation.mutate(itemId);
    } else {
      // Update the quantity
      updateCartMutation.mutate({
        itemId: itemId,
        data: { cantidad: newQuantity },
      });
    }
  };

  const handleUpdateCartQuantity = (itemId: number, cantidad: number) => {
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

    if (cantidad <= 0) {
      console.log('🛒 Removing item with ID:', itemId);
      removeFromCartMutation.mutate(itemId);
    } else {
      console.log('🛒 Updating item quantity - ID:', itemId, 'new quantity:', cantidad);
      updateCartMutation.mutate({ itemId, data: { cantidad } });
    }
  };

  const getCartItemQuantity = (productId: number): number => {
    const cartItem = cartData?.data.items.find(
      (item: CartItem) => ((item as any).idProducto || item.id_producto) === productId,
    );
    return cartItem?.cantidad || 0;
  };

  const getTotalCartItems = (): number => {
    return (
      cartData?.data.items.reduce((total: number, item: CartItem) => total + item.cantidad, 0) || 0
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
