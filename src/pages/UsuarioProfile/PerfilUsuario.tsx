import { DashboardHeader, MobileActionBar } from '@/components';
import { Person as PersonIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Snackbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ProfileInfoCard, ProfilePictureCard } from './components';
import { usePerfilUsuario } from './hooks/usePerfilUsuario';
import { profileStyles } from './styles';

export const PerfilUsuario = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const {
    userProfileData,
    userResponse,
    isLoading,
    error,
    isUploadingImage,
    errors,
    snackbar,
    updateUserProfileMutation,
    handleInputChange,
    handleSaveField,
    handleToggleEdit,
    handleImageUpload,
    handleCloseSnackbar,
  } = usePerfilUsuario();

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={profileStyles.container}>
        <Box sx={profileStyles.loadingContainer}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={profileStyles.container}>
        <Alert severity="error">
          Error al cargar los datos del perfil. Por favor, intenta nuevamente.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <DashboardHeader
        title="Mi perfil"
        description="Gestiona tu información personal"
        icon={<PersonIcon />}
        breadcrumbs={[{ label: 'Dashboard', href: '/usuario-dashboard' }, { label: 'Mi perfil' }]}
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

      <Container maxWidth="lg" sx={profileStyles.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ProfilePictureCard
              profilePictureUrl={userResponse?.data?.profilePictureUrl}
              nombre={userProfileData.nombre}
              activo={userProfileData.activo}
              isUploadingImage={isUploadingImage}
              onImageUpload={handleImageUpload}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <ProfileInfoCard
              nombre={userProfileData.nombre}
              email={userProfileData.email}
              activo={userProfileData.activo}
              isEditingName={userProfileData.isEditingName}
              isEditingEmail={userProfileData.isEditingEmail}
              isEditingStatus={userProfileData.isEditingStatus}
              errors={errors}
              isLoading={updateUserProfileMutation.isLoading}
              onToggleEdit={handleToggleEdit}
              onInputChange={handleInputChange}
              onSaveField={handleSaveField}
            />
          </Grid>
        </Grid>
      </Container>

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
