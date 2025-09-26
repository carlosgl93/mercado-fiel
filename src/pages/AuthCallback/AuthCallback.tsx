import { FullSizeCenteredFlexBox } from '@/components/styled';
import { useAuth } from '@/hooks/useAuthSupabase';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isCustomer, isSupplier } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Confirmando tu cuenta...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);

        // Check for URL fragments that Supabase might use
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const access_token = hashParams.get('access_token');
        const refresh_token = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        console.log('Auth callback - type:', type, 'has tokens:', !!access_token);

        if (type === 'signup' || type === 'email_confirmation') {
          setMessage('¡Email confirmado exitosamente! Completando tu registro...');
        } else if (type === 'recovery') {
          setMessage('Validando enlace de recuperación...');
        }

        // Let Supabase handle the session from URL fragments
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setError(getErrorMessage(error.message));
          setTimeout(() => {
            navigate('/ingresar?error=' + encodeURIComponent(error.message));
          }, 3000);
          return;
        }

        if (data.session) {
          console.log('Session found, user authenticated');
          setMessage('¡Cuenta confirmada exitosamente! Redirigiendo...');

          // Give time for the auth state to update
          setTimeout(() => {
            // Navigate based on user type once loaded
            if (type === 'recovery') {
              navigate('/cambiar-contrasena');
            } else {
              // For signup confirmation, redirect based on user role
              // The useAuth hook will determine the role
              navigate('/');
            }
          }, 2000);
        } else {
          console.log('No session found, redirecting to login');
          setTimeout(() => {
            navigate('/ingresar');
          }, 2000);
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        setError('Ocurrió un error inesperado. Por favor intenta nuevamente.');
        setTimeout(() => {
          navigate('/ingresar');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  // Helper function to translate error messages
  const getErrorMessage = (errorMessage: string): string => {
    if (errorMessage.includes('Email link is invalid')) {
      return 'El enlace de confirmación ha expirado o es inválido. Por favor solicita uno nuevo.';
    }
    if (errorMessage.includes('Token has expired')) {
      return 'El enlace de confirmación ha expirado. Por favor solicita uno nuevo.';
    }
    return 'Error al confirmar tu email. Por favor intenta nuevamente.';
  };

  return (
    <FullSizeCenteredFlexBox>
      <Box sx={{ textAlign: 'center', maxWidth: 500, p: 3 }}>
        {loading && <CircularProgress sx={{ mb: 2 }} />}

        <Typography variant="h6" sx={{ mb: 2 }}>
          {message}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Tu cuenta ha sido confirmada exitosamente. Serás redirigido en unos segundos...
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Si no eres redirigido automáticamente, puedes{' '}
          <span style={{ color: '#4CAF4F', cursor: 'pointer' }} onClick={() => navigate('/')}>
            hacer clic aquí
          </span>
        </Typography>
      </Box>
    </FullSizeCenteredFlexBox>
  );
};
