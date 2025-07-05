import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { auth, db } from '@/firebase/firebase';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { notificationState } from '@/store/snackbar';
import { FirebaseError } from 'firebase/app';
import { User, userState } from '@/store/auth/user';
import { Prestador, prestadorState } from '@/store/auth/prestador';
import { AvailabilityData } from '@/pages/ConstruirPerfil/Disponibilidad/ListAvailableDays';
import { redirectToAfterLoginState } from '@/store/auth';
import { editDisponibilidadState } from '@/store/construirPerfil/availability';
import { createPrestador, createUser } from '@/api/auth';
import { sendVerificationEmailApi } from '@/api';
import { determineRedirectAfterLogin } from '../utils/redirectAfterLoginLogic';
import { useResetState } from './useResetState';
import { useEffect } from 'react';

export const useAuthNew = () => {
  const [user, setUserState] = useRecoilState(userState);
  const [prestador, setPrestadorState] = useRecoilState(prestadorState);
  const setNotification = useSetRecoilState(notificationState);
  const redirectAfterLogin = useRecoilValue(redirectToAfterLoginState);
  const setEditDisponibilidad = useSetRecoilState(editDisponibilidadState);
  const { resetState } = useResetState();

  const isLoggedIn = user?.isLoggedIn || prestador?.isLoggedIn;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const correo = authUser.email;
        const usersColectionRef = collection(db, 'users');
        const prestadorCollectionRef = collection(db, 'providers');
        const adminsCollectionRef = collection(db, 'admins');

        const userQuery = query(usersColectionRef, limit(1), where('email', '==', correo));
        const prestadorQuery = query(
          prestadorCollectionRef,
          limit(1),
          where('email', '==', correo),
        );

        const adminsQuery = query(adminsCollectionRef, limit(1), where('email', '==', correo));

        const [users, prestadores, admins] = await Promise.all([
          getDocs(userQuery),
          getDocs(prestadorQuery),
          getDocs(adminsQuery),
        ]);

        if (users.docs.length > 0) {
          const user = users.docs[0].data() as User;
          user.token = authUser.refreshToken;
          user.id = authUser.uid;
          setUserState({ ...user, isLoggedIn: true, token: authUser.refreshToken });
          queryClient.setQueryData(['user', correo], user);
        } else if (prestadores.docs.length > 0) {
          const prestador = prestadores.docs[0].data() as Prestador;
          const availabilityCollectionRef = collection(
            db,
            'providers',
            prestador.id,
            'availability',
          );
          const availabilityData = await getDocs(availabilityCollectionRef);
          const availability = availabilityData.docs.map((doc) => doc.data()) as AvailabilityData[];
          prestador.availability = availability;
          setPrestadorState({ ...prestador, isLoggedIn: true });
          queryClient.setQueryData(['prestador', correo], prestador);
        } else if (admins.docs.length > 0) {
          const admin = admins.docs[0].data() as User;
          admin.token = authUser.refreshToken;
          admin.id = authUser.uid;
          setUserState({ ...admin, isLoggedIn: true, role: 'admin', token: authUser.refreshToken });
          queryClient.setQueryData(['user', correo], admin);
          navigate('/backoffice');
        } else {
          console.error('No user or provider found with the given email.');
        }
      } else {
        // User is signed out
        setUserState(null);
        setPrestadorState(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [queryClient, setUserState, setPrestadorState]);

  const { mutate: createPrestadorMutation, isLoading: createPrestadorLoading } = useMutation(
    createPrestador,
    {
      onSuccess(data) {
        setNotification({
          open: true,
          message: `Cuenta creada exitosamente`,
          severity: 'success',
        });
        sendVerificationEmailApi.post('/', {
          options: {
            from: 'Mercado Fiel <contacto@mercadofiel.cl>',
            to: data.email,
            subject: 'Bienvenido a Mercado Fiel',
            text: `Verifica tu cuenta`,
          },
        });
        setPrestadorState({ ...data, isLoggedIn: true });
        queryClient.setQueryData(['prestador', data?.email], prestador);
        navigate('/prestador-dashboard');
      },
      onError(error: FirebaseError) {
        setNotification({
          open: true,
          message: error.message,
          severity: 'error',
        });
      },
      onMutate() {
        setNotification({
          open: true,
          message: 'Creando tu cuenta...',
          severity: 'info',
        });
      },
    },
  );

  const {
    mutate: createUserMutation,
    isLoading: createUserLoading,
    error: createUserError,
  } = useMutation(createUser, {
    onSuccess(data) {
      setNotification({
        open: true,
        message: `Cuenta creada exitosamente`,
        severity: 'success',
      });
      sendVerificationEmailApi.post('/', {
        options: {
          from: 'Mercado Fiel <contacto@mercadofiel.cl>',
          to: data?.email,
          subject: 'Bienvenido a Mercado Fiel',
          text: `Verifica tu cuenta`,
        },
      });
      setUserState({ ...data, isLoggedIn: true } as User);
      queryClient.setQueryData(['user', data?.email], user);
      window.scrollTo(0, 0);
      redirectAfterLogin
        ? navigate(determineRedirectAfterLogin(redirectAfterLogin, 'user'))
        : navigate(`/usuario-dashboard`);
    },
    onError(error: Error) {
      setNotification({
        open: true,
        message: error.message,
        severity: 'error',
      });
    },
    onMutate() {
      setNotification({
        open: true,
        message: 'Creando tu cuenta...',
        severity: 'info',
      });
    },
  });

  const { mutate: login, isLoading: loginLoading } = useMutation(
    'login',
    async ({ correo, contrasena }: { correo: string; contrasena: string }) => {
      setNotification({
        open: true,
        message: 'Iniciando sesión...',
        severity: 'info',
      });

      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        correo.toLowerCase(),
        contrasena,
      );

      const usersColectionRef = collection(db, 'users');
      const prestadorCollectionRef = collection(db, 'providers');
      const adminsCollectionRef = collection(db, 'admins');
      const userQuery = query(usersColectionRef, limit(1), where('email', '==', correo));
      const prestadorQuery = query(prestadorCollectionRef, limit(1), where('email', '==', correo));
      const adminQuery = query(adminsCollectionRef, limit(1), where('email', '==', correo));

      const [users, prestadores, admins] = await Promise.all([
        getDocs(userQuery),
        getDocs(prestadorQuery),
        getDocs(adminQuery),
      ]);

      if (users.docs.length > 0) {
        const user = users.docs[0].data() as User;
        user.token = userCredential.user.refreshToken;
        user.id = userCredential.user.uid;
        setUserState({ ...user, isLoggedIn: true, token: userCredential.user.refreshToken });
        queryClient.setQueryData(['user', correo], user);
        return { role: 'user', data: user };
      } else if (prestadores.docs.length > 0) {
        const prestador = prestadores.docs[0].data() as Prestador;
        const availabilityCollectionRef = collection(db, 'providers', prestador.id, 'availability');
        const availabilityData = await getDocs(availabilityCollectionRef);
        const availability = availabilityData.docs.map((doc) => doc.data()) as AvailabilityData[];
        prestador.availability = availability;
        setPrestadorState({ ...prestador, isLoggedIn: true });
        queryClient.setQueryData(['prestador', correo], prestador);
        return { role: 'prestador', data: prestador };
      } else if (admins.docs.length > 0) {
        const admin = admins.docs[0].data() as User;
        admin.token = userCredential.user.refreshToken;
        admin.id = userCredential.user.uid;
        setUserState({ ...admin, isLoggedIn: true, token: userCredential.user.refreshToken });
        queryClient.setQueryData(['user', correo], admin);
        return { role: 'admin', data: admin };
      } else {
        throw new Error('No user or provider found with the given email.');
      }
    },
    {
      onError(error: FirebaseError) {
        let message = 'Error: ';

        switch (error.code) {
          case 'auth/user-not-found':
            message += 'No se encontró ningún usuario con ese correo electrónico.';
            break;
          case 'auth/wrong-password':
            message += 'La contraseña es incorrecta.';
            break;
          case 'auth/invalid-email':
            message += 'El correo electrónico no es válido.';
            break;
          case 'auth/invalid-credential':
            message += 'Email o contraseña incorrecta.';
            break;
          default:
            message += error.message;
        }

        setNotification({
          open: true,
          message,
          severity: 'error',
        });
      },
      onSuccess(data) {
        setNotification({
          open: true,
          message: `Sesión iniciada exitosamente`,
          severity: 'success',
        });
        if (data?.role === 'user') {
          setUserState({ ...data.data, isLoggedIn: true } as User);
          redirectAfterLogin
            ? navigate(determineRedirectAfterLogin(redirectAfterLogin, 'user'))
            : navigate(`/usuario-dashboard`);
        } else if (data?.role === 'prestador') {
          setPrestadorState({ ...data.data, isLoggedIn: true } as Prestador);
          redirectAfterLogin
            ? navigate(determineRedirectAfterLogin(redirectAfterLogin, 'provider'))
            : navigate(`/prestador-dashboard`);
        } else if (data?.role === 'admin') {
          setUserState({
            ...data.data,
            isLoggedIn: true,
            role: data.role,
          } as User);
          redirectAfterLogin
            ? navigate(determineRedirectAfterLogin(redirectAfterLogin, 'admin'))
            : navigate(`/backoffice`);
        }
      },
    },
  );
  const { mutate: adminLogin, isLoading: adminLoginLoading } = useMutation(
    async ({ correo, contrasena }: { correo: string; contrasena: string }) => {
      setNotification({
        open: true,
        message: 'Iniciando sesión...',
        severity: 'info',
      });
      return setPersistence(auth, browserSessionPersistence).then(() =>
        signInWithEmailAndPassword(auth, correo, contrasena).then(async ({ user: authUser }) => {
          const adminsColectionRef = collection(db, 'admins');
          const adminQuery = query(adminsColectionRef, limit(1), where('email', '==', correo));
          const admins = await getDocs(adminQuery);

          if (admins.docs.length > 0) {
            const user = admins.docs[0].data() as User;
            user.token = authUser.refreshToken;
            user.id = admins.docs[0].id;
            setUserState({
              ...user,
              isLoggedIn: true,
              role: 'admin',
              token: authUser.refreshToken,
            });
            queryClient.setQueryData(['user', correo], user);
            return { role: 'admin', data: user };
          } else {
            throw new Error('No se encontró ningún admin con ese correo electrónico.');
          }
        }),
      );
    },
    {
      onError(error: FirebaseError) {
        let message = 'Error: ';

        switch (error.code) {
          case 'auth/user-not-found':
            message += 'No se encontró ningún admin con ese correo electrónico.';
            break;
          case 'auth/wrong-password':
            message += 'La contraseña es incorrecta.';
            break;
          case 'auth/invalid-email':
            message += 'El correo electrónico no es válido.';
            break;
          case 'auth/invalid-credential':
            message += 'Email o contraseña incorrecta.';
            break;
          default:
            message += error.message;
        }

        setNotification({
          open: true,
          message,
          severity: 'error',
        });
      },
      onSuccess(data) {
        setNotification({
          open: true,
          message: `Sesión iniciada exitosamente`,
          severity: 'success',
        });
        if (data?.role === 'admin') {
          setUserState({
            ...data.data,
            isLoggedIn: true,
            role: data.role,
            token: data.data.token,
          } as User);
          navigate(`/backoffice`);
        }
      },
    },
  );

  const { mutate: logout } = useMutation(() => signOut(auth), {
    onSuccess: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('prestador');
      resetState();

      // setUserState(null);
      // setPrestadorState(null);
      // resetEntregaApoyoState();
      // resetRecibeApoyoState();
      queryClient.resetQueries();
      navigate('/ingresar');
      setEditDisponibilidad(false);
    },
  });

  return {
    login,
    logout,
    createUser: createUserMutation,
    adminLogin,
    createPrestador: createPrestadorMutation,
    user,
    prestador,
    isLoggedIn,
    loginLoading,
    createUserLoading,
    createUserError,
    adminLoginLoading,
    createPrestadorLoading,
    setUserState,
  };
};
