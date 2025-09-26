import { FullSizeCenteredFlexBox } from '@/components/styled';
import { useAuth } from '@/hooks/useAuthSupabase';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const CambiarContrasena = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = useCallback(async () => {
    if (!newPassword || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
      
      // Redirect after successful password change
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error: any) {
      console.error('Password change error:', error);
      
      let errorMessage = 'Error al cambiar la contraseña';
      if (error.message.includes('Same password')) {
        errorMessage = 'La nueva contraseña debe ser diferente a la actual';
      } else if (error.message.includes('Password should be')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      } else if (error.message.includes('weak')) {
        errorMessage = 'La contraseña es muy débil. Usa una combinación de letras, números y símbolos';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [newPassword, confirmPassword, navigate]);

  // If user is not authenticated (invalid or expired token), show error
  if (!isAuthenticated && !loading) {
    return (
      <FullSizeCenteredFlexBox>
        <Box sx={{ textAlign: 'center', maxWidth: 500, p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            El enlace para cambiar contraseña ha expirado o es inválido.
          </Alert>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            Por favor solicita un nuevo enlace para restablecer tu contraseña.
          </Typography>
          
          <Button
            variant="contained"
            onClick={() => navigate('/ingresar')}
            sx={{ 
              backgroundColor: '#4CAF4F',
              '&:hover': { backgroundColor: '#449A46' }
            }}
          >
            Ir al login
          </Button>
        </Box>
      </FullSizeCenteredFlexBox>
    );
  }

  if (success) {
    return (
      <FullSizeCenteredFlexBox>
        <Box sx={{ textAlign: 'center', maxWidth: 500, p: 3 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            ¡Contraseña cambiada exitosamente!
          </Alert>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            Tu contraseña ha sido actualizada. Serás redirigido en unos segundos...
          </Typography>
          
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ 
              backgroundColor: '#4CAF4F',
              '&:hover': { backgroundColor: '#449A46' }
            }}
          >
            Continuar
          </Button>
        </Box>
      </FullSizeCenteredFlexBox>
    );
  }

  return (
    <FullSizeCenteredFlexBox>
      <Box sx={{ width: '100%', maxWidth: 400, p: 3 }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h5" 
              component="h1" 
              gutterBottom 
              sx={{ 
                textAlign: 'center',
                color: '#4CAF4F',
                fontWeight: 600,
                mb: 3
              }}
            >
              Cambiar Contraseña
            </Typography>

            <Typography 
              variant="body2" 
              sx={{ 
                textAlign: 'center',
                color: 'text.secondary',
                mb: 3
              }}
            >
              Ingresa tu nueva contraseña para completar el proceso.
            </Typography>

            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="password"
                id="newPassword"
                label="Nueva Contraseña"
                name="newPassword"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                type="password"
                id="confirmPassword"
                label="Confirmar Contraseña"
                name="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                sx={{ mb: 3 }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="button"
                fullWidth
                variant="contained"
                onClick={handlePasswordChange}
                disabled={loading || !newPassword || !confirmPassword}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  backgroundColor: '#4CAF4F',
                  '&:hover': { backgroundColor: '#449A46' },
                  '&:disabled': { backgroundColor: 'rgba(76, 175, 79, 0.3)' }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Cambiar Contraseña'
                )}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  onClick={() => navigate('/ingresar')}
                  sx={{ 
                    color: '#4CAF4F',
                    textTransform: 'none'
                  }}
                >
                  Volver al login
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </FullSizeCenteredFlexBox>
  );
};