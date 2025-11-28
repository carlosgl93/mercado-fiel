import { Card, CardContent, Divider, Typography } from '@mui/material';
import React from 'react';
import { profileStyles } from '../styles';
import { EditableField } from './EditableField';
import { EditableStatusField } from './EditableStatusField';

interface ProfileInfoCardProps {
  nombre: string;
  email: string;
  activo: boolean;
  isEditingName: boolean;
  isEditingEmail: boolean;
  isEditingStatus: boolean;
  errors: Record<string, string>;
  isLoading: boolean;
  onToggleEdit: (field: string) => void;
  onInputChange: (field: string, value: any) => void;
  onSaveField: (field: string) => void;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
  nombre,
  email,
  activo,
  isEditingName,
  isEditingEmail,
  isEditingStatus,
  errors,
  isLoading,
  onToggleEdit,
  onInputChange,
  onSaveField,
}) => {
  return (
    <Card>
      <CardContent sx={profileStyles.infoCard}>
        <Typography variant="h6" gutterBottom>
          Información Personal
        </Typography>
        <Divider sx={profileStyles.divider} />

        <EditableField
          label="Nombre"
          value={nombre}
          isEditing={isEditingName}
          error={errors.nombre}
          isLoading={isLoading}
          onToggleEdit={() => onToggleEdit('name')}
          onChange={(value) => onInputChange('nombre', value)}
          onSave={() => onSaveField('nombre')}
        />

        <EditableField
          label="Email"
          value={email}
          type="email"
          isEditing={isEditingEmail}
          error={errors.email}
          isLoading={isLoading}
          onToggleEdit={() => onToggleEdit('email')}
          onChange={(value) => onInputChange('email', value)}
          onSave={() => onSaveField('email')}
        />

        <EditableStatusField
          label="Estado de la cuenta"
          activo={activo}
          isEditing={isEditingStatus}
          isLoading={isLoading}
          onToggleEdit={() => onToggleEdit('status')}
          onChange={(checked) => onInputChange('activo', checked)}
          onSave={() => onSaveField('activo')}
        />

        <Divider sx={profileStyles.statusDivider} />
      </CardContent>
    </Card>
  );
};
