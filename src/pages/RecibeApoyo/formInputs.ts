export const formInputs = [
  {
    inputName: 'nombre',
    placeholder: 'Ingresa tu nombre',
    label: 'Nombre (*)',
    type: 'text',
  },
  {
    inputName: 'apellidos',
    placeholder: 'Ingresa tus apellidos',
    label: 'Apellidos (*)',
    type: 'text',
  },
  {
    inputName: 'telefono',
    placeholder: 'Ingresa tu teléfono móvil',
    label: 'Teléfono móvil (*)',
    type: 'tel',
  },
  {
    inputName: 'correo',
    placeholder: 'Ingresa tu correo electrónico',
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
  {
    inputName: 'comoEnteraste',
    placeholder: 'Selecciona cómo te enteraste de Mercado Fiel',
    label: 'Cómo te enteraste de Mercado Fiel (*)',
    type: 'text',
    options: [
      'Google',
      'Redes sociales',
      'Radio/TV',
      'Noticias',
      'Personal del centro de salud',
      'Me contó alguien cercano',
      'Otra',
    ],
  },
];
