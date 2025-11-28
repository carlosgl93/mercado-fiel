import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';
import { Box, Button, CircularProgress, IconButton, TextField, Typography } from '@mui/material';
import React from 'react';
import { profileStyles } from '../styles';

interface EditableFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  error?: string;
  type?: string;
  isLoading?: boolean;
  onToggleEdit: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  isEditing,
  error,
  type = 'text',
  isLoading = false,
  onToggleEdit,
  onChange,
  onSave,
}) => {
  return (
    <Box sx={profileStyles.fieldContainer}>
      <Box sx={profileStyles.fieldHeader}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        <IconButton size="small" onClick={onToggleEdit} disabled={isLoading}>
          {isEditing ? <CloseIcon /> : <EditIcon />}
        </IconButton>
      </Box>

      {isEditing ? (
        <Box sx={profileStyles.editField}>
          <TextField
            fullWidth
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            helperText={error}
            size="small"
          />
          <Button
            variant="contained"
            size="small"
            onClick={onSave}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </Box>
      ) : (
        <Typography>{value || 'No especificado'}</Typography>
      )}
    </Box>
  );
};
