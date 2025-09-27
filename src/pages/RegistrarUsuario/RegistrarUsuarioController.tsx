import { notificationState } from '@/store/snackbar';
import { Comuna } from '@/types';
import { FormAction, getErrorMessage, useErrorHandler } from '@/utils/errorHandling';
import { isUserFormValid, UserFormState, validateUserForm } from '@/utils/formValidation';
import { navigateToUserDashboard } from '@/utils/navigationUtils';
import { ChangeEvent, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useUserLookingFor } from '../../hooks';
import { useAuth } from '../../hooks/useAuthSupabase';

export type Patient = {
  name: string;
  age: number;
  rut: string;
  service?: string;
  speciality?: string;
};

interface FormState extends UserFormState {
  error: string;
  nombrePaciente: string;
  patientName?: string;
  patientAge?: string;
  patientRut?: string;
  [key: string]: string | null | boolean | Comuna | undefined;
}

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
  | FormAction
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
        error: action.payload!.error,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: '',
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

// Utility to create clean initial state
const getCleanInitialState = (): FormState => ({
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
});

const RegistrarUsuarioController = () => {
  const { signUp, customer, supplier } = useAuth();
  const navigate = useNavigate();
  const { translatedLookingFor } = useUserLookingFor();
  const [notification, setNotification] = useRecoilState(notificationState);

  // Create clean initial state and merge with saved data (but exclude error to prevent stale errors)
  const createInitialState = (): FormState => {
    const savedState = localStorage.getItem('formState');
    const cleanState = getCleanInitialState();

    if (savedState) {
      const parsed = JSON.parse(savedState);
      // Merge saved data but always start with clean error state
      return {
        ...cleanState,
        ...parsed,
        error: '', // Always start with no error to prevent stale errors
      };
    }

    return cleanState;
  };

  const [state, dispatch] = useReducer(reducer, createInitialState());
  const { showError } = useErrorHandler(dispatch, setNotification, notification);

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

  const handleSubmit = async () => {
    // Validate form
    const validationError = validateUserForm(state);
    if (validationError) {
      showError(validationError.message);
      return;
    }

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

      // Success message is handled by the useAuth hook
    } catch (error) {
      console.error('Error creating user account:', error);
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch({ type: 'CHANGE', payload: { name, value } });
  };

  // Save state to localStorage whenever it changes (but exclude error to prevent persistence)
  useEffect(() => {
    const { error, ...stateToSave } = state;
    localStorage.setItem('formState', JSON.stringify(stateToSave));
  }, [state]);

  useEffect(() => {
    navigateToUserDashboard({
      pathname: window.location.pathname,
      customer: customer as any,
      supplier: supplier as any,
      navigate,
    });
  }, [customer, supplier, navigate]);

  useEffect(() => {
    if (!translatedLookingFor) {
      navigate('/beneficios');
    }
  }, [translatedLookingFor]);

  return {
    state,
    handleChange,
    handleSubmit,
    handleSelect,
    handleAcceptTerms,
    isFormValid: isUserFormValid(state),
  };
};

export default RegistrarUsuarioController;
