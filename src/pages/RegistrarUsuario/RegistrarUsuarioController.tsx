import { CreateUserParams, ForWhom } from '@/api/auth';
import useRecibeApoyo from '@/store/recibeApoyo';
import { ChangeEvent, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthNew } from '@/hooks';
import { Comuna } from '@/types';
import { useSetRecoilState } from 'recoil';
import { notificationState } from '@/store/snackbar';

export type Patient = {
  name: string;
  age: number;
  rut: string;
  service?: string;
  speciality?: string;
};

type FormState = {
  error: string;
  nombre: string;
  apellido: string;
  paraQuien: ForWhom;
  nombrePaciente: string;
  rut: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
  acceptedTerms: boolean;
  patientName?: string;
  patientAge?: string;
  patientRut?: string;
  [key: string]: string | null | boolean | Comuna | undefined;
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

const RegistrarUsuarioController = () => {
  const { createUser, user, prestador } = useAuthNew();
  const navigate = useNavigate();
  const setNotification = useSetRecoilState(notificationState);

  const [{ forWhom, comuna, servicio, especialidad }] = useRecibeApoyo();

  const initialState = localStorage.getItem('formState')
    ? JSON.parse(localStorage.getItem('formState') || '{}')
    : {
        error: '',
        nombre: '',
        apellido: '',
        paraQuien: forWhom,
        nombrePaciente: '',
        rut: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        acceptedTerms: false,
      };

  initialState.paraQuien = forWhom;

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    nombre,
    apellido,
    paraQuien,
    rut,
    correo,
    contrasena,
    confirmarContrasena,
    acceptedTerms,
    patientName,
    patientAge,
    patientRut,
  } = state;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({ type: 'CHANGE', payload: { name, value } });
  };

  const handleAcceptTerms = () => {
    dispatch({ type: 'ACCEPT TERMS' });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = () => {
    if (!emailRegex.test(correo)) {
      dispatch({
        type: 'ERROR',
        payload: {
          error: 'Email inválido',
        },
      });
      setTimeout(() => dispatch({ type: 'ERROR', payload: { error: '' } }), 5000);
    } else if (confirmarContrasena !== contrasena) {
      dispatch({
        type: 'ERROR',
        payload: {
          error: 'Las contraseñas no coinciden',
        },
      });
      setTimeout(() => dispatch({ type: 'ERROR', payload: { error: '' } }), 5000);
    } else if (!comuna) {
      navigate('/recibe-apoyo');
      setNotification({
        open: true,
        message: 'Debes seleccionar una comuna',
        severity: 'error',
      });
    } else if (!servicio) {
      setNotification({
        open: true,
        message: 'Debes seleccionar un servicio y una especialidad',
        severity: 'error',
      });
      navigate('/recibe-apoyo');
    } else {
      let newUser: CreateUserParams = {
        nombre,
        apellido,
        contrasena,
        paraQuien: paraQuien,
        rut,
        comuna: comuna as Comuna,
        correo,
        acceptedTerms,
        servicio,
        especialidad: especialidad?.especialidadName ? especialidad : undefined,
      };
      if (paraQuien === 'tercero' && (!patientName || !patientAge || !patientRut)) {
        setNotification({
          open: true,
          message: 'Faltan datos del paciente',
          severity: 'error',
        });
        navigate('/recibe-apoyo');
        throw new Error('Faltan datos del paciente');
      } else {
        newUser = {
          ...newUser,
          pacientes: [
            {
              name: patientName!,
              age: Number(patientAge!),
              rut: patientRut!,
              service: servicio.serviceName,
              speciality: especialidad?.especialidadName,
            },
          ],
        };
      }
      try {
        createUser(newUser);
      } catch (error) {
        dispatch({
          type: 'ERROR',
          payload: {
            error: 'Error al crear usuario',
          },
        });
      }
    }
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch({ type: 'CHANGE', payload: { name, value } });
  };

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('formState', JSON.stringify(state));
  }, [state]);

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('formState');
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
    if (!servicio || !comuna || !forWhom) {
      navigate('/recibe-apoyo');
    }
  }, [servicio, comuna]);

  return {
    state,
    handleChange,
    handleSubmit,
    handleSelect,
    handleAcceptTerms,
  };
};

export default RegistrarUsuarioController;
