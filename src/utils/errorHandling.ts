import { useCallback } from 'react';

export interface FormAction {
  type: 'ERROR' | 'CLEAR_ERROR';
  payload?: { error: string };
}

export const useErrorHandler = (
  dispatch: React.Dispatch<FormAction>,
  setNotification?: (notification: any) => void,
  notification?: any
) => {
  const showError = useCallback((message: string) => {
    dispatch({ type: 'ERROR', payload: { error: message } });
    
    if (setNotification && notification) {
      setNotification({
        ...notification,
        open: true,
        message,
        severity: 'error',
      });
    }
    
    // Auto-clear error after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'CLEAR_ERROR' });
    }, 5000);
  }, [dispatch, setNotification, notification]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch]);

  return { showError, clearError };
};

export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    // Handle Supabase auth errors
    if (error.message.includes('User already registered')) {
      return 'El email ya está registrado';
    }
    if (error.message.includes('Password should be')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    if (error.message.includes('Invalid email')) {
      return 'Email inválido';
    }
    if (error.message.includes('signup disabled')) {
      return 'El registro está deshabilitado temporalmente';
    }
    if (error.message.includes('Email not confirmed')) {
      return 'Por favor confirma tu email antes de continuar';
    }
    
    // Handle database errors
    if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
      return 'Ya existe una cuenta con estos datos';
    }
    
    return error.message;
  }
  
  // Default error messages
  return 'Ha ocurrido un error inesperado. Por favor intenta nuevamente.';
};