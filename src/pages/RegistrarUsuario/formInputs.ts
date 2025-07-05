export const selfPatient = [
  {
    inputName: 'nombre',
    placeholder: 'Ingresa tu nombre',
    label: 'Nombre (*)',
    type: 'text',
  },
  {
    inputName: 'apellido',
    placeholder: 'Ingresa tu apellido',
    label: 'Apellido (*)',
    type: 'text',
  },
  {
    inputName: 'rut',
    placeholder: 'Ej: 18445810-X',
    label: 'Rut (*): ',
    type: 'text',
  },
  {
    inputName: 'correo',
    placeholder: 'Ingresa tu email',
    label: 'Correo electrónico (*)',
    type: 'email',
  },
  {
    inputName: 'contrasena',
    placeholder: 'Ingrese una contraseña',
    label: 'Crea una contraseña (*)',
    type: 'password',
  },
  {
    inputName: 'confirmarContrasena',
    placeholder: 'Confirme su contraseña',
    label: 'Confirma tu contraseña (*)',
    type: 'password',
  },
];

export const withPatientInputs = [
  ...selfPatient,
  {
    inputName: 'patientName',
    placeholder: 'Nombre del paciente',
    label: 'Nombre del paciente (*)',
    type: 'text',
  },
  {
    inputName: 'patientAge',
    placeholder: 'Edad del paciente',
    label: 'Edad del paciente (*)',
    type: 'number',
  },
  {
    inputName: 'patientRut',
    placeholder: 'Ej: 18445810-X',
    label: 'Rut Paciente (*): ',
    type: 'text',
  },
];
