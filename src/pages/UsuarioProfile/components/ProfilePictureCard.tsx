import { Person as PersonIcon, PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, Chip, CircularProgress, IconButton, Typography, useTheme } from '@mui/material';
import React from 'react';
import { profileStyles } from '../styles';

interface ProfilePictureCardProps {
  profilePictureUrl?: string;
  nombre: string;
  activo: boolean;
  isUploadingImage: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfilePictureCard: React.FC<ProfilePictureCardProps> = ({
  profilePictureUrl,
  nombre,
  activo,
  isUploadingImage,
  onImageUpload,
}) => {
  const theme = useTheme();

  return (
    <Card>
      <CardContent sx={profileStyles.profileCard}>
        <Box sx={profileStyles.avatarContainer}>
          <Avatar
            key={profilePictureUrl || 'no-image'}
            src={profilePictureUrl || ''}
            alt={nombre}
            sx={profileStyles.avatar}
            imgProps={{
              crossOrigin: 'anonymous',
              loading: 'eager',
            }}
          >
            {nombre ? nombre.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: 60 }} />}
          </Avatar>

          <IconButton
            component="label"
            disabled={isUploadingImage}
            sx={profileStyles.uploadButton(theme)}
          >
            {isUploadingImage ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <PhotoCameraIcon fontSize="small" />
            )}
            <input
              type="file"
              hidden
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
              onChange={onImageUpload}
            />
          </IconButton>
        </Box>

        <Typography variant="h6" gutterBottom>
          {nombre || 'Usuario'}
        </Typography>

        <Chip
          label={activo ? 'Activo' : 'Inactivo'}
          color={activo ? 'success' : 'default'}
          variant="outlined"
        />
      </CardContent>
    </Card>
  );
};
