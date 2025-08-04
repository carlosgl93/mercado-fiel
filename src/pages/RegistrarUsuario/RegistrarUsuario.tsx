import Loading from '@/components/Loading';
import Meta from '@/components/Meta';
import { Text, TextContainer, Title } from '@/components/StyledComponents';
import { FlexBox, FullSizeCenteredFlexBox } from '@/components/styled';
import { Box, Button, Checkbox, Typography, useTheme } from '@mui/material';
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
// if (forWhom === 'tercero') {
//               return (
//                 <>
//                   <Button>Crear paciente</Button>
//                   {creatingNewPatient && (
//                     <>
//                       <StyledInput
//                         input={{
//                           label: 'Nombre del paciente',
//                           inputName: 'name',
//                           placeholder: 'Nombre del paciente',
//                           type: 'text',
//                         }}
//                         value={newPatient.name}
//                         handleChange={handleChangePatient}
//                       />
//                       <StyledInput
//                         input={{
//                           label: 'Edad del paciente',
//                           inputName: 'age',
//                           placeholder: 'Edad del paciente',
//                           type: 'number',
//                         }}
//                         value={newPatient.age.toString()}
//                         handleChange={handleChangePatient}
//                       />
//                       <StyledInput
//                         input={{
//                           label: 'Rut del paciente',
//                           inputName: 'rut',
//                           placeholder: 'Rut del paciente',
//                           type: 'number',
//                         }}
//                         value={newPatient.rut.toString()}
//                         handleChange={handleChangePatient}
//                       />
//                       <Box>
//                         <em>Despues podrás agregar más pacientes.</em>
//                       </Box>
//                     </>
//                   )}
//                 </>
//               );
//             } else {
