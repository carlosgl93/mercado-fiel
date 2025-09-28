import { suppliersApi } from '@/api/suppliers';
import { usersApi } from '@/api/users';
import { DashboardHeader, MobileActionBar } from '@/components';
import { SupplierPreview } from '@/components/SupplierPreview';
import { useAuth } from '@/hooks/useAuthSupabase';
import { UpdateBusinessRequest } from '@/types/supplier';
import { uploadImageToSupabase } from '@/utils/supabaseStorage';
import {
  Business as BusinessIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  Alert,
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Snackbar,
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
    isEditingName: false,
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDesktopPreview, setShowDesktopPreview] = useState(false);

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

  const updateBusinessMutation = useMutation({
    mutationFn: (businessData: UpdateBusinessRequest) =>
      suppliersApi.updateBusiness(supplier?.idProveedor || 0, businessData),
    onMutate: async (businessData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['supplier', 'current']);

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['supplier', 'current']);

      // Optimistically update cache
      queryClient.setQueryData(['supplier', 'current'], (old: any) => {
        if (old?.data) {
          return {
            ...old,
            data: {
              ...old.data,
              ...businessData,
            },
          };
        }
        return old;
      });

      return { previousData };
    },
    onSuccess: (response) => {
      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries(['supplier', 'current']);
      queryClient.invalidateQueries(['supplier']);

      setSnackbar({
        open: true,
        message: response.message || 'Información actualizada exitosamente',
        severity: 'success',
      });
      navigate('/proveedor-dashboard');
    },
    onError: (error: any, businessData, context) => {
      // Rollback optimistic update
      if (context?.previousData) {
        queryClient.setQueryData(['supplier', 'current'], context.previousData);
      }

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
      usersApi.updateProfile(user?.data?.idUsuario || 0, { profilePictureUrl }),
    onMutate: async (profilePictureUrl) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['supplier', 'current']);

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['supplier', 'current']);

      // Optimistically update profile picture in UI
      setProfileData((prev) => ({
        ...prev,
        profilePictureUrl,
        previewUrl: profilePictureUrl,
      }));

      return { previousData };
    },
    onSuccess: (response) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['supplier', 'current']);
      queryClient.invalidateQueries(['user']);
      setSnackbar({
        open: true,
        message: 'Foto de perfil actualizada exitosamente',
        severity: 'success',
      });
    },
    onError: (error: any, profilePictureUrl, context) => {
      // Rollback optimistic update
      if (context?.previousData) {
        queryClient.setQueryData(['supplier', 'current'], context.previousData);
        setProfileData((prev) => ({
          ...prev,
          profilePictureUrl: user?.data?.profilePictureUrl || '',
          previewUrl: user?.data?.profilePictureUrl || '',
        }));
      }

      const message = error.response?.data?.message || 'Error al actualizar la foto de perfil';
      setSnackbar({
        open: true,
        message,
        severity: 'error',
      });
    },
  });

  // Mutation for updating user profile (name only)
  const updateUserProfileMutation = useMutation({
    mutationFn: async (userData: { nombre?: string }) => {
      // Handle name updates through the users API
      const dbResponse = await usersApi.updateProfile(user?.data?.idUsuario || 0, userData);

      return {
        ...dbResponse,
        authUpdateSuccessful: true, // No auth update needed for name changes
        dbUpdateSuccessful: true,
        emailChanged: false,
      };
    },
    onMutate: async (userData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['supplier', 'current']);

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['supplier', 'current']);

      // Optimistically update local state immediately
      setUserProfileData((prev) => ({
        ...prev,
        nombre: userData.nombre || prev.nombre,
      }));

      return { previousData, userData };
    },
    onSuccess: async (response, userData) => {
      // Only proceed if both auth and DB updates were successful
      if (response.authUpdateSuccessful && response.dbUpdateSuccessful) {
        // Update local state with server response
        setUserProfileData((prev) => ({
          ...prev,
          nombre: userData.nombre || prev.nombre,
          isEditingName: false,
        }));

        // Invalidate and refetch
        queryClient.invalidateQueries(['supplier', 'current']);
        queryClient.invalidateQueries(['user']);

        // Show success message
        setSnackbar({
          open: true,
          message: 'Perfil actualizado exitosamente',
          severity: 'success',
        });
      }
    },
    onError: (error: any, userData, context) => {
      // Rollback optimistic update
      if (context?.previousData) {
        queryClient.setQueryData(['supplier', 'current'], context.previousData);
        setUserProfileData((prev) => ({
          ...prev,
          nombre: user?.data?.nombre || '',
          isEditingName: false,
        }));
      }

      // Handle error
      const message =
        error.response?.data?.message || error.message || 'Error al actualizar el perfil';

      console.error('Profile update error:', error);

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
    if (user?.data?.profilePictureUrl) {
      setProfileData((prev) => ({
        ...prev,
        profilePictureUrl: user.data.profilePictureUrl || '',
        previewUrl: prev.previewUrl || user.data.profilePictureUrl || '',
      }));
    }

    // Initialize user profile data
    if (user?.data) {
      setUserProfileData((prev) => ({
        ...prev,
        nombre: prev.nombre || user.data.nombre || '',
      }));
    }
  }, [user]);

  // Sync local state when server data updates
  useEffect(() => {
    if (user?.data && !userProfileData.isEditingName) {
      setUserProfileData((prev) => ({
        ...prev,
        nombre: user.data.nombre || '',
      }));
    }
  }, [user?.data?.nombre, userProfileData.isEditingName]);

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
      profileData.profilePictureUrl !== user?.data?.profilePictureUrl
    ) {
      updateProfileMutation.mutate(profileData.profilePictureUrl);
    }
  };

  const handleUserFieldEdit = (isEditing: boolean) => {
    setUserProfileData((prev) => ({
      ...prev,
      isEditingName: isEditing,
    }));
  };

  const handleUserFieldChange = (value: string) => {
    setUserProfileData((prev) => ({
      ...prev,
      nombre: value,
    }));
  };

  const handleUserFieldSave = () => {
    const value = userProfileData.nombre;
    if (value.trim() && value !== user?.data?.nombre) {
      updateUserProfileMutation.mutate({ nombre: value.trim() });
    }
    handleUserFieldEdit(false);
  };

  const handleUserFieldCancel = () => {
    setUserProfileData((prev) => ({
      ...prev,
      nombre: user?.data?.nombre || '',
    }));
    handleUserFieldEdit(false);
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

    if (!user?.data?.profilePictureUrl?.trim()) {
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

  // Prepare data for preview
  const getPreviewData = () => ({
    nombreNegocio: formData.nombreNegocio || '',
    descripcion: formData.descripcion || '',
    telefonoContacto: formData.telefonoContacto,
    email: formData.email,
    radioEntregaKm: formData.radioEntregaKm,
    cobraEnvio: formData.cobraEnvio ?? true,
    envioGratisDesde: formData.envioGratisDesde,
    profilePictureUrl: profileData.previewUrl || user?.data?.profilePictureUrl || undefined,
    userName: userProfileData.nombre || user?.data?.nombre,
    userEmail: user?.data?.email,
  });

  // Show preview if requested
  if (showPreview) {
    return (
      <SupplierPreview
        supplierData={getPreviewData()}
        isPreview={true}
        onBack={() => setShowPreview(false)}
      />
    );
  }

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
        <DashboardHeader
          title="Mi Perfil de Proveedor"
          description="Actualiza la información de tu negocio para que los clientes te encuentren fácilmente"
          icon={<BusinessIcon sx={{ fontSize: 32 }} />}
          breadcrumbs={[
            {
              label: 'Dashboard',
              onClick: handleBackToDashboard,
            },
            {
              label: 'Mi Perfil de Proveedor',
            },
          ]}
          onBack={handleBackToDashboard}
          actions={
            <>
              <Button
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={() => setShowDesktopPreview(!showDesktopPreview)}
                sx={{
                  color: 'primary.contrastText',
                  borderColor: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.contrastText, 0.1),
                    borderColor: 'primary.contrastText',
                  },
                }}
              >
                {showDesktopPreview ? 'Ocultar Vista Previa' : 'Vista Previa'}
              </Button>
              <Button
                variant="contained"
                startIcon={<VisibilityIcon />}
                onClick={() => setShowPreview(true)}
                sx={{
                  bgcolor: 'primary.contrastText',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.contrastText, 0.9),
                  },
                }}
              >
                Vista Completa
              </Button>
            </>
          }
        />

        {/* Mobile Preview Button */}
        {isMobile && (
          <MobileActionBar>
            <Button
              variant="contained"
              startIcon={<VisibilityIcon />}
              onClick={() => setShowPreview(true)}
              size="large"
              sx={{
                width: '100%',
                bgcolor: '#4CAF4F',
                boxShadow: '0 0 20px rgba(76, 175, 79, 0.4)',
                animation: 'glow 2s ease-in-out infinite alternate',
                '@keyframes glow': {
                  from: {
                    boxShadow: '0 0 20px rgba(76, 175, 79, 0.4)',
                  },
                  to: {
                    boxShadow: '0 0 30px rgba(76, 175, 79, 0.7)',
                  },
                },
                '&:hover': {
                  bgcolor: '#45a049',
                },
                transform: 'scale(1.02)',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Vista Previa
            </Button>
          </MobileActionBar>
        )}

        <Grid container spacing={3}>
          {/* Preview Section (Desktop) or Profile Picture Section */}
          <Grid item xs={12} md={showDesktopPreview ? 6 : 4}>
            {showDesktopPreview ? (
              <Card sx={{ height: 'fit-content' }}>
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      maxHeight: '80vh',
                      overflow: 'auto',
                      '&::-webkit-scrollbar': {
                        width: 8,
                      },
                      '&::-webkit-scrollbar-track': {
                        bgcolor: '#f1f1f1',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        bgcolor: '#888',
                        borderRadius: 4,
                      },
                    }}
                  >
                    <SupplierPreview supplierData={getPreviewData()} isPreview={true} />
                  </Box>
                </CardContent>
              </Card>
            ) : (
              /* Profile Picture Section */
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
                    Logo de tu marca
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Avatar
                      src={profileData.previewUrl || user?.data?.profilePictureUrl || ''}
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

                  {profileData.profilePictureUrl !== user?.data?.profilePictureUrl && (
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
                      Información personal
                    </Typography>

                    {/* Name Field */}
                    <Box sx={{ mb: 2 }}>
                      {userProfileData.isEditingName ? (
                        <Box display="flex" alignItems="center" gap={1}>
                          <TextField
                            size="small"
                            value={userProfileData.nombre}
                            onChange={(e) => handleUserFieldChange(e.target.value)}
                            placeholder="Nombre"
                            autoFocus
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleUserFieldSave()}
                            color="primary"
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleUserFieldCancel()}>
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
                              {userProfileData.nombre || user?.data?.nombre || 'Sin nombre'}
                            </Typography>
                          </Box>
                          <IconButton size="small" onClick={() => handleUserFieldEdit(true)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>

                    {/* Email Field - Display Only */}
                    <Box sx={{ mb: 2 }}>
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
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Profile Completion Status */}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Estado del perfil
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
                                <Typography
                                  variant="body2"
                                  color="warning.main"
                                  fontWeight="medium"
                                >
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
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ mt: 2, display: 'block' }}
                                >
                                  Completa tu perfil para habilitar la gestión de productos
                                </Typography>
                              </Box>
                            </>
                          )}
                        </>
                      );
                    })()}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Business Information Form */}
          <Grid item xs={12} md={showDesktopPreview ? 6 : 8}>
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
                    {/* escondiendo info relacionada a envios dado que los gestionara el benja por logistica interna */}
                    {/* <Grid item xs={12}>
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
                    </Grid> */}

                    {/* escondiendo info relacionada a envios dado que los gestionara el benja por logistica interna */}
                    {/* <Grid item xs={12} sm={6}>
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
                    </Grid> */}

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
