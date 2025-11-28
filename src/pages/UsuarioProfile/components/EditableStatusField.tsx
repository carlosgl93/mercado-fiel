import { Close as CloseIcon, Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { Box, Button, CircularProgress, FormControlLabel, IconButton, Switch, Typography } from '@mui/material';
import React from 'react';
import { profileStyles } from '../styles';

interface EditableStatusFieldProps {
  label: string;
  activo: boolean;
  isEditing: boolean;
  isLoading?: boolean;
  onToggleEdit: () => void;
  onChange: (checked: boolean) => void;
  onSave: () => void;
}

export const EditableStatusField: React.FC<EditableStatusFieldProps> = ({
  label,
  activo,
  isEditing,
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
        <Box display="flex" alignItems="center" gap={2}>
          <FormControlLabel
            control={<Switch checked={activo} onChange={(e) => onChange(e.target.checked)} />}
            label={activo ? 'Cuenta activa' : 'Cuenta inactiva'}
          />
          <Button
            variant="contained"
            size="small"
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            onClick={onSave}
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </Box>
      ) : (
        <Typography>{activo ? 'Cuenta activa' : 'Cuenta inactiva'}</Typography>
      )}
    </Box>
  );
};
