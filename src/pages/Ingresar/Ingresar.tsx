import Loading from '@/components/Loading';
import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import { Title } from '@/components/StyledComponents';
import { useAuth } from '@/hooks/useAuthSupabase';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Ingresar() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signIn, isSigningIn, customer, supplier } = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn({ email, password });
  };

  useEffect(() => {
    console.log({
      customer,
      supplier,
    });

    // Only navigate if user is authenticated and we have clear role data
    if (customer && customer.idCliente) {
      navigate('/usuario-dashboard');
      return;
    }
    if (supplier && supplier.idProveedor) {
      navigate('/proveedor-dashboard');
      return;
    }
  }, [customer, supplier, navigate]);

  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      console.log('Running in development mode');
      setEmail('cgumucio93@gmail.com');
      setPassword('123456');
    }
  }, []);

  if (isSigningIn) return <Loading />;

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
