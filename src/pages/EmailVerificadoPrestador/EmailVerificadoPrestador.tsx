import { FullSizeCenteredFlexBox } from '@/components/styled';
import { EmailVerificadoPrestadorController } from './EmailVerificadoPrestadorController';

const EmailVerificadoPrestador = () => {
  EmailVerificadoPrestadorController();

  return (
    <FullSizeCenteredFlexBox
      sx={{
        flexDirection: 'column',
      }}
    >
      <h1>Email Verificado</h1>
      <div>
        <p>Correo electrónico verificado correctamente.</p>
      </div>
    </FullSizeCenteredFlexBox>
  );
};

export default EmailVerificadoPrestador;
