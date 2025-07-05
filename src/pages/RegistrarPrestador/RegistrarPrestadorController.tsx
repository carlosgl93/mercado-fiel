import useEntregaApoyo from '@/store/entregaApoyo';
import { notificationState } from '@/store/snackbar';
import { ChangeEvent, useEffect, useReducer } from 'react';
import { useRecoilState } from 'recoil';
import { useAuthNew } from '@/hooks/useAuthNew';
import { CreatePrestadorParams } from '@/api/auth';
import { useNavigate } from 'react-router-dom';

type FormState = {
  error: string;
  nombre: string;
  apellido: string;
  rut: string;
  telefono: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
  comoEnteraste: string;
  acceptedTerms: boolean;
  [key: string]: string | boolean;
};

type FormActions =
  | {
      type: 'CHANGE';
      payload: {
        name: string;
        value: string;
      };
    }
  | {
      type: 'ACCEPT TERMS';
    }
  | {
      type: 'ERROR';
      payload: {
        error: string;
      };
    }
  | {
      type: 'SET_STATE';
      payload: FormState;
    };

const reducer = (state: FormState, action: FormActions) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case 'ACCEPT TERMS':
      return {
        ...state,
        acceptedTerms: !state.acceptedTerms,
      };
    case 'ERROR':
      return {
        ...state,
        error: action.payload.error,
      };
    case 'SET_STATE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const RegistrarPrestadorController = () => {
  const [notification, setNotification] = useRecoilState(notificationState);
  const { createPrestador, createPrestadorLoading, prestador, user } = useAuthNew();
  const [{ selectedComunas, selectedServicio, selectedEspecialidad }] = useEntregaApoyo();

  const navigate = useNavigate();

  const initialState = localStorage.getItem('prestadorFormState')
    ? JSON.parse(localStorage.getItem('prestadorFormState') || '{}')
    : {
        error: '',
        nombre: '',
        apellido: '',
        rut: '',
        telefono: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        comoEnteraste: '',
        comunas: selectedComunas,
        servicio: selectedServicio,
        especialidad: selectedEspecialidad,
        acceptedTerms: false,
      };

  initialState.comunas = selectedComunas;
  initialState.servicio = selectedServicio;
  initialState.especialidad = selectedEspecialidad;

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({ type: 'CHANGE', payload: { name, value } });
  };

  const handleAcceptTerms = () => {
    dispatch({ type: 'ACCEPT TERMS' });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const rutRegex = /^[0-9]+-[0-9kK]{1}$/;

  const handleSubmit = async () => {
    const { correo, rut, contrasena, confirmarContrasena, nombre, apellido, acceptedTerms } = state;

    if (!selectedComunas || !selectedServicio) {
      navigate('/entrega-apoyo');
      setNotification({
        ...notification,
        open: true,
        message: 'Debes seleccionar una comuna y un servicio, tus datos estan guardados.',
        severity: 'info',
        persist: false,
      });
      return;
    }

    if (!emailRegex.test(correo)) {
      dispatch({
        type: 'ERROR',
        payload: {
          error: 'Email inválido',
        },
      });
      setNotification({
        ...notification,
        open: true,
        message: 'Email inválido',
        severity: 'error',
      });
      setTimeout(() => dispatch({ type: 'ERROR', payload: { error: '' } }), 5000);
    } else if (!rutRegex.test(rut)) {
      dispatch({
        type: 'ERROR',
        payload: {
          error: 'RUT inválido',
        },
      });
      setNotification({
        ...notification,
        open: true,
        message: 'RUT inválido',
        severity: 'error',
      });
      setTimeout(() => dispatch({ type: 'ERROR', payload: { error: '' } }), 5000);
    } else if (confirmarContrasena !== contrasena) {
      dispatch({
        type: 'ERROR',
        payload: {
          error: 'Las contraseñas no coinciden',
        },
      });
      setNotification({
        ...notification,
        open: true,
        message: 'Las contraseñas no coinciden',
        severity: 'error',
      });
      setTimeout(() => dispatch({ type: 'ERROR', payload: { error: '' } }), 5000);
    } else {
      const prestador: CreatePrestadorParams = {
        nombre,
        apellido,
        rut,
        // telefono,
        correo,
        contrasena,
        comunas: selectedComunas,
        servicio: selectedServicio ?? undefined,
        acceptedTerms,
        especialidad: selectedEspecialidad ?? undefined,
      };

      createPrestador(prestador);
    }
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch({ type: 'CHANGE', payload: { name, value } });
  };

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('prestadorFormState', JSON.stringify(state));
  }, [state]);

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('prestadorFormState');
    if (savedState) {
      dispatch({ type: 'SET_STATE', payload: JSON.parse(savedState) });
    }
  }, []);

  useEffect(() => {
    if (user?.email) {
      navigate('/usuario-dashboard');
      return;
    }
    if (prestador?.email) {
      navigate('/prestador-dashboard');
      return;
    }
  }, [user, prestador]);

  useEffect(() => {
    if (!selectedServicio || !selectedComunas) {
      navigate('/entrega-apoyo');
    }
  }, [selectedComunas, selectedServicio]);

  return {
    state,
    handleChange,
    handleSubmit,
    handleSelect,
    handleAcceptTerms,
    createPrestadorLoading,
  };
};

export default RegistrarPrestadorController;
