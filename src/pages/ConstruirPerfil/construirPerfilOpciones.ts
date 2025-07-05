type SettingsKey =
  | 'servicios'
  | 'detallesBasicos'
  | 'disponibilidad'
  | 'comunas'
  | 'experiencia'
  | 'cuentaBancaria'
  | 'historialLaboral'
  | 'educacionFormacion'
  | 'registroSuperIntendenciaSalud'
  | 'insignias'
  | 'inmunizacion'
  | 'idiomas'
  | 'antecedentesCulturales'
  | 'religion'
  | 'interesesHobbies'
  | 'sobreMi'
  | 'misPreferencias';

export const construirPerfilOpciones: { key: SettingsKey; value: string; implemented: boolean }[] =
  [
    { key: 'sobreMi', value: 'Sobre mí', implemented: true },
    { key: 'detallesBasicos', value: 'Detalles básicos', implemented: true },
    { key: 'servicios', value: 'Servicios ofrecidos', implemented: true },
    { key: 'disponibilidad', value: 'Disponibilidad', implemented: true },
    { key: 'comunas', value: 'Comunas', implemented: true },
    { key: 'cuentaBancaria', value: 'Cuenta bancaria', implemented: true },
    { key: 'historialLaboral', value: 'Historial laboral', implemented: false },
    { key: 'educacionFormacion', value: 'Educación y formación', implemented: false },
    {
      key: 'registroSuperIntendenciaSalud',
      value: 'Registro super intendencia de salud',
      implemented: false,
    },
    { key: 'experiencia', value: 'Experiencia', implemented: false },
    { key: 'insignias', value: 'Insignias', implemented: false },
    { key: 'inmunizacion', value: 'Inmunización', implemented: false },
    { key: 'idiomas', value: 'Idiomas', implemented: false },
    { key: 'antecedentesCulturales', value: 'Antecedentes culturales', implemented: false },
    { key: 'religion', value: 'Religión', implemented: false },
    { key: 'interesesHobbies', value: 'Intereses y hobbies', implemented: false },
    { key: 'misPreferencias', value: 'Mis preferencias', implemented: false },
  ];
