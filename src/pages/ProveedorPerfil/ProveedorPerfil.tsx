import { suppliersApi } from '@/api/suppliers';
import { usersApi } from '@/api/users';
import { useAuth } from '@/hooks/useAuthSupabase';
import { UpdateBusinessRequest } from '@/types/supplier';
import { uploadImageToSupabase } from '@/utils/supabaseStorage';
import {
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import {
  Alert,
  alpha,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

export const ProveedorPerfil = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { supplier, user } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<UpdateBusinessRequest>({
    nombreNegocio: '',
    descripcion: '',
    telefonoContacto: '',
    email: '',
    radioEntregaKm: 10,
    cobraEnvio: true,
    envioGratisDesde: 0,
  });

  const [profileData, setProfileData] = useState({
    profilePictureUrl: '',
    previewUrl: '',
  });

  const [userProfileData, setUserProfileData] = useState({
    nombre: '',
    email: '',
    isEditingName: false,
    isEditingEmail: false,
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Query for current supplier data
  const {
    data: supplierResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['supplier', 'current'],
    queryFn: () => suppliersApi.getSupplier(supplier?.idProveedor || 0),
    enabled: !!supplier?.idProveedor,
  });

  // Mutation for updating business info
  const updateBusinessMutation = useMutation({
    mutationFn: (businessData: UpdateBusinessRequest) =>
      suppliersApi.updateBusiness(supplier?.idProveedor || 0, businessData),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['supplier']);
      setSnackbar({
        open: true,
        message: response.message || 'Información actualizada exitosamente',
        severity: 'success',
      });
      navigate('/proveedor-dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar la información';
      setSnackbar({
        open: true,
        message,
        severity: 'error',
      });
    },
  });

  // Mutation for updating profile picture
  const updateProfileMutation = useMutation({
    mutationFn: (profilePictureUrl: string) =>
      usersApi.updateProfile(user?.data?.id_usuario || 0, { profilePictureUrl }),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['supplier']);
      queryClient.invalidateQueries(['user']);
      setSnackbar({
        open: true,
        message: 'Foto de perfil actualizada exitosamente',
        severity: 'success',
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar la foto de perfil';
      setSnackbar({
        open: true,
        message,
        severity: 'error',
      });
    },
  });

  // Mutation for updating user profile (name, email)
  const updateUserProfileMutation = useMutation({
    mutationFn: (userData: { nombre?: string; email?: string }) =>
      usersApi.updateProfile(user?.data?.id_usuario || 0, userData),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['supplier']);
      queryClient.invalidateQueries(['user']);
      setSnackbar({
        open: true,
        message: 'Perfil actualizado exitosamente',
        severity: 'success',
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Error al actualizar el perfil';
      setSnackbar({
        open: true,
        message,
        severity: 'error',
      });
    },
  });

  // Initialize form data when supplier data loads
  useEffect(() => {
    if (supplierResponse?.data) {
      const supplierData = supplierResponse.data;
      setFormData({
        nombreNegocio: supplierData.nombreNegocio || '',
        descripcion: supplierData.descripcion || '',
        telefonoContacto: supplierData.telefonoContacto || '',
        email: supplierData.email || '',
        radioEntregaKm: supplierData.radioEntregaKm || 10,
        cobraEnvio: supplierData.cobraEnvio ?? true,
        envioGratisDesde: supplierData.envioGratisDesde || 0,
      });
    }
  }, [supplierResponse]);

  // Initialize profile picture when user data loads
  useEffect(() => {
    if (user?.data?.profile_picture_url) {
      setProfileData({
        profilePictureUrl: user.data.profile_picture_url,
        previewUrl: user.data.profile_picture_url,
      });
    }

    // Initialize user profile data
    if (user?.data) {
      setUserProfileData({
        nombre: user.data.nombre || '',
        email: user.data.email || '',
        isEditingName: false,
        isEditingEmail: false,
      });
    }
  }, [user]);

  const handleInputChange =
    (field: keyof UpdateBusinessRequest) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: field === 'radioEntregaKm' || field === 'envioGratisDesde' ? value : value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    };

  const handleSwitchChange =
    (field: keyof UpdateBusinessRequest) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.checked,
      }));
    };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);

      try {
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setProfileData((prev) => ({
          ...prev,
          previewUrl,
        }));

        // Upload to Supabase Storage
        const uploadResult = await uploadImageToSupabase(file, 'profile-images', 'suppliers');

        if (uploadResult.success && uploadResult.url) {
          setProfileData((prev) => ({
            ...prev,
            profilePictureUrl: uploadResult.url!,
          }));

          setSnackbar({
            open: true,
            message:
              'Imagen cargada exitosamente. Haz clic en "Guardar Logo" para aplicar los cambios.',
            severity: 'success',
          });
        } else {
          setSnackbar({
            open: true,
            message: uploadResult.error || 'Error al cargar la imagen',
            severity: 'error',
          });

          // Reset preview if upload failed
          setProfileData((prev) => ({
            ...prev,
            previewUrl: prev.profilePictureUrl,
          }));
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setSnackbar({
          open: true,
          message: 'Error inesperado al cargar la imagen',
          severity: 'error',
        });
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleProfilePictureSubmit = () => {
    if (
      profileData.profilePictureUrl &&
      profileData.profilePictureUrl !== user?.data?.profile_picture_url
    ) {
      updateProfileMutation.mutate(profileData.profilePictureUrl);
    }
  };

  const handleUserFieldEdit = (field: 'nombre' | 'email', isEditing: boolean) => {
    setUserProfileData((prev) => ({
      ...prev,
      [field === 'nombre' ? 'isEditingName' : 'isEditingEmail']: isEditing,
    }));
  };

  const handleUserFieldChange = (field: 'nombre' | 'email', value: string) => {
    setUserProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUserFieldSave = (field: 'nombre' | 'email') => {
    const value = userProfileData[field];
    if (value.trim() && value !== user?.data?.[field]) {
      updateUserProfileMutation.mutate({ [field]: value.trim() });
    }
    handleUserFieldEdit(field, false);
  };

  const handleUserFieldCancel = (field: 'nombre' | 'email') => {
    setUserProfileData((prev) => ({
      ...prev,
      [field]: user?.data?.[field] || '',
    }));
    handleUserFieldEdit(field, false);
  };

  // Helper function to get missing profile requirements
  const getMissingProfileRequirements = () => {
    const missing = [];

    if (!supplier?.nombreNegocio?.trim()) {
      missing.push('Nombre del negocio');
    }

    if (!supplier?.descripcion?.trim()) {
      missing.push('Descripción del negocio');
    }

    if (!user?.data?.profile_picture_url?.trim()) {
      missing.push('Logo/Foto de perfil');
    }

    return missing;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombreNegocio?.trim()) {
      newErrors.nombreNegocio = 'El nombre del negocio es requerido';
    }

    if (formData.telefonoContacto && !/^[+]?[0-9\s-]{8,15}$/.test(formData.telefonoContacto)) {
      newErrors.telefonoContacto = 'Formato de teléfono inválido';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if ((formData.radioEntregaKm || 0) < 1 || (formData.radioEntregaKm || 0) > 100) {
      newErrors.radioEntregaKm = 'El radio de entrega debe estar entre 1 y 100 km';
    }

    if ((formData.envioGratisDesde || 0) < 0) {
      newErrors.envioGratisDesde = 'El monto mínimo no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    updateBusinessMutation.mutate(formData);
  };

  const handleBackToDashboard = () => {
    navigate('/proveedor-dashboard');
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography>Cargando información del perfil...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="error">
          Error al cargar la información del perfil. Por favor intenta nuevamente.
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 2,
          }}
        >
          <Box display="flex" alignItems="center">
            <IconButton
              onClick={handleBackToDashboard}
              sx={{
                mr: 2,
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.contrastText, 0.1),
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box flexGrow={1}>
              <Breadcrumbs
                aria-label="breadcrumb"
                sx={{
                  mb: 1,
                  '& .MuiBreadcrumbs-separator': {
                    color: 'primary.contrastText',
                  },
                }}
              >
                <Link
                  underline="hover"
                  color="inherit"
                  href="#"
                  onClick={handleBackToDashboard}
                  sx={{ color: 'primary.contrastText' }}
                >
                  Dashboard
                </Link>
                <Typography color="inherit">Mi Perfil de Proveedor</Typography>
              </Breadcrumbs>
              {isMobile ? null : (
                <>
                  <Typography
                    variant="h4"
                    component="h1"
                    display="flex"
                    alignItems="center"
                    color="inherit"
                  >
                    <BusinessIcon sx={{ mr: 2, fontSize: 32 }} />
                    Mi Perfil de Proveedor
                  </Typography>
                  <Typography variant="body1" color="inherit" sx={{ opacity: 0.9 }}>
                    Actualiza la información de tu negocio para que los clientes te encuentren
                    fácilmente
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Profile Picture Section */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: 'fit-content',
                position: 'sticky',
                top: 20,
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <PersonIcon sx={{ mr: 1 }} />
                  Logo de tu Marca
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Avatar
                    src={profileData.previewUrl || user?.data?.profile_picture_url || ''}
                    sx={{
                      width: 120,
                      height: 120,
                      margin: '0 auto',
                      mb: 2,
                      border: `4px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 60 }} />
                  </Avatar>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 2, display: 'block' }}
                  >
                    Esta imagen debería ser el logo de tu marca.
                  </Typography>

                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-picture-upload"
                    type="file"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                  />
                  <label htmlFor="profile-picture-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={
                        isUploadingImage ? <CircularProgress size={16} /> : <PhotoCameraIcon />
                      }
                      sx={{ mb: 2 }}
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? 'Subiendo...' : 'Cambiar Logo'}
                    </Button>
                  </label>
                </Box>

                {profileData.profilePictureUrl !== user?.data?.profile_picture_url && (
                  <Button
                    variant="contained"
                    onClick={handleProfilePictureSubmit}
                    disabled={updateProfileMutation.isLoading}
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    {updateProfileMutation.isLoading ? 'Guardando...' : 'Guardar Logo'}
                  </Button>
                )}

                <Divider sx={{ my: 2 }} />

                {/* User Profile Information */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Información Personal
                  </Typography>

                  {/* Name Field */}
                  <Box sx={{ mb: 2 }}>
                    {userProfileData.isEditingName ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <TextField
                          size="small"
                          value={userProfileData.nombre}
                          onChange={(e) => handleUserFieldChange('nombre', e.target.value)}
                          placeholder="Nombre"
                          autoFocus
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleUserFieldSave('nombre')}
                          color="primary"
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleUserFieldCancel('nombre')}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap={1}
                          justifyContent={'start'}
                          width={'100%'}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Nombre
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {user?.data?.nombre || 'Sin nombre'}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleUserFieldEdit('nombre', true)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  {/* Email Field */}
                  <Box sx={{ mb: 2 }}>
                    {userProfileData.isEditingEmail ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <TextField
                          size="small"
                          type="email"
                          value={userProfileData.email}
                          onChange={(e) => handleUserFieldChange('email', e.target.value)}
                          placeholder="Email"
                          autoFocus
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleUserFieldSave('email')}
                          color="primary"
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleUserFieldCancel('email')}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap={1}
                          justifyContent={'start'}
                          width={'100%'}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Email
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {user?.data?.email || 'Sin email'}
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={() => handleUserFieldEdit('email', true)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Profile Completion Status */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Estado del Perfil
                  </Typography>

                  {(() => {
                    const missingRequirements = getMissingProfileRequirements();
                    const isComplete = missingRequirements.length === 0;

                    return (
                      <>
                        {isComplete ? (
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{ mb: 1 }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: 'success.main',
                                mr: 1,
                              }}
                            />
                            <Typography variant="body2" color="success.main" fontWeight="medium">
                              Perfil Completo
                            </Typography>
                          </Box>
                        ) : (
                          <>
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              sx={{ mb: 1 }}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: 'warning.main',
                                  mr: 1,
                                }}
                              />
                              <Typography variant="body2" color="warning.main" fontWeight="medium">
                                Perfil Incompleto
                              </Typography>
                            </Box>

                            <Box sx={{ mt: 1 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mb: 1, display: 'block' }}
                              >
                                Te faltan los siguientes elementos:
                              </Typography>
                              {missingRequirements.map((requirement, index) => (
                                <Chip
                                  key={index}
                                  label={requirement}
                                  size="small"
                                  color="warning"
                                  variant="outlined"
                                  sx={{
                                    m: 0.25,
                                    fontSize: '0.7rem',
                                  }}
                                />
                              ))}
                            </Box>
                          </>
                        )}

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 2, display: 'block' }}
                        >
                          Completa tu perfil para habilitar la gestión de productos
                        </Typography>
                      </>
                    );
                  })()}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Business Information Form */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: isMobile ? 2 : 4 }}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Business Name */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Información Básica del Negocio
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nombre del Negocio"
                        value={formData.nombreNegocio}
                        onChange={handleInputChange('nombreNegocio')}
                        error={!!errors.nombreNegocio}
                        helperText={errors.nombreNegocio}
                        required
                        placeholder="Ej: Verdulería San Juan"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Descripción del Negocio"
                        multiline
                        rows={4}
                        value={formData.descripcion}
                        onChange={handleInputChange('descripcion')}
                        error={!!errors.descripcion}
                        helperText={
                          errors.descripcion ||
                          'Describe tu negocio, productos principales y lo que te diferencia'
                        }
                        placeholder="Verdulería con más de 20 años de experiencia."
                      />
                    </Grid>

                    {/* Contact Information */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Información de Contacto
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Teléfono de Contacto"
                        value={formData.telefonoContacto}
                        onChange={handleInputChange('telefonoContacto')}
                        error={!!errors.telefonoContacto}
                        helperText={errors.telefonoContacto}
                        placeholder="+56 9 1234 5678"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email de Contacto del Negocio"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        error={!!errors.email}
                        helperText={
                          errors.email || 'Email específico para consultas del negocio (opcional)'
                        }
                        placeholder="contacto@miverduleriasanjuan.cl"
                      />
                    </Grid>

                    {/* Delivery Settings */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Configuración de Entregas
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Radio de Entrega (km)"
                        type="number"
                        value={formData.radioEntregaKm}
                        onChange={handleInputChange('radioEntregaKm')}
                        error={!!errors.radioEntregaKm}
                        helperText={errors.radioEntregaKm || 'Distancia máxima para entregas'}
                        inputProps={{ min: 1, max: 100 }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={formData.cobraEnvio}
                            onChange={handleSwitchChange('cobraEnvio')}
                          />
                        }
                        label="Cobrar por envío"
                        sx={{ mt: 1 }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Envío gratis desde"
                        type="number"
                        value={formData.envioGratisDesde}
                        onChange={handleInputChange('envioGratisDesde')}
                        error={!!errors.envioGratisDesde}
                        helperText={errors.envioGratisDesde || 'Monto mínimo para envío gratuito'}
                        disabled={!formData.cobraEnvio}
                        InputProps={{
                          startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                        }}
                        inputProps={{ min: 0 }}
                      />
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        flexDirection={isMobile ? 'column' : 'row'}
                        gap={2}
                        sx={{ mt: 2 }}
                      >
                        <Button
                          onClick={handleBackToDashboard}
                          size="large"
                          sx={{ minWidth: isMobile ? '100%' : 120 }}
                        >
                          Cancelar
                        </Button>

                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<SaveIcon />}
                          disabled={updateBusinessMutation.isLoading}
                          size="large"
                          sx={{ minWidth: isMobile ? '100%' : 200 }}
                        >
                          {updateBusinessMutation.isLoading ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};
