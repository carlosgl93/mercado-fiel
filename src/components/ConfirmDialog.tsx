import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from '@mui/material';
import React from 'react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmColor = 'primary',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: '1.25rem',
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            color: theme.palette.text.primary,
            fontSize: '1rem',
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          gap: 1,
        }}
      >
        <Button
          onClick={onCancel}
          variant="outlined"
          disabled={isLoading}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          disabled={isLoading}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          {isLoading ? 'Procesando...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
