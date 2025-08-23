import Meta from '@/components/Meta';
import { Text, TextContainer, Title } from '@/components/StyledComponents';
import { FlexBox, FullSizeCenteredFlexBox } from '@/components/styled';
import { Box, Button, Checkbox, TextField, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import RegistrarProveedorController from './RegistrarProveedorController';
import { formInputs } from './formInputs';

function RegistrarProveedor() {
  const { state, handleChange, handleSubmit, handleAcceptTerms, signUpLoading } =
    RegistrarProveedorController();
  const theme = useTheme();
  return (
    <>
      <Meta title="Registrar proveedor: Mercado Fiel" />
      <FullSizeCenteredFlexBox
        sx={{
          flexDirection: 'column',
          textAlign: 'center',
          mb: '2rem',
          p: {
            xs: '2rem',
            sm: '2rem',
          },
        }}
      >
        <TextContainer>
          <Title
            sx={{
              fontSize: '1.4rem',
              my: '2.5vh',
            }}
          >
            ¡Estas a un solo paso! Registrate para poder ofrecer tus productos.
          </Title>
        </TextContainer>
        <Box
          component={'form'}
          sx={{ gap: theme.spacing(2), display: 'flex', flexDirection: 'column' }}
          onSubmit={handleSubmit}
        >
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
          {formInputs.map((input, i) => {
            return (
              <TextField
                sx={{
                  m: {
                    xs: 1,
                    sm: 2,
                    md: 3,
                  },
                }}
                key={i}
                label={input.label}
                name={input.inputName}
                variant="outlined"
                placeholder={input.placeholder}
                onChange={handleChange}
                type={input.type}
                helperText={input?.helperText ?? ''}
                value={state[input?.inputName]}
              />
            );
            // }
          })}
          {/* TODO: ADD CAPTCHA */}

          <FlexBox
            sx={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              mt: '2rem',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: '75%',
              }}
            >
              <Text>
                Al crearte una cuenta, aceptas los términos y condiciones de Mercado Fiel.
              </Text>
              <FlexBox
                sx={{
                  alignItems: 'center',
                }}
              >
                <Link to="/terms-conditions">Términos y condiciones</Link>
                <Checkbox
                  checked={!!state.acceptedTerms}
                  onChange={handleAcceptTerms}
                  name="acceptedTerms"
                />
              </FlexBox>
            </Box>
          </FlexBox>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Button
              disabled={
                state.nombre === '' ||
                state.apellido === '' ||
                state.telefono === '' ||
                state.rut === '' ||
                !state.acceptedTerms ||
                state.correo === '' ||
                state.contrasena === '' ||
                state.confirmarContrasena === '' ||
                state.error !== '' ||
                signUpLoading
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
              variant="contained"
              onClick={handleSubmit}
              sx={{
                marginTop: '5vh',
              }}
            >
              Registrar
            </Button>
          </Box>
        </Box>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default RegistrarProveedor;
