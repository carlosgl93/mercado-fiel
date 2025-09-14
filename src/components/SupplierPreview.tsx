import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  LocalShipping as ShippingIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import React from 'react';

interface SupplierPreviewProps {
  supplierData: {
    nombreNegocio: string;
    descripcion: string;
    telefonoContacto?: string;
    email?: string;
    radioEntregaKm?: number;
    cobraEnvio: boolean;
    envioGratisDesde?: number;
    profilePictureUrl?: string;
    userName?: string;
    userEmail?: string;
  };
  isPreview?: boolean;
  onBack?: () => void;
}

// Mock data for preview
const mockProducts = [
  { name: 'Manzanas', image: '/api/placeholder/100/100?text=🍎' },
  { name: 'Plátanos', image: '/api/placeholder/100/100?text=🍌' },
  { name: 'Naranjas', image: '/api/placeholder/100/100?text=🍊' },
  { name: 'Aguacates', image: '/api/placeholder/100/100?text=🥑' },
  { name: 'Tomates', image: '/api/placeholder/100/100?text=🍅' },
  { name: 'Lechugas', image: '/api/placeholder/100/100?text=🥬' },
  { name: 'Fresas', image: '/api/placeholder/100/100?text=🍓' },
  { name: 'Limones', image: '/api/placeholder/100/100?text=🍋' },
];

const mockComments = [
  {
    author: 'Ana M.',
    text: '¡Excelentes productos! Todo llegó muy fresco y a tiempo. Recomiendo el aguacate.',
    rating: 5,
  },
  {
    author: 'Jorge G.',
    text: 'El servicio fue muy bueno. Solo un pequeño detalle con un par de tomates que venían un poco blandos.',
    rating: 4,
  },
  {
    author: 'María P.',
    text: 'Realmente satisfecho con la calidad de la fruta. ¡Se nota que son productos locales!',
    rating: 5,
  },
];

