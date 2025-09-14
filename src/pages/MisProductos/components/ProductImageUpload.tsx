import { Close as CloseIcon, CloudUpload as CloudUploadIcon, Image as ImageIcon } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';

interface ProductImageUploadProps {
  imagePreview: string | null;
  errors: Record<string, string>;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  imagePreview,
  errors,
  onImageChange,
  onRemoveImage,
}) => {
  return (
    <Grid item xs={12}>
      <Box>
        <Typography variant="body1" gutterBottom>
          Imagen del Producto (Opcional)
        </Typography>

        {!imagePreview ? (
          <Box
            sx={{
              border: '2px dashed',
              borderColor: errors.imagen ? 'error.main' : 'grey.300',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
              },
            }}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography variant="body1" gutterBottom>
              Haz clic para seleccionar una imagen
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Formatos soportados: JPG, PNG, WebP (máx. 5MB)
            </Typography>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={onImageChange}
              style={{ display: 'none' }}
            />
          </Box>
        ) : (
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Box
              component="img"
              src={imagePreview}
              alt="Preview"
              sx={{
                width: '100%',
                maxWidth: 300,
                height: 200,
                objectFit: 'cover',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.300',
              }}
            />
            <IconButton
              onClick={onRemoveImage}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                },
              }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => document.getElementById('image-upload')?.click()}
                startIcon={<ImageIcon />}
              >
                Cambiar imagen
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={onImageChange}
                style={{ display: 'none' }}
              />
            </Box>
          </Box>
        )}

        {errors.imagen && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
            {errors.imagen}
          </Typography>
        )}
      </Box>
    </Grid>
  );
};
