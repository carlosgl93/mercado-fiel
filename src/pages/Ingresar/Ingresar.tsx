import { useEffect, useState } from 'react';
import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Title } from '@/components/StyledComponents';
import Loading from '@/components/Loading';
import { useAuthNew } from '@/hooks/useAuthNew';

function Ingresar() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loginLoading, user, prestador } = useAuthNew();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login({ correo: email, contrasena: password });
  };

  useEffect(() => {
    if (user?.email) {
      navigate('/usuario-dashboard');
      return;
    }
    if (prestador?.email) {
      navigate('/prestador-dashboard');
      return;
    }
  }, []);

  if (loginLoading) return <Loading />;

  return (
    <>
      <Meta title="Inicia Sesión" />
      <FullSizeCenteredFlexBox>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            width: '100%',
            maxWidth: 400,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          <Title
            variant="h3"
            sx={{
              mb: 10,
            }}
          >
            Iniciar sesión
          </Title>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Ingresar
          </Button>

          <Typography variant="body2" mt={2}>
            Aun no tienes una cuenta? <Link to="/comienzo">Creala aqui</Link>
          </Typography>
        </Box>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default Ingresar;
