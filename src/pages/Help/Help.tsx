import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import { Text, Title } from '@/components/StyledComponents';
import { HelpController } from './HelpController';

const Container = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '800px',
  margin: '0 auto',
}));

const Section = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const Form = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

function Help() {
  const {
    name,
    email,
    message,
    handleNameChange,
    handleEmailChange,
    handleMessageChange,
    sendSupportMessageMutation,
    sendSupportMessageIsLoading,
  } = HelpController();
  return (
    <>
      <Meta title="Ayuda / Soporte Mercado Fiel" />
      <FullSizeCenteredFlexBox>
        <Container>
          <Section>
            <Title variant="h3" gutterBottom>
              Ayuda y Soporte
            </Title>
            <Text variant="body1">
              Bienvenido a la sección de ayuda y soporte de Mercado Fiel. Aquí podrás ponerte en
              contacto con nuestro equipo de soporte.
            </Text>
          </Section>

          <Section>
            <Title variant="h4" gutterBottom>
              Contacto
            </Title>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                sendSupportMessageMutation({ nombre: name, email, mensaje: message });
              }}
            >
              <TextField
                label="Nombre"
                variant="outlined"
                fullWidth
                value={name}
                onChange={handleNameChange}
              />
              <TextField
                label="Correo Electrónico"
                variant="outlined"
                fullWidth
                value={email}
                onChange={handleEmailChange}
              />
              <TextField
                label="Mensaje"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={message}
                onChange={handleMessageChange}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={sendSupportMessageIsLoading}
              >
                Enviar
              </Button>
            </Form>
          </Section>
        </Container>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default Help;
