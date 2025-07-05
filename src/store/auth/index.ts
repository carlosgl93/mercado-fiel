import { atom, useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';

import type { Actions } from './types';
import { User } from '@/types/User';
import { useEffect } from 'react';
import api from '@/api/api';
import { AxiosError } from 'axios';
import { notificationState } from '../snackbar';
import { Prestador } from '@/types/Prestador';
import { postPrestador } from '@/api/prestadores/postPrestador';

type AuthState = {
  isLoggedIn: boolean;
  user: User | null | Partial<Prestador>;
  role: 'user' | 'prestador' | null;
  loading: boolean;
  error: string | null;
};

const authState = atom<AuthState>({
  key: 'authState',
  default: {
    role: null,
    isLoggedIn: false,
    user: null,
    loading: false,
    error: null,
  },
});

export const redirectToAfterLoginState = atom<string | null>({
  key: 'redirectToAfterLoginState',
  default: null,
});

function useAuth(): [AuthState, Actions] {
  const [, setNotification] = useRecoilState(notificationState);
  const [_user, setUser] = useRecoilState(authState);
  const [redirectToAfterLogin, setRedirectToAfterLogin] = useRecoilState(redirectToAfterLoginState);
  const navigate = useNavigate();

  async function login(email: string, password: string) {
    try {
      setUser((prev) => ({ ...prev, loading: true }));
      const loginUserResponse = await api.post(`/users/login`, {
        email,
        password,
      });

      const isAlsoPrestador = loginUserResponse.data.prestador;
      const userData = loginUserResponse.data.user;

      if (isAlsoPrestador) {
        setUser((prev) => ({
          ...prev,
          isLoggedIn: true,
          user: isAlsoPrestador,
          role: 'prestador',
        }));
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...isAlsoPrestador,
            role: 'prestador',
            token: loginUserResponse.data.token,
          }),
        );
        navigate('/prestador-dashboard');
      } else {
        setUser((prev) => ({
          ...prev,
          isLoggedIn: true,
          user: loginUserResponse.data.user,
          role: 'user',
        }));
        localStorage.setItem(
          'user',
          JSON.stringify({ ...userData, role: 'user', token: loginUserResponse.data.token }),
        );
        navigate('/usuario-dashboard');
      }

      setUser((prev) => ({ ...prev, loading: false }));

      if (redirectToAfterLogin === '/' && isAlsoPrestador) {
        navigate('/prestador-dashboard');
      } else if (redirectToAfterLogin === '/' && userData) {
        navigate('/usuario-dashboard');
      } else {
        redirectAfterLogin();
      }

      setNotification({
        open: true,
        message: 'Sesión iniciada con éxito',
        severity: 'success',
      });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        console.log(error.message);
        switch (error.message) {
          case 'Request failed with status code 401':
            setUser((prev) => ({
              ...prev,
              loading: false,
              error: 'Email o contraseña incorrecto',
            }));
            return {
              error,
              message: 'Email o contraseña incorrectos',
            };
          default:
            return error;
        }
      }
    }
  }

  async function createUser(user: User) {
    setUser((prev) => ({ ...prev, loading: true, role: 'user' }));
    try {
      await api.post('/users', user);
      setUser((prev) => ({ ...prev, isLoggedIn: true, user, role: 'user' }));
      localStorage.setItem('user', JSON.stringify(_user));
      redirectAfterLogin();
      setNotification({
        open: true,
        message: 'Cuenta creada con exito, no olvides confirmar tu email',
        severity: 'success',
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.message);
        switch (error?.response?.data.message) {
          case 'Este email ya esta asociado a una cuenta.':
            setUser((prev) => ({
              ...prev,
              loading: false,
              error: 'Este email ya esta asociado a una cuenta',
            }));
            return {
              error,
              message: 'Email ya esta asociado a una cuenta',
            };
          case 'Este rut ya esta asociado a una cuenta.':
            setUser((prev) => ({
              ...prev,
              loading: false,
              error: 'Este rut ya esta asociado a una cuenta',
            }));
            return {
              error,
              message: 'Rut ya esta asociado a una cuenta',
            };
          case "The 'password' field is required":
            setUser((prev) => ({
              ...prev,
              loading: false,
              error: 'El campo contraseña es requerido',
            }));
            return {
              error,
              message: 'El campo contraseña es requerido',
            };
        }
      }
    }
    setUser((prev) => ({ ...prev, loading: false }));
  }

  async function createPrestador(prestador: Prestador) {
    try {
      const res = await postPrestador(prestador);
      if (res.message !== 'Error al crear prestador') {
        setUser((prev) => ({ ...prev, isLoggedIn: true, user: prestador, role: 'prestador' }));
        localStorage.setItem('user', JSON.stringify({ ...prestador, role: 'prestador' }));
        setNotification({
          open: true,
          message: 'Cuenta creada con exito, no olvides confirmar tu email',
          severity: 'success',
        });
        navigate(`/prestador-dashboard/`);
      } else {
        setNotification({
          open: true,
          message: 'Ocurrio un error al crear el prestador',
          severity: 'error',
        });
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        setNotification({
          open: true,
          message: error.message,
          severity: 'error',
        });
      }
    }
  }

  function logout() {
    setUser((prev) => ({ ...prev, isLoggedIn: false, user: null, role: null }));
    localStorage.removeItem('user');
    navigate('/');
  }

  function redirectAfterLogin() {
    return redirectToAfterLogin ? navigate(redirectToAfterLogin) : null;
  }

  function updateRedirectToAfterLogin(path: string) {
    setRedirectToAfterLogin(path);
  }

  useEffect(() => {
    const cleanErrorMessage = setTimeout(() => {
      setUser((prev) => ({ ...prev, error: null }));
    }, 5000);

    return () => {
      clearTimeout(cleanErrorMessage);
    };
  }, [_user.error, setUser]);

  return [
    _user,
    { login, createUser, logout, redirectAfterLogin, updateRedirectToAfterLogin, createPrestador },
  ];
}

export default useAuth;
