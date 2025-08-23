import { Comuna } from '@/types';
import { ChangeEvent, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserLookingFor } from '../../hooks';
import { useAuth } from '../../hooks/useAuthSupabase';

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
  nombrePaciente: string;
  rut: string;
  telefono: string;
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
  const { signUp, customer, supplier } = useAuth();
  const navigate = useNavigate();
  const { translatedLookingFor } = useUserLookingFor();

  const initialState = localStorage.getItem('formState')
    ? JSON.parse(localStorage.getItem('formState') || '{}')
    : {
        error: '',
        nombre: '',
        apellido: '',
        nombrePaciente: '',
        rut: '',
        telefono: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        acceptedTerms: false,
      };

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    nombre,
    apellido,
    rut,
    telefono,
    correo,
    contrasena,
    confirmarContrasena,
    acceptedTerms,
  } = state;

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
    if (!emailRegex.test(correo)) {
      dispatch({
        type: 'ERROR',
        payload: {
          error: 'Email inválido',
        },
      });
      setTimeout(() => dispatch({ type: 'ERROR', payload: { error: '' } }), 5000);
    } else if (!rutRegex.test(rut)) {
      dispatch({
        type: 'ERROR',
        payload: {
          error: 'RUT inválido. Formato: 12345678-9',
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
    } else if (contrasena.length < 6) {
      dispatch({
        type: 'ERROR',
        payload: {
          error: 'La contraseña debe tener al menos 6 caracteres',
        },
      });
      setTimeout(() => dispatch({ type: 'ERROR', payload: { error: '' } }), 5000);
    } else if (!telefono) {
      dispatch({
        type: 'ERROR',
        payload: {
          error: 'El teléfono es requerido',
        },
      });
      setTimeout(() => dispatch({ type: 'ERROR', payload: { error: '' } }), 5000);
    } else {
      try {
        await signUp({
          email: correo,
          password: contrasena,
          nombre: `${nombre} ${apellido}`,
          type: 'customer',
          telefono: telefono,
        });

        // Clear form after successful registration
        localStorage.removeItem('formState');
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
    if (customer?.idCliente) {
      navigate('/usuario-dashboard');
      return;
    }
    if (supplier?.idProveedor) {
      navigate('/prestador-dashboard');
      return;
    }
  }, [customer, supplier, navigate]);

  useEffect(() => {
    if (!translatedLookingFor) {
      navigate('/beneficios');
    }
  }, [translatedLookingFor]);

  useEffect(() => {
    // reset the error state after 5 seconds
    const timer = setTimeout(() => {
      dispatch({ type: 'ERROR', payload: { error: '' } });
    }, 5000);

    return () => clearTimeout(timer);
  }, [state.error, dispatch]);

  return {
    state,
    handleChange,
    handleSubmit,
    handleSelect,
    handleAcceptTerms,
  };
};

export default RegistrarUsuarioController;
