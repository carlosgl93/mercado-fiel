import Loading from '@/components/Loading';
import Meta from '@/components/Meta';
import { Text, TextContainer, Title } from '@/components/StyledComponents';
import { FlexBox, FullSizeCenteredFlexBox } from '@/components/styled';
import { Box, Button, Checkbox, TextField, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks';
import RegistrarUsuarioController from './RegistrarUsuarioController';

function RegistrarUsuario() {
  const { state, handleChange, handleSubmit, handleAcceptTerms } = RegistrarUsuarioController();
  const theme = useTheme();

  const { signUpLoading, signUpError } = useAuth();

  if (signUpLoading) return <Loading />;

  const shouldDisable =
    state.nombre === '' ||
    state.apellido === '' ||
    state.correo === '' ||
    state.contrasena === '' ||
    state.confirmarContrasena === '' ||
    state.error !== '' ||
    state.rut === '' ||
    state.telefono === '' ||
    !state.acceptedTerms ||
    signUpLoading;

  return (
    <>
      <Meta title="Registrar usuario Mercado Fiel" />
      <FullSizeCenteredFlexBox
        sx={{
          flexDirection: 'column',
          textAlign: 'center',
          mb: '2rem',
          px: {
            xs: '1rem',
            md: 'auto',
          },
        }}
      >
        <TextContainer>
          <Title
            sx={{
              fontSize: '1.4rem',
              my: '1rem',
            }}
          >
            ¡Estas a un solo paso! Registrate para poder contactar a la persona que buscas.
          </Title>
        </TextContainer>
        <Box
          component={'form'}
          sx={{ gap: theme.spacing(1), display: 'flex', flexDirection: 'column' }}
          onSubmit={handleSubmit}
        >
          <Box
            sx={{
              display: 'row',
            }}
          >
            <Text sx={{ fontSize: '0.8rem', width: '100%', textAlign: 'center' }}>
              Ya tienes una cuenta? {'  '}
              <Link to="/ingresar">Ingresa aqui</Link>
            </Text>
          </Box>
          {state.error && (
            <TextContainer>
              <Typography
                variant="body1"
                sx={{
                  color: 'red',
                }}
              >
                {state.error}
              </Typography>
            </TextContainer>
          )}

          {/* Form Fields */}
          <TextField
            label="Nombre"
            name="nombre"
            variant="outlined"
            fullWidth
            required
            value={state.nombre}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            label="Apellido"
            name="apellido"
            variant="outlined"
            fullWidth
            required
            value={state.apellido}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            label="RUT (ej: 12345678-9)"
            name="rut"
            variant="outlined"
            fullWidth
            required
            value={state.rut}
            onChange={handleChange}
            margin="normal"
            placeholder="12345678-9"
          />

          <TextField
            label="Teléfono"
            name="telefono"
            variant="outlined"
            fullWidth
            required
            value={state.telefono}
            onChange={handleChange}
            margin="normal"
            placeholder="+56 9 1234 5678"
          />

          <TextField
            label="Correo electrónico"
            name="correo"
            variant="outlined"
            fullWidth
            required
            type="email"
            value={state.correo}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            label="Contraseña"
            name="contrasena"
            variant="outlined"
            fullWidth
            required
            type="password"
            value={state.contrasena}
            onChange={handleChange}
            margin="normal"
            helperText="Mínimo 6 caracteres"
          />

          <TextField
            label="Confirmar contraseña"
            name="confirmarContrasena"
            variant="outlined"
            fullWidth
            required
            type="password"
            value={state.confirmarContrasena}
            onChange={handleChange}
            margin="normal"
          />

          {/* TODO: ADD CAPTCHA */}
          <FlexBox
            sx={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              mt: '1rem',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                maxWidth: '50%',
              }}
            >
              <span>
                Al crearte una cuenta, aceptas los{' '}
                <Link to="/terms-conditions">términos y condiciones</Link> de Mercado Fiel.{' '}
              </span>
            </Box>
            <Box>
              <Checkbox
                checked={!!state.acceptedTerms}
                onChange={handleAcceptTerms}
                name="acceptedTerms"
              />
            </Box>
          </FlexBox>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {signUpError && (
              <Box>
                <Text
                  sx={{
                    color: 'red',
                  }}
                >
                  Hubo un error al crear tu cuenta. {signUpError?.message}
                </Text>
              </Box>
            )}
            <Button
              disabled={shouldDisable}
              variant="contained"
              onClick={handleSubmit}
              sx={{
                marginTop: '2.5vh',
              }}
            >
              Crear cuenta
            </Button>
          </Box>
        </Box>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default RegistrarUsuario;
