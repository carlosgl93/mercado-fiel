import { Text, Title } from '@/components/StyledComponents';
import { email as customerSupportEmail, customerSupportPhone } from '@/config';
import { getOS } from '@/utils';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import { Box, styled, Theme } from '@mui/material';
import { ButtonCTA } from '../UsuarioDashboard/StyledComponents';

type FailedPaymentProps = {
  appointments: { appointmentid: string }[];
  theme: Theme;
};

const StyledTitle = styled(Title)(({ theme }) => ({
  fontSize: '2rem',
  color: theme.palette.primary.main,
  marginBottom: '1rem',
}));

const ButtonContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginTop: '2rem',
}));

export const FailedPayment = ({ appointments, theme }: FailedPaymentProps) => {
  const appointment = appointments[0];
  const getSupportHref = () => {
    const userAgent = getOS();

    if (userAgent === 'iOS' || userAgent === 'Android') {
      return `tel:${customerSupportPhone}`;
    } else {
      return `mailto:${customerSupportEmail}`;
    }
  };

  const href = getSupportHref();
  return (
    <>
      <ReportGmailerrorredOutlinedIcon
        sx={{
          fontSize: '3rem',
          color: theme.palette.error.main,
          marginBottom: '1rem',
        }}
      />
      <StyledTitle>Pago fallido</StyledTitle>
      <Text>Lamentablemente algo salió mal con el pago, por favor intentalo nuevamente.</Text>
      <Text>
        <b>Carlos, tranquilo/a no se descontó ningún monto de tu cuenta.</b>
      </Text>
      <Text>Aún puedes realizar el pago para asegurar tu sesión con el proveedor.</Text>
      <Text>{/* Servicio: <b>{appointment.servicio.name}</b> */}</Text>
      <Text>
        Proveedor: <b>Esteban Paredes</b>
      </Text>
      <Text>Fechas:</Text>
      <Text
        sx={{
          textJustify: 'left',
        }}
      ></Text>
      <Text>
        Por favor, revisa tu correo electrónico para más detalles e instrucciones adicionales.
      </Text>
      <ButtonContainer>
        <ButtonCTA variant="contained" color="primary">
          <a
            href={href}
            rel="noreferrer"
            target="_blank"
            style={{
              textDecoration: 'none',
              color: 'white',
            }}
          >
            Contactar soporte
          </a>
        </ButtonCTA>
      </ButtonContainer>
    </>
  );
};
