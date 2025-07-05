import { useEffect } from 'react';
import { CenteredFlexBox } from '@/components/styled';
import { useSetRecoilState } from 'recoil';
import { notificationState } from '@/store/snackbar';
import { Text, Title } from '@/components/StyledComponents';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const EmailVerificado = () => {
  const setNotification = useSetRecoilState(notificationState);

  useEffect(() => {
    setNotification({
      open: true,
      message: 'Email verificado correctamente',
      severity: 'success',
    });
  }, []);

  return (
    <Box
      sx={{
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: '1rem',
        gap: '3rem',
      }}
    >
      <Title
        sx={{
          fontSize: '2rem',
        }}
      >
        Email Verificado
      </Title>
      <CenteredFlexBox>
        <Text>Correo electrónico verificado correctamente.</Text>
      </CenteredFlexBox>

      <Button variant="contained">
        <Link
          to="/ingresar"
          style={{
            textDecoration: 'none',
            color: 'white',
          }}
        >
          Iniciar sesión
        </Link>
      </Button>
    </Box>
  );
};

export default EmailVerificado;
