import useEntregaApoyo from '@/store/entregaApoyo';
import { notificationState } from '@/store/snackbar';
import { FormAction, getErrorMessage, useErrorHandler } from '@/utils/errorHandling';
import {
  isSupplierFormValid,
  SupplierFormState,
  validateSupplierForm,
} from '@/utils/formValidation';
import { navigateToUserDashboard } from '@/utils/navigationUtils';
import { ChangeEvent, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useAuth } from '../../hooks/useAuthSupabase';

const getCleanInitialState = (): FormState => ({
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
  acceptedTerms: false,
});

interface FormState extends SupplierFormState {
  error?: string;
  comoEnteraste: string;
  comunas?: any;
  servicio?: any;
  especialidad?: any;
  [key: string]: string | boolean | any;
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

const RegistrarPrestadorController = () => {
  const [notification, setNotification] = useRecoilState(notificationState);
  const { signUp, isSigningUp, supplier, customer, isLoggedIn } = useAuth();
  const [{ selectedComunas, selectedServicio, selectedEspecialidad }] = useEntregaApoyo();

  const navigate = useNavigate();

  // Create clean initial state and merge with saved data (but exclude error to prevent stale errors)
  const createInitialState = (): FormState => {
    const savedState = localStorage.getItem('prestadorFormState');
    const cleanState = getCleanInitialState();

    if (savedState) {
      const parsed = JSON.parse(savedState);
      // Merge saved data but always start with clean error state
      return {
        ...cleanState,
        ...parsed,
        error: '', // Always start with no error to prevent stale errors
        comunas: selectedComunas,
        servicio: selectedServicio,
        especialidad: selectedEspecialidad,
      };
    }

    return {
      ...cleanState,
      comunas: selectedComunas,
      servicio: selectedServicio,
      especialidad: selectedEspecialidad,
    };
  };

  const [state, dispatch] = useReducer(reducer, createInitialState());

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({ type: 'CHANGE', payload: { name, value } });
  };

  const handleAcceptTerms = () => {
    dispatch({ type: 'ACCEPT TERMS' });
  };

  const { showError } = useErrorHandler(dispatch, setNotification, notification);

  // Check if form is valid for enabling/disabling submit button
  const isFormValid = isSupplierFormValid(state);

  const handleSubmit = async () => {
    const { nombre, apellido, telefono, nombreNegocio, descripcion, correo, contrasena } = state;

    // Validate form
    const validationError = validateSupplierForm(state);
    if (validationError) {
      showError(validationError.message);
      return;
    }

    try {
      await signUp({
        email: correo,
        password: contrasena,
        nombre: `${nombre} ${apellido}`,
        type: 'supplier',
        telefono: telefono,
        nombre_negocio: nombreNegocio || `${nombre} ${apellido}`,
        descripcion: descripcion || '',
      });

      // Clear form after successful registration
      localStorage.removeItem('prestadorFormState');

      // Show success message
      setNotification({
        ...notification,
        open: true,
        message: '¡Cuenta de proveedor creada exitosamente!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error creating supplier account:', error);
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
    localStorage.setItem('prestadorFormState', JSON.stringify(stateToSave));
  }, [state]);

  // Prefill form with dummy data in development mode
  useEffect(() => {
    // Only prefill in development environment (local development only)
    const isDevEnvironment = import.meta.env.VITE_ENV === 'development';
    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // Double-check: only prefill if BOTH conditions are true
    if (isDevEnvironment && isLocalhost) {
      const dummyData = {
        nombre: 'Carlos',
        apellido: 'García',
        rut: '12345678-9',
        telefono: '+56912345678',
        correo: `proveedor.${Date.now()}@example.com`, // Unique email to avoid conflicts
        contrasena: '123456',
        confirmarContrasena: '123456',
        nombreNegocio: 'Verdulería Don Carlos',
        descripcion:
          'Verdulería familiar con más de 20 años de experiencia ofreciendo productos frescos y de calidad.',
        comoEnteraste: 'Redes sociales',
      };

      // Only prefill if form is empty (to avoid overwriting saved data)
      const isFormEmpty = !state.nombre && !state.apellido && !state.correo;
      if (isFormEmpty) {
        console.log('📝 Prefilling form with dummy data');
        // Update each field individually to avoid type issues
        Object.entries(dummyData).forEach(([key, value]) => {
          dispatch({
            type: 'CHANGE',
            payload: { name: key, value },
          });
        });
      } else {
        console.log('📋 Form already has data, skipping prefill');
      }
    } else {
      console.log('🚀 Production mode - skipping form prefill', {
        VITE_ENV: import.meta.env.VITE_ENV,
        hostname: window.location.hostname,
        isDevEnvironment,
        isLocalhost,
      });
    }
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    navigateToUserDashboard({
      pathname: window.location.pathname,
      customer: customer as any,
      supplier: supplier as any,
      navigate,
    });
  }, [customer, supplier, navigate]);

  return {
    state,
    handleChange,
    handleSubmit,
    handleSelect,
    handleAcceptTerms,
    signUpLoading: isSigningUp,
    isFormValid,
  };
};

export default RegistrarPrestadorController;
