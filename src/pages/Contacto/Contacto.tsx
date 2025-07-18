import { sendSupportMessage } from '@/api/help';
import Meta from '@/components/Meta';
import { customerSupportPhone } from '@/config';
import { Facebook, Instagram, LinkedIn, LocationOn, Twitter, WhatsApp } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Snackbar,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const ContactSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: '#f9f7f6',
}));

const ContactCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const ClickableContactCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: `2px solid transparent`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[12],
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + '10',
  },
}));

const SocialIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.1)',
  },
}));

interface FormData {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

function Contacto() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendSupportMessage({
        nombre: formData.nombre,
        email: formData.email,
        mensaje: `Asunto: ${formData.asunto}\n\n${formData.mensaje}`,
      });

      setShowSuccess(true);
      setFormData({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: '',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // You could add error state handling here
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hola, me comunico desde Mercado Fiel. Me gustaría obtener información sobre la plataforma. ¡Gracias!`,
    );
    const whatsappUrl = `https://wa.me/${customerSupportPhone.replace(
      /[^0-9]/g,
      '',
    )}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const contactInfo = [
    {
      icon: <WhatsApp sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'WhatsApp',
      info: customerSupportPhone,
      description: 'Chatea con nosotros ahora',
      isClickable: true,
      onClick: handleWhatsAppClick,
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Oficina',
      info: 'Santiago, Chile',
      description: 'Región Metropolitana',
      isClickable: false,
    },
  ];

  const socialLinks = [
    { icon: <Facebook />, url: 'https://facebook.com/mercadofiel', name: 'Facebook' },
    { icon: <Twitter />, url: 'https://twitter.com/mercadofiel', name: 'Twitter' },
    { icon: <Instagram />, url: 'https://instagram.com/mercadofiel', name: 'Instagram' },
    { icon: <LinkedIn />, url: 'https://linkedin.com/company/mercadofiel', name: 'LinkedIn' },
  ];

  return (
    <>
      <Meta title="Contacto - Mercado Fiel" />

      <ContactSection>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            textAlign="center"
            gutterBottom
            fontWeight="bold"
            color="primary.dark"
          >
            Contáctanos
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Estamos aquí para ayudarte. Ponte en contacto con nosotros de la forma que prefieras.
          </Typography>

          {/* Contact Information Cards */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {contactInfo.map((contact, index) => (
              <Grid item xs={12} md={6} key={index}>
                {contact.isClickable ? (
                  <ClickableContactCard onClick={contact.onClick}>
                    <Box sx={{ mb: 2 }}>{contact.icon}</Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {contact.title}
                    </Typography>
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      {contact.info}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contact.description}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<WhatsApp />}
                      sx={{ mt: 2 }}
                      size="small"
                    >
                      Abrir WhatsApp
                    </Button>
                  </ClickableContactCard>
                ) : (
                  <ContactCard>
                    <Box sx={{ mb: 2 }}>{contact.icon}</Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {contact.title}
                    </Typography>
                    <Typography variant="h6" color="primary.main" gutterBottom>
                      {contact.info}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {contact.description}
                    </Typography>
                  </ContactCard>
                )}
              </Grid>
            ))}
          </Grid>

          {/* Contact Form */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" color="primary.dark">
                  Envíanos un mensaje
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Completa el formulario y nos pondremos en contacto contigo pronto. Para respuestas
                  más rápidas, ¡usa nuestro WhatsApp!
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nombre completo"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Asunto"
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Mensaje"
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleInputChange}
                        required
                        multiline
                        rows={6}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{ px: 4, py: 1.5 }}
                      >
                        {loading ? 'Enviando...' : 'Enviar Mensaje'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, height: 'fit-content' }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" color="primary.dark">
                  Síguenos
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Mantente conectado con nosotros en redes sociales
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {socialLinks.map((social, index) => (
                    <SocialIcon
                      key={index}
                      component="a"
                      onClick={() => window.open(social.url, '_blank', 'noopener,noreferrer')}
                      title={social.name}
                    >
                      {social.icon}
                    </SocialIcon>
                  ))}
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.dark">
                    Horarios de Atención
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>WhatsApp:</strong> Lunes a Viernes 9:00 - 18:00
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Sábados:</strong> 9:00 - 14:00
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Domingos:</strong> Cerrado
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, fontStyle: 'italic' }}
                  >
                    Respuesta automática disponible 24/7
                  </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.dark">
                    Soporte Técnico
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Para problemas técnicos urgentes, contáctanos a través de WhatsApp o nuestro
                    formulario de contacto. Respuesta garantizada en horario de atención.
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </ContactSection>

      <Snackbar open={showSuccess} autoHideDuration={6000} onClose={() => setShowSuccess(false)}>
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          ¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.
        </Alert>
      </Snackbar>
    </>
  );
}

export default Contacto;
