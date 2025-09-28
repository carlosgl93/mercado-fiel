import { useAuth } from '@/hooks/useAuthSupabase';
import { useShoppingCartService } from '@/services/shoppingCartService';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge, IconButton } from '@mui/material';
import React from 'react';

export const ShoppingCartButton: React.FC = () => {
  const { user } = useAuth();
  const { openCart, cartItems } = useShoppingCartService();

  // Only show cart for customers (not suppliers)
  if (!user?.data?.cliente?.idCliente) {
    return null;
  }

  const handleClick = () => {
    console.log('ShoppingCartButton clicked');
    openCart();
  };

  return (
    <IconButton onClick={handleClick} sx={{ color: 'primary.main' }}>
      <Badge
        badgeContent={cartItems?.reduce((total, item) => total + item.cantidad, 0) || 0}
        color="secondary"
      >
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};