export const SupplierPreview: React.FC<SupplierPreviewProps> = ({
  supplierData,
  isPreview = false,
  onBack,
}) => {
  const theme = useTheme();
  const averageRating = 4.5;

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
        <Typography variant="body1" fontWeight="bold" sx={{ color: '#FF8A00', ml: 1 }}>
          {rating.toFixed(1)}
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        bgcolor: '#F6F6F4',
        minHeight: '100vh',
        p: { xs: 2, sm: 3 },
      }}
    >
      {/* Back Button */}
      {onBack && (
        <Box sx={{ mb: 3 }}>
          <IconButton
            onClick={onBack}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                color: '#4CAF4F',
                transform: 'translateX(-5px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ArrowBackIcon sx={{ mr: 1 }} />
            <Typography variant="body2">
              {isPreview ? 'Volver al editor' : 'Volver al buscador'}
            </Typography>
          </IconButton>
        </Box>
      )}

      {/* Main Content */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          p: { xs: 3, md: 4 },
          maxWidth: '4xl',
          mx: 'auto',
          bgcolor: 'white',
        }}
      >
        {/* Header */}
        <Box textAlign="center" sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            sx={{
              color: '#3A3A3A',
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem' },
            }}
          >
            {supplierData.nombreNegocio || 'Nombre del Negocio'}
          </Typography>
          
          {isPreview && !supplierData.nombreNegocio && (
            <Chip
              label="Completa el nombre del negocio"
              color="warning"
              size="small"
              sx={{ mb: 2 }}
            />
          )}
        </Box>

        {/* Profile Image */}
        <Box sx={{ mb: { xs: 4, sm: 6 }, textAlign: 'center' }}>
          {supplierData.profilePictureUrl ? (
            <Box
              component="img"
              src={supplierData.profilePictureUrl}
              alt={`Logo de ${supplierData.nombreNegocio}`}
              sx={{
                width: '100%',
                maxWidth: 800,
                height: { xs: 200, sm: 300, md: 400 },
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: theme.shadows[3],
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                maxWidth: 800,
                height: { xs: 200, sm: 300, md: 400 },
                bgcolor: '#4CAF4F',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                boxShadow: theme.shadows[3],
              }}
            >
              <Typography variant="h4" color="white" fontWeight="bold">
                {supplierData.nombreNegocio
                  ? `Logo de ${supplierData.nombreNegocio}`
                  : 'Sube tu logo aquí'}
              </Typography>
            </Box>
          )}
          
          {isPreview && !supplierData.profilePictureUrl && (
            <Chip
              label="Agrega tu logo para mayor profesionalismo"
              color="info"
              size="small"
              sx={{ mt: 2 }}
            />
          )}
        </Box>

        {/* Description Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="600"
            sx={{ color: '#3A3A3A', mb: 2 }}
          >
            Descripción
          </Typography>
          
          {supplierData.descripcion ? (
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 1.6,
                fontSize: '1.1rem',
              }}
            >
              {supplierData.descripcion}
            </Typography>
          ) : (
            <Box>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.disabled,
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                }}
              >
                Aquí aparecerá la descripción de tu negocio. Cuéntales a tus clientes sobre tu
                historia, productos principales y lo que te diferencia.
              </Typography>
              {isPreview && (
                <Chip
                  label="Agrega una descripción atractiva"
                  color="warning"
                  size="small"
                  sx={{ mt: 2 }}
                />
              )}
            </Box>
          )}
        </Box>

        {/* Contact Information Grid */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="600"
            sx={{ color: '#3A3A3A', mb: 3 }}
          >
            Información de Contacto
          </Typography>
          
          <Grid container spacing={2}>
            {supplierData.telefonoContacto && (
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <PhoneIcon sx={{ color: '#4CAF4F', mr: 1 }} />
                  <Typography variant="body1">{supplierData.telefonoContacto}</Typography>
                </Box>
              </Grid>
            )}
            
            {supplierData.email && (
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <EmailIcon sx={{ color: '#4CAF4F', mr: 1 }} />
                  <Typography variant="body1">{supplierData.email}</Typography>
                </Box>
              </Grid>
            )}
            
            {supplierData.radioEntregaKm && (
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <LocationIcon sx={{ color: '#4CAF4F', mr: 1 }} />
                  <Typography variant="body1">
                    Radio de entrega: {supplierData.radioEntregaKm} km
                  </Typography>
                </Box>
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <ShippingIcon sx={{ color: '#4CAF4F', mr: 1 }} />
                <Typography variant="body1">
                  {supplierData.cobraEnvio
                    ? `Envío gratis desde $${supplierData.envioGratisDesde || 0}`
                    : 'Envío siempre gratis'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Products Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="600"
            sx={{ color: '#3A3A3A', mb: 3 }}
          >
            Productos Disponibles
          </Typography>
          
          <Grid container spacing={2}>
            {mockProducts.map((product, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: 80,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                    }}
                  >
                    {product.name.charAt(0)}
                  </Box>
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="body2" fontWeight="500">
                      {product.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {isPreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Chip
                label="Aquí aparecerán tus productos cuando los agregues"
                color="info"
                size="small"
              />
            </Box>
          )}
        </Box>

        {/* Reviews Section */}
        <Box>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="600"
            sx={{ color: '#3A3A3A', mb: 3 }}
          >
            Valoraciones y Comentarios
          </Typography>
          
          <Box sx={{ mb: 4 }}>{renderStars(averageRating)}</Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {mockComments.map((comment, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  bgcolor: alpha(theme.palette.grey[100], 0.5),
                  borderRadius: 2,
                }}
              >
                <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ color: '#3A3A3A' }}>
                    {comment.author}
                  </Typography>
                  <Box sx={{ ml: 2 }}>{renderStars(comment.rating)}</Box>
                </Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {comment.text}
                </Typography>
              </Paper>
            ))}
          </Box>
          
          {isPreview && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Chip
                label="Las reseñas de tus clientes aparecerán aquí"
                color="info"
                size="small"
              />
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
