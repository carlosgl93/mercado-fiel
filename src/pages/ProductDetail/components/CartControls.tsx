import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';

interface CartControlsProps {
  cartQuantity: number;
  product: any;
  onAdd: () => void;
  onRemove: () => void;
}

export const CartControls: React.FC<CartControlsProps> = ({
  cartQuantity,
  product,
  onAdd,
  onRemove,
}) => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        En tu carrito: {cartQuantity} {product.unitType === 'kg' ? 'kg' : 'unidades'}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton
          size="small"
          onClick={onRemove}
          sx={{
            border: 1,
            borderColor: 'primary.main',
            '&:hover': { bgcolor: 'primary.light' },
          }}
        >
          <RemoveIcon />
        </IconButton>

        <Typography
          variant="body1"
          sx={{
            minWidth: 40,
            textAlign: 'center',
            fontWeight: 'bold',
            mx: 2,
          }}
        >
          {cartQuantity}
        </Typography>

        <IconButton
          size="small"
          onClick={onAdd}
          sx={{
            border: 1,
            borderColor: 'primary.main',
            '&:hover': { bgcolor: 'primary.light' },
          }}
        >
          <AddIcon />
        </IconButton>

        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          {product.unitType === 'kg' ? 'kg' : 'unidades'}
        </Typography>
      </Box>
    </Box>
  );
};