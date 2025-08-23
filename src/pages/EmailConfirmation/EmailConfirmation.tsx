import { FullSizeCenteredFlexBox } from '@/components/styled';
import { CheckCircle, Email } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const EmailConfirmation = () => {
  const navigate = useNavigate();

  return (
    <FullSizeCenteredFlexBox>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 3,
          p: 4,
          maxWidth: 500,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <CheckCircle sx={{ fontSize: 64, color: 'success.main' }} />

        <Typography variant="h4" component="h1">
          ¡Cuenta creada exitosamente!
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Email sx={{ color: 'primary.main' }} />
          <Typography variant="h6">Confirma tu email</Typography>
        </Box>

        <Typography variant="body1" color="text.secondary">
          Te hemos enviado un correo electrónico con un enlace de confirmación. Por favor revisa tu
          bandeja de entrada y haz clic en el enlace para activar tu cuenta.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Si no ves el correo, revisa tu carpeta de spam o correo no deseado.
        </Typography>

        <Button variant="contained" onClick={() => navigate('/ingresar')} sx={{ mt: 2 }}>
          Ir a iniciar sesión
        </Button>

        <Button variant="text" onClick={() => navigate('/')} color="secondary">
          Volver al inicio
        </Button>
      </Box>
    </FullSizeCenteredFlexBox>
  );
};

export default EmailConfirmation;
