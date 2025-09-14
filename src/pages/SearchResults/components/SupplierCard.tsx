import { Supplier } from '@/types/supplier';
import {
  LocationOn as LocationIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import {
  alpha,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';

interface SupplierCardProps {
  supplier: Supplier;
  onSupplierClick: (supplierId: number) => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  onSupplierClick,
}) => {
  const theme = useTheme();

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <Box display="flex" alignItems="center">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} sx={{ color: '#FF8A00', fontSize: 20 }} />
        ))}
        {hasHalfStar && (
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <StarIcon sx={{ color: '#d1d5db', fontSize: 20 }} />
            <StarIcon
              sx={{
                color: '#FF8A00',
                fontSize: 20,
                position: 'absolute',
                overflow: 'hidden',
                width: '50%',
              }}
            />
          </Box>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} sx={{ color: '#d1d5db', fontSize: 20 }} />
        ))}
        <Typography variant="body2" fontWeight="bold" sx={{ color: '#FF8A00', ml: 1 }}>
          {rating.toFixed(1)}
        </Typography>
      </Box>
    );
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
        },
        border: `1px solid ${theme.palette.divider}`,
      }}
      onClick={() => onSupplierClick(supplier.idProveedor)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'center', sm: 'flex-start' }}
          gap={3}
        >
          {/* Supplier Avatar */}
          <Avatar
            src={supplier.usuario?.profilePictureUrl || ''}
            sx={{
              width: 80,
              height: 80,
              border: `3px solid ${theme.palette.primary.main}`,
            }}
          >
            <Typography variant="h4" color="primary">
              {supplier.nombreNegocio?.charAt(0) || 'P'}
            </Typography>
          </Avatar>

          {/* Supplier Info */}
          <Box
            flex={1}
            textAlign={{ xs: 'center', sm: 'left' }}
          >
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ color: '#3A3A3A', mb: 1 }}
            >
              {supplier.nombreNegocio}
            </Typography>
            
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {supplier.descripcion || 'Sin descripción disponible'}
            </Typography>

            {/* Rating */}
            <Box sx={{ mb: 2 }}>
              {renderStars(4.5)} {/* TODO: Use real rating when available */}
            </Box>

            {/* Tags/Categories */}
            <Box
              display="flex"
              flexWrap="wrap"
              gap={1}
              justifyContent={{ xs: 'center', sm: 'flex-start' }}
            >
              {/* Mock categories - replace with real data */}
              {['Frutas', 'Verduras'].map((category) => (
                <Chip
                  key={category}
                  label={category}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                  }}
                />
              ))}
              
              {supplier.telefonoContacto && (
                <Chip
                  icon={<LocationIcon sx={{ fontSize: 16 }} />}
                  label="Entrega local"
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
