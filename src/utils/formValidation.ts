// Shared form validation utilities

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const RUT_REGEX = /^[0-9]+-[0-9kK]{1}$/;
export const MIN_PASSWORD_LENGTH = 6;

export interface ValidationError {
  field: string;
  message: string;
}

export interface UserFormState {
  correo: string;
  rut: string;
  contrasena: string;
  confirmarContrasena: string;
  telefono: string;
  nombre: string;
  apellido: string;
  acceptedTerms: boolean;
}

export interface SupplierFormState extends UserFormState {
  nombreNegocio?: string;
  descripcion?: string;
  comoEnteraste?: string;
}

export const validateUserForm = (state: UserFormState): ValidationError | null => {
  const { correo, rut, contrasena, confirmarContrasena, telefono, nombre, apellido } = state;

  if (!nombre.trim()) {
    return { field: 'nombre', message: 'El nombre es requerido' };
  }
  
  if (!apellido.trim()) {
    return { field: 'apellido', message: 'El apellido es requerido' };
  }

  if (!EMAIL_REGEX.test(correo)) {
    return { field: 'correo', message: 'Email inválido' };
  }
  
  if (!RUT_REGEX.test(rut)) {
    return { field: 'rut', message: 'RUT inválido. Formato: 12345678-9' };
  }
  
  if (contrasena.length < MIN_PASSWORD_LENGTH) {
    return { field: 'contrasena', message: 'La contraseña debe tener al menos 6 caracteres' };
  }
  
  if (confirmarContrasena !== contrasena) {
    return { field: 'confirmarContrasena', message: 'Las contraseñas no coinciden' };
  }
  
  if (!telefono.trim()) {
    return { field: 'telefono', message: 'El teléfono es requerido' };
  }

  if (!state.acceptedTerms) {
    return { field: 'acceptedTerms', message: 'Debes aceptar los términos y condiciones' };
  }
  
  return null;
};

export const validateSupplierForm = (state: SupplierFormState): ValidationError | null => {
  // Use the base user validation first
  const baseValidation = validateUserForm(state);
  if (baseValidation) {
    return baseValidation;
  }

  // Additional supplier-specific validations can be added here if needed
  return null;
};

export const isUserFormValid = (state: UserFormState): boolean => {
  const { nombre, apellido, telefono, rut, correo, contrasena, confirmarContrasena, acceptedTerms } = state;
  
  return (
    nombre.trim() !== '' &&
    apellido.trim() !== '' &&
    telefono.trim() !== '' &&
    rut.trim() !== '' &&
    correo.trim() !== '' &&
    contrasena.trim() !== '' &&
    confirmarContrasena.trim() !== '' &&
    acceptedTerms
  );
};

export const isSupplierFormValid = (state: SupplierFormState): boolean => {
  return isUserFormValid(state);
};