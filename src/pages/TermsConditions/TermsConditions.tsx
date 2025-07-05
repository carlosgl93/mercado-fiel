import { SubTitle, Text, Title } from '@/components/StyledComponents';
import { Box } from '@mui/material';

export const TermsConditions = () => {
  return (
    <Box
      sx={{
        m: 'auto',
        p: '1rem',
        textAlign: 'left',
        maxWidth: '800px',
      }}
    >
      <Title>Términos y Condiciones de Uso</Title>

      <Text>
        Bienvenido a Mercado Fiel, un marketplace digital que conecta compradores con proveedores de
        productos y servicios de confianza. Al acceder y utilizar nuestra plataforma, usted acepta
        estos términos y condiciones en su totalidad.
      </Text>

      <SubTitle>1. Naturaleza del Servicio</SubTitle>
      <Text>
        Mercado Fiel actúa únicamente como intermediario tecnológico entre compradores ("Clientes")
        y vendedores ("Proveedores"). No somos propietarios, vendedores ni fabricantes de los
        productos o servicios ofrecidos en la plataforma. Todas las transacciones se realizan
        directamente entre Clientes y Proveedores.
      </Text>

      <SubTitle>2. Registro y Cuentas de Usuario</SubTitle>
      <Text>
        Para utilizar nuestros servicios, debe crear una cuenta proporcionando información veraz y
        actualizada. Es responsable de mantener la confidencialidad de sus credenciales de acceso y
        de todas las actividades realizadas bajo su cuenta.
      </Text>

      <SubTitle>3. Responsabilidades de los Proveedores</SubTitle>
      <Text>
        Los Proveedores se comprometen a: • Ofrecer productos y servicios legales y de calidad •
        Proporcionar descripciones precisas y completas • Cumplir con todas las regulaciones
        aplicables • Gestionar directamente las garantías y devoluciones • Responder por la calidad
        y seguridad de sus ofertas
      </Text>

      <SubTitle>4. Responsabilidades de los Clientes</SubTitle>
      <Text>
        Los Clientes se comprometen a: • Verificar las características de productos/servicios antes
        de comprar • Evaluar la reputación y calificaciones de los Proveedores • Utilizar los
        productos conforme a las instrucciones • Comunicarse directamente con el Proveedor para
        resolver dudas • Cumplir con los términos de pago acordados
      </Text>

      <SubTitle>5. Limitación de Responsabilidad</SubTitle>
      <Text>
        Mercado Fiel NO se hace responsable de: • La calidad, seguridad o idoneidad de
        productos/servicios • Disputas entre Clientes y Proveedores • Pérdidas económicas derivadas
        de las transacciones • Daños causados por productos defectuosos • Incumplimiento de
        contratos entre usuarios Nuestra responsabilidad se limita exclusivamente a facilitar el
        contacto entre las partes.
      </Text>

      <SubTitle>6. Sistema de Pagos</SubTitle>
      <Text>
        Mercado Fiel puede facilitar el procesamiento de pagos a través de proveedores terceros. Los
        aspectos de facturación y obligaciones tributarias son responsabilidad exclusiva de los
        Proveedores. Podemos cobrar comisiones por el uso de la plataforma, las cuales serán
        claramente informadas.
      </Text>

      <SubTitle>7. Conducta Prohibida</SubTitle>
      <Text>
        Está prohibido: • Ofrecer productos ilegales o peligrosos • Realizar actividades
        fraudulentas • Publicar contenido falso o difamatorio • Interferir con el funcionamiento de
        la plataforma • Violar derechos de propiedad intelectual
      </Text>

      <SubTitle>8. Indemnización</SubTitle>
      <Text>
        Los usuarios se comprometen a indemnizar a Mercado Fiel ante cualquier reclamo, demanda o
        pérdida derivada de: su uso de la plataforma, las transacciones realizadas, el
        incumplimiento de estos términos, o la violación de derechos de terceros.
      </Text>

      <SubTitle>9. Propiedad Intelectual</SubTitle>
      <Text>
        Todos los derechos de propiedad intelectual de la plataforma pertenecen a Mercado Fiel. Los
        usuarios reciben una licencia limitada y revocable para usar la plataforma únicamente para
        los fines autorizados.
      </Text>

      <SubTitle>10. Privacidad y Datos Personales</SubTitle>
      <Text>
        El tratamiento de datos personales se rige por nuestra Política de Privacidad y la Ley N°
        19.628 sobre Protección de la Vida Privada de Chile. Implementamos medidas de seguridad
        razonables para proteger su información.
      </Text>

      <SubTitle>11. Modificaciones</SubTitle>
      <Text>
        Nos reservamos el derecho de modificar estos términos en cualquier momento. Las
        modificaciones serán notificadas y el uso continuado de la plataforma constituirá su
        aceptación.
      </Text>

      <SubTitle>12. Terminación</SubTitle>
      <Text>
        Podemos suspender o terminar cuentas que violen estos términos. Los usuarios pueden cerrar
        sus cuentas en cualquier momento. La terminación no afecta obligaciones previamente
        adquiridas.
      </Text>

      <SubTitle>13. Ley Aplicable y Jurisdicción</SubTitle>
      <Text>
        Estos términos se rigen por las leyes de Chile. Las disputas entre usuarios deben resolverse
        directamente entre las partes. Las controversias con Mercado Fiel se someterán a los
        tribunales de Santiago, Chile.
      </Text>

      <SubTitle>14. Contacto</SubTitle>
      <Text>
        Para consultas sobre estos términos, contáctenos en: Email: contacto@mercadofiel.cl Sitio
        Web: www.mercadofiel.cl Fecha de última actualización:{' '}
        {new Date().toLocaleDateString('es-CL')}
      </Text>
    </Box>
  );
};
