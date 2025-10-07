import { useAuth } from '@/hooks/useAuthSupabase';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge, IconButton } from '@mui/material';
import React from 'react';
import { useShoppingCartRecoil } from '../hooks/useShoppingCartRecoil';

export const ShoppingCartButton: React.FC = () => {
  const { user } = useAuth();
  const { openCart, totalItems } = useShoppingCartRecoil();

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
      <Badge badgeContent={totalItems || 0} color="secondary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};
