import { usersApi } from '@/api/users';
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

export const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  // Query for client data
  const {
    data: clientResponse,
    isLoading: isLoadingClient,
    error: clientError,
  } = useQuery({
    queryKey: ['client', id],
    queryFn: () => usersApi.getUser(parseInt(id || '0')),
    enabled: !!id,
  });

  const client = clientResponse?.data;

  if (isLoadingClient) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (clientError || !client) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          No se pudo cargar la información del cliente.
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/buscar')}>
          Volver al buscador
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: '#F6F6F4',
        minHeight: '100vh',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/buscar')}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                color: '#4CAF4F',
                transform: 'translateX(-5px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Volver al buscador
          </Button>
        </Box>

        {/* Main Content */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'white',
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              bgcolor: theme.palette.secondary.main,
              color: 'white',
              p: { xs: 3, md: 4 },
              textAlign: 'center',
            }}
          >
            <Avatar
              src={client.profilePictureUrl || ''}
              sx={{
                width: { xs: 100, md: 150 },
                height: { xs: 100, md: 150 },
                mx: 'auto',
                mb: 2,
                border: '4px solid white',
              }}
            >
              <PersonIcon sx={{ fontSize: { xs: 50, md: 75 } }} />
            </Avatar>

            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              sx={{ mb: 1 }}
            >
              {client.nombre || 'Usuario'}
            </Typography>

            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
              Cliente de Mercado Fiel
            </Typography>

            <Box display="flex" justifyContent="center" gap={1} flexWrap="wrap">
              <Chip
                icon={<VerifiedIcon />}
                label="Usuario Verificado"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
              />
              <Chip
                icon={<CalendarIcon />}
                label={`Miembro desde ${new Date(client.createdAt).getFullYear()}`}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
              />
            </Box>
          </Box>

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={4}>
              {/* Contact Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                    >
                      <PersonIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                      Información de Contacto
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {client.email && (
                        <Box display="flex" alignItems="center">
                          <EmailIcon sx={{ color: '#4CAF4F', mr: 2 }} />
                          <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                            {client.email}
                          </Typography>
                        </Box>
                      )}

                      {client.telefono && (
                        <Box display="flex" alignItems="center">
                          <PhoneIcon sx={{ color: '#4CAF4F', mr: 2 }} />
                          <Typography variant="body1">
                            {client.telefono}
                          </Typography>
                        </Box>
                      )}

                      {client.comuna && (
                        <Box display="flex" alignItems="center">
                          <LocationIcon sx={{ color: '#4CAF4F', mr: 2 }} />
                          <Typography variant="body1">
                            {client.comuna}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Activity Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                    >
                      <CalendarIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                      Información de Cuenta
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Fecha de registro:
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {new Date(client.createdAt).toLocaleDateString('es-CL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Última actividad:
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {new Date(client.updatedAt).toLocaleDateString('es-CL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Estado de la cuenta:
                        </Typography>
                        <Chip
                          label="Activa"
                          color="success"
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Profile Summary */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      sx={{ mb: 3 }}
                    >
                      Sobre este Cliente
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      {client.descripcion || 
                        `${client.nombre} es un cliente verificado de Mercado Fiel. Se unió a nuestra comunidad en ${new Date(client.createdAt).getFullYear()} y forma parte de nuestra red de compradores comprometidos con productos locales y sustentables.`
                      }
                    </Typography>

                    <Box display="flex" flexWrap="wrap" gap={1}>
                      <Chip
                        label="Cliente Activo"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label="Comprador Local"
                        color="secondary"
                        variant="outlined"
                      />
                      {client.comuna && (
                        <Chip
                          label={`Ubicado en ${client.comuna}`}
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>  
        </Paper>
      </Container>
    </Box>
  );
};

export default ClientDetail;
