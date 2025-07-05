import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { styled } from '@mui/system';
import { SaveButton } from '@/components/SaveButton';
import { useDetallesBasicos } from './useDetallesBasicos';
import Loading from '@/components/Loading';
import BackButton from '@/components/BackButton';
import {
  BackButtonContainer,
  Container,
  Wrapper,
} from '@/pages/PrestadorDashboard/StyledPrestadorDashboardComponents';

export interface IDetallesBasicosInputs {
  email: string;
  firstname: string;
  lastname: string;
  gender: string;
  dob: string;
  telefono: string;
  address: string;
}

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

export const DetallesBasicos = () => {
  const { prestador, updatePrestadorLoading, onSubmit } = useDetallesBasicos();

  const { register, handleSubmit, formState } = useForm<IDetallesBasicosInputs>({
    defaultValues: {
      email: prestador?.email || '',
      firstname: prestador?.firstname || '',
      lastname: prestador?.lastname || '',
      gender: prestador?.gender || '',
      dob: prestador?.dob || '',
      telefono: prestador?.telefono || '',
      address: prestador?.address || '',
    },
  });

  const { errors, isDirty } = formState;

  return (
    <Wrapper>
      <BackButtonContainer>
        <BackButton
          to="/construir-perfil"
          ignoreMargin
          displayText
          style={{
            margin: '1rem',
            marginBottom: '0rem',
          }}
        />
      </BackButtonContainer>

      <StyledTitle>Detalles básicos</StyledTitle>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {updatePrestadorLoading ? (
          <Loading />
        ) : (
          <Container
            sx={{
              gap: '1rem',
              alignItems: 'center',
            }}
          >
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
            <FormControl variant="outlined">
              <InputLabel id="gender-label">Género</InputLabel>
              <StyledSelect
                labelId="gender-label"
                label="Género"
                {...register('gender', { required: 'Género es requerido' })}
                error={Boolean(errors.gender)}
                defaultValue={''}
                value={prestador?.gender}
              >
                <MenuItem value="">Selecciona tu genero</MenuItem>
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </StyledSelect>
              {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
            </FormControl>
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
            />
            <StyledTextField
              {...register('telefono', { required: 'Teléfono es requerido' })}
              label="Teléfono"
              variant="outlined"
              error={Boolean(errors.telefono)}
              helperText={errors.telefono?.message}
              type="tel"
            />
            <StyledTextField
              {...register('address')}
              label="Dirección"
              variant="outlined"
              error={Boolean(errors.address)}
              helperText={errors.address?.message}
            />
            <SaveButton
              disabled={!isDirty}
              style={{
                marginBottom: '2rem',
              }}
            />
          </Container>
        )}
      </StyledForm>
    </Wrapper>
  );
};
