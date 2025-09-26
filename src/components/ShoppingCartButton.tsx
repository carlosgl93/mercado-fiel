import { useAuth } from '@/hooks/useAuthSupabase';
import { useShoppingCartRecoil } from '@/hooks/useShoppingCartRecoil';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge, IconButton } from '@mui/material';
import React from 'react';

export const ShoppingCartButton: React.FC = () => {
  const { user } = useAuth();
  const { openCart, getTotalCartItems } = useShoppingCartRecoil();

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
      <Badge badgeContent={getTotalCartItems()} color="secondary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};
