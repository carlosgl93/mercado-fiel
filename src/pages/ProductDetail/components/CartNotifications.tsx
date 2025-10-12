import { Snackbar } from '@mui/material';
import React from 'react';

interface CartNotificationsProps {
  snackbar: {
    open: boolean;
    message: string;
  };
  onClose: () => void;
}

export const CartNotifications: React.FC<CartNotificationsProps> = ({
  snackbar,
  onClose,
}) => {
  return (
    <Snackbar
      open={snackbar.open}
      message={snackbar.message}
      autoHideDuration={3000}
      onClose={onClose}
    />
  );
};