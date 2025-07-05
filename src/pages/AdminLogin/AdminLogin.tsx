import { SubTitle } from '../PrestadorDashboard/StyledPrestadorDashboardComponents';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import { Box, Button, TextField } from '@mui/material';
import { Title } from '@/components/StyledComponents';
import { useAuthNew } from '@/hooks/useAuthNew';
import Loading from '@/components/Loading';
import Meta from '@/components/Meta';
import { useState } from 'react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { adminLogin, adminLoginLoading } = useAuthNew();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    adminLogin({ correo: email, contrasena: password });
  };

  if (adminLoginLoading) return <Loading />;

  return (
    <>
      <Meta title="Admin: Inicia Sesión" />
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
          <Title variant="h3">Iniciar sesión</Title>
          <SubTitle
            sx={{
              mb: 10,
            }}
          >
            Administrador
          </SubTitle>
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
        </Box>
      </FullSizeCenteredFlexBox>
    </>
  );
};
