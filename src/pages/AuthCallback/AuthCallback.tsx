import { FullSizeCenteredFlexBox } from '@/components/styled';
import { CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback from Supabase
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          navigate('/ingresar?error=' + encodeURIComponent(error.message));
          return;
        }

        if (data.session) {
          // User has confirmed their email and is now logged in
          // The useAuth hook will handle the rest via onAuthStateChange
          navigate('/');
        } else {
          // No session, redirect to login
          navigate('/ingresar');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        navigate('/ingresar');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <FullSizeCenteredFlexBox>
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Confirmando tu cuenta...
      </Typography>
    </FullSizeCenteredFlexBox>
  );
};
