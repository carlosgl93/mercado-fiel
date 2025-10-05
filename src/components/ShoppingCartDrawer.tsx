import { useShoppingCartRecoil } from '@/hooks/useShoppingCartRecoil';
import { Alert, Drawer, Snackbar } from '@mui/material';
import React from 'react';
import { CartDrawer } from '../pages/ExplorarProductos/components/CartDrawer';

export const ShoppingCartDrawer: React.FC = () => {
  const {
    isCartOpen,
    closeCart,
    cartData,
    loadingCart,
    handleUpdateCartQuantity,
    isUpdating,
    snackbar,
    closeSnackbar,
    handleRemoveItemById,
  } = useShoppingCartRecoil();

  console.log({
    cartData,
  });

  return (
    <>
      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={isCartOpen}
        onClose={closeCart}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100vw', sm: 400 },
          },
        }}
      >
        <CartDrawer
          cartData={cartData?.data}
          isLoading={loadingCart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveItemById}
          onClose={closeCart}
          isUpdating={isUpdating}
        />
      </Drawer>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
