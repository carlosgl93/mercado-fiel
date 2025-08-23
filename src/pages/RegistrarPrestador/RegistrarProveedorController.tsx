import useEntregaApoyo from '@/store/entregaApoyo';
import { notificationState } from '@/store/snackbar';
import { ChangeEvent, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useAuth } from '../../hooks/useAuthSupabase';

type FormState = {
  error: string;
  nombre: string;
  apellido: string;
  rut: string;
  telefono: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
  nombreNegocio: string;
  descripcion: string;
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
  const { signUp, isSigningUp, supplier, customer } = useAuth();
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
        nombreNegocio: '',
        descripcion: '',
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
    const {
      correo,
      rut,
      contrasena,
      confirmarContrasena,
      nombre,
      apellido,
      telefono,
      nombreNegocio,
      descripcion,
      acceptedTerms,
    } = state;

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
          error: 'RUT inválido. Formato: 12345678-9',
        },
      });
      setNotification({
        ...notification,
        open: true,
        message: 'RUT inválido. Formato: 12345678-9',
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
    } else if (contrasena.length < 6) {
      dispatch({
        type: 'ERROR',
        payload: {
          error: 'La contraseña debe tener al menos 6 caracteres',
        },
      });
      setNotification({
        ...notification,
        open: true,
        message: 'La contraseña debe tener al menos 6 caracteres',
        severity: 'error',
      });
      setTimeout(() => dispatch({ type: 'ERROR', payload: { error: '' } }), 5000);
    } else if (!telefono) {
      dispatch({
        type: 'ERROR',
        payload: {
          error: 'El teléfono es requerido',
        },
      });
      setNotification({
        ...notification,
        open: true,
        message: 'El teléfono es requerido',
        severity: 'error',
      });
      setTimeout(() => dispatch({ type: 'ERROR', payload: { error: '' } }), 5000);
    } else {
      try {
        await signUp({
          email: correo,
          password: contrasena,
          nombre: `${nombre} ${apellido}`,
          type: 'supplier',
          telefono_contacto: telefono,
          nombre_negocio: nombreNegocio || `${nombre} ${apellido}`,
          descripcion: descripcion || '',
        });

        // Clear form after successful registration
        localStorage.removeItem('prestadorFormState');
      } catch (error) {
        dispatch({
          type: 'ERROR',
          payload: {
            error: 'Error al crear cuenta de proveedor',
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
    if (customer?.email) {
      navigate('/usuario-dashboard');
      return;
    }
    if (supplier?.email) {
      navigate('/prestador-dashboard');
      return;
    }
  }, [customer, supplier, navigate]);

  return {
    state,
    handleChange,
    handleSubmit,
    handleSelect,
    handleAcceptTerms,
    signUpLoading: isSigningUp,
  };
};

export default RegistrarPrestadorController;
