import { usersApi } from '@/api/users';
import { DashboardHeader, MobileActionBar } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { uploadImageToSupabase } from '@/utils/supabaseStorage';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon
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
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Snackbar,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

export const PerfilUsuario = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { cliente, user: authUser } = useAuth();
  const queryClient = useQueryClient();

  const [userProfileData, setUserProfileData] = useState({
    nombre: '',
    email: '',
    activo: true,
    profilePictureUrl: '',
    isEditingName: false,
    isEditingEmail: false,
    isEditingStatus: false,
  });

  const [profileData, setProfileData] = useState({
    profilePictureUrl: '',
    previewUrl: '',
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Query for current user data
  const {
    data: userResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => usersApi.getUser(cliente?.idUsuario || 0),
    enabled: !!cliente?.idUsuario,
  });

  // Mutation for updating user profile
  const updateUserProfileMutation = useMutation({
    mutationFn: async (userData: { 
      nombre?: string; 
      email?: string; 
      profilePictureUrl?: string; 
      activo?: boolean;
    }) => {
      return await usersApi.updateProfile(cliente?.idUsuario || 0, userData);
    },
    onMutate: async (userData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['user', 'current']);

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['user', 'current']);

      // Optimistically update cache
      queryClient.setQueryData(['user', 'current'], (old: any) => {
        if (old?.data) {
          return {
            ...old,
            data: {
              ...old.data,
              ...userData,
            },
          };
        }
        return old;
      });

      return { previousData };
    },
    onSuccess: (response) => {
      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries(['user', 'current']);
      queryClient.invalidateQueries(['user']);

      setSnackbar({
        open: true,
        message: response.message || 'Perfil actualizado exitosamente',
        severity: 'success',
      });

      // Reset editing states
      setUserProfileData((prev) => ({
        ...prev,
        isEditingName: false,
        isEditingEmail: false,
        isEditingStatus: false,
      }));
    },
    onError: (error: any, userData, context) => {
      // Rollback optimistic update
      if (context?.previousData) {
        queryClient.setQueryData(['user', 'current'], context.previousData);
      }

      const message = error.response?.data?.message || 'Error al actualizar el perfil';
      setSnackbar({
        open: true,
        message,
        severity: 'error',
      });
    },
  });

  // Load user data when query succeeds
  useEffect(() => {
    if (userResponse?.data) {
      const userData = userResponse.data;
      setUserProfileData({
        nombre: userData.nombre || '',
        email: userData.email || '',
        activo: userData.activo !== false, // Default to true if not specified
        profilePictureUrl: userData.profilePictureUrl || '',
        isEditingName: false,
        isEditingEmail: false,
        isEditingStatus: false,
      });
      setProfileData({
        profilePictureUrl: userData.profilePictureUrl || '',
        previewUrl: userData.profilePictureUrl || '',
      });
    }
  }, [userResponse]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userProfileData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!userProfileData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfileData.email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setUserProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSaveField = async (field: string) => {
    if (!validateForm()) return;

    const updateData: Record<string, any> = {};
    updateData[field] = userProfileData[field as keyof typeof userProfileData];
    
    await updateUserProfileMutation.mutateAsync(updateData);
  };

  const handleToggleEdit = (field: string) => {
    const editingField = `isEditing${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof typeof userProfileData;
    setUserProfileData((prev) => ({
      ...prev,
      [editingField]: !prev[editingField],
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setSnackbar({
        open: true,
        message: 'Por favor selecciona un archivo de imagen válido',
        severity: 'error',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: 'El archivo debe ser menor a 5MB',
        severity: 'error',
      });
      return;
    }

    setIsUploadingImage(true);
    
    try {
      const uploadResult = await uploadImageToSupabase(file, 'profile-images', 'users');
      
      if (uploadResult.success && uploadResult.url) {
        // Update profile picture
        await updateUserProfileMutation.mutateAsync({
          profilePictureUrl: uploadResult.url,
        });

        setProfileData({
          profilePictureUrl: uploadResult.url,
          previewUrl: uploadResult.url,
        });
      } else {
        throw new Error(uploadResult.error || 'Error al subir la imagen');
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Error al subir la imagen',
        severity: 'error',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Error al cargar los datos del perfil. Por favor, intenta nuevamente.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <DashboardHeader
        title="Mi Perfil"
        description="Gestiona tu información personal"
        icon={<PersonIcon />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/usuario-dashboard' },
          { label: 'Mi Perfil' },
        ]}
        onBack={() => navigate('/usuario-dashboard')}
        actions={
          <Button
            variant="contained"
            startIcon={<PersonIcon />}
            onClick={() => navigate('/usuario-dashboard')}
            sx={{ color: 'primary.contrastText' }}
          >
            Volver al Dashboard
          </Button>
        }
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Profile Picture Section */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box position="relative" display="inline-block">
                  <Avatar
                    src={profileData.previewUrl || profileData.profilePictureUrl}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mb: 2,
                      mx: 'auto',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 60 }} />
                  </Avatar>
                  
                  <IconButton
                    component="label"
                    disabled={isUploadingImage}
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 0,
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                      width: 36,
                      height: 36,
                    }}
                  >
                    {isUploadingImage ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <PhotoCameraIcon fontSize="small" />
                    )}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </IconButton>
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  {userProfileData.nombre || 'Usuario'}
                </Typography>
                
                <Chip
                  label={userProfileData.activo ? 'Activo' : 'Inactivo'}
                  color={userProfileData.activo ? 'success' : 'default'}
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Information Section */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Información Personal
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Name Field */}
                <Box sx={{ mb: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Nombre
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleEdit('name')}
                      disabled={updateUserProfileMutation.isLoading}
                    >
                      {userProfileData.isEditingName ? <CloseIcon /> : <EditIcon />}
                    </IconButton>
                  </Box>
                  
                  {userProfileData.isEditingName ? (
                    <Box display="flex" gap={1}>
                      <TextField
                        fullWidth
                        value={userProfileData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                        size="small"
                      />
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={() => handleSaveField('nombre')}
                        disabled={updateUserProfileMutation.isLoading}
                      >
                        Guardar
                      </Button>
                    </Box>
                  ) : (
                    <Typography>{userProfileData.nombre || 'No especificado'}</Typography>
                  )}
                </Box>

                {/* Email Field */}
                <Box sx={{ mb: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleEdit('email')}
                      disabled={updateUserProfileMutation.isLoading}
                    >
                      {userProfileData.isEditingEmail ? <CloseIcon /> : <EditIcon />}
                    </IconButton>
                  </Box>
                  
                  {userProfileData.isEditingEmail ? (
                    <Box display="flex" gap={1}>
                      <TextField
                        fullWidth
                        type="email"
                        value={userProfileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        size="small"
                      />
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={() => handleSaveField('email')}
                        disabled={updateUserProfileMutation.isLoading}
                      >
                        Guardar
                      </Button>
                    </Box>
                  ) : (
                    <Typography>{userProfileData.email || 'No especificado'}</Typography>
                  )}
                </Box>

                {/* Active Status Field */}
                <Box sx={{ mb: 3 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Estado de la cuenta
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleEdit('status')}
                      disabled={updateUserProfileMutation.isLoading}
                    >
                      {userProfileData.isEditingStatus ? <CloseIcon /> : <EditIcon />}
                    </IconButton>
                  </Box>
                  
                  {userProfileData.isEditingStatus ? (
                    <Box display="flex" alignItems="center" gap={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={userProfileData.activo}
                            onChange={(e) => handleInputChange('activo', e.target.checked)}
                          />
                        }
                        label={userProfileData.activo ? 'Cuenta activa' : 'Cuenta inactiva'}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={() => handleSaveField('activo')}
                        disabled={updateUserProfileMutation.isLoading}
                      >
                        Guardar
                      </Button>
                    </Box>
                  ) : (
                    <Typography>
                      {userProfileData.activo ? 'Cuenta activa' : 'Cuenta inactiva'}
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Action Buttons */}
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/usuario-dashboard')}
                  >
                    Volver al Dashboard
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Action Bar */}
      {isMobile && (
        <MobileActionBar>
          <Button
            variant="contained"
            startIcon={<PersonIcon />}
            onClick={() => navigate('/usuario-dashboard')}
            fullWidth
          >
            Volver al Dashboard
          </Button>
        </MobileActionBar>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};