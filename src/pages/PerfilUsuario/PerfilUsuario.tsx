import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Avatar,
  Badge,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { usePerfilUsuarioController } from './PerfilUsuarioController';
import UserComunaSearchBar from './UserComunaSearchBar';
import { SaveButton } from '@/components/SaveButton';
import BackButton from '@/components/BackButton';
import Loading from '@/components/Loading';
import { Controller } from 'react-hook-form';
import { styled } from '@mui/system';
import { Text } from '@/components/StyledComponents';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(4),
  maxWidth: '80%',
  margin: '0 auto',
}));

const StyledTitle = styled('h1')(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  color: theme.palette.primary.main,
  textAlign: 'start',
}));

const StyledSelect = styled(Select)(() => ({
  minWidth: '220px',
}));

const FormHelperText = styled('p')(({ theme }) => ({
  color: theme.palette.error.main,
}));

const StyledTextField = styled(TextField)(() => ({}));

export const PerfilUsuario = () => {
  const {
    updateUserLoading,
    loadingPreview,
    imagePreview,
    fileInputRef,
    onSubmit,
    isValid,
    control,
    errors,
    user,
    register,
    setValue,
    handleSubmit,
    handleImageChange,
    handleEditPicture,
  } = usePerfilUsuarioController();

  return (
    <Box>
      <BackButton
        ignoreMargin
        displayText
        style={{
          margin: '1rem',
          marginBottom: '0rem',
        }}
      />
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {updateUserLoading ? (
          <Loading />
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              width: {
                xs: '100%',
                sm: '100%',
                md: '33%',
                lg: '50%',
              },
              margin: '0 auto',
              backgroundColor: 'white',
              borderRadius: '1rem',
              p: '1rem 0.5rem',
            }}
          >
            <StyledTitle>Actualizar Perfil</StyledTitle>
            <Box
              sx={{
                display: 'flex',
                width: '100px',
                justifyContent: 'center',
                margin: '2rem auto',
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton onClick={handleEditPicture}>
                    <EditOutlinedIcon color="primary" />
                  </IconButton>
                }
              >
                {loadingPreview ? (
                  <CircularProgress />
                ) : (
                  <Avatar
                    sx={{
                      width: '128px',
                      height: '128px',
                    }}
                    alt="User profile picture"
                    src={imagePreview ? (imagePreview as string) : user?.profileImageUrl}
                  />
                )}
              </Badge>
            </Box>
            <StyledTextField
              {...register('email', { required: 'Email es requerido' })}
              label="Email"
              variant="outlined"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <StyledTextField
              {...register('firstname', { required: 'Nombre es requerido' })}
              label="Nombre"
              variant="outlined"
              error={Boolean(errors.firstname)}
              helperText={errors.firstname?.message}
            />
            <StyledTextField
              {...register('lastname', { required: 'Apellido es requerido' })}
              label="Apellido"
              variant="outlined"
              error={Boolean(errors.lastname)}
              helperText={errors.lastname?.message}
            />
            <StyledTextField
              {...register('age', { required: 'Edad es requerida' })}
              label="Edad"
              variant="outlined"
              error={Boolean(errors.age)}
              helperText={errors.age?.message}
            />
            {user?.forWhom === 'tercero' && (
              <>
                <StyledTextField
                  {...register('patientName', { required: 'Nombre del paciente es requerido' })}
                  label="Nombre del paciente"
                  variant="outlined"
                  error={Boolean(errors.patientName)}
                  helperText={errors.patientName?.message}
                />

                <StyledTextField
                  {...register('patientAge', { required: 'Edad del paciente' })}
                  label="Edad del paciente"
                  variant="outlined"
                  error={Boolean(errors.patientAge)}
                  helperText={errors.patientAge?.message}
                />
              </>
            )}

            <Controller
              name="gender"
              control={control}
              rules={{ required: 'Género es requerido' }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormControl variant="outlined" error={Boolean(error)}>
                  <InputLabel id="gender-label">Género</InputLabel>
                  <StyledSelect
                    labelId="gender-label"
                    label="Género"
                    value={value}
                    onChange={onChange}
                    defaultValue={user?.gender}
                  >
                    <MenuItem value="">Selecciona tu genero</MenuItem>
                    <MenuItem value="Masculino">Masculino</MenuItem>
                    <MenuItem value="Femenino">Femenino</MenuItem>
                    <MenuItem value="Otro">Otro</MenuItem>
                  </StyledSelect>
                  {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
            <StyledTextField
              {...register('dob', { required: 'Fecha de Nacimiento es requerida' })}
              label="Fecha de Nacimiento"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              error={Boolean(errors.dob)}
              helperText={errors.dob?.message}
              sx={{
                minWidth: '220px',
              }}
              // fullWidth
            />
            <StyledTextField
              {...register('phone', { required: 'Teléfono es requerido' })}
              label="Teléfono"
              variant="outlined"
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
            />
            <UserComunaSearchBar register={setValue} />
            <StyledTextField
              {...register('address', { required: 'Dirección es requerida' })}
              label="Dirección"
              variant="outlined"
              error={Boolean(errors.address)}
              helperText={errors.address?.message}
            />

            <input
              {...register('profileImage')}
              type="file"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageChange}
              multiple={false}
            />

            {!isValid && (
              <Box
                sx={{
                  p: '1rem',
                }}
              >
                <Text>Asegurate de rellenar todos los campos con información valida.</Text>
              </Box>
            )}
            <SaveButton
              style={{
                marginBottom: '2rem',
              }}
            />
          </Box>
        )}
      </StyledForm>
    </Box>
  );
};
