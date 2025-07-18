import Meta from '@/components/Meta';
import {
  AccountCircle,
  ExpandMore,
  Help,
  LocalShipping,
  Payment,
  Security,
  Store,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

const FAQSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: '#f9f7f6',
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '&:before': {
    display: 'none',
  },
  boxShadow: theme.shadows[2],
}));

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

function PreguntasFrecuentes() {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const categories = [
    { id: 'todos', name: 'Todas', icon: <Help />, color: '#E3F2FD' },
    { id: 'cuenta', name: 'Cuenta', icon: <AccountCircle />, color: '#F3E5F5' },
    { id: 'compras', name: 'Compras', icon: <LocalShipping />, color: '#E8F5E8' },
    { id: 'ventas', name: 'Ventas', icon: <Store />, color: '#FFF3E0' },
    { id: 'pagos', name: 'Pagos', icon: <Payment />, color: '#FFEBEE' },
    { id: 'seguridad', name: 'Seguridad', icon: <Security />, color: '#E0F2F1' },
  ];

  const faqs: FAQ[] = [
    {
      category: 'cuenta',
      question: '¿Cómo me registro en Mercado Fiel?',
      answer:
        'Para registrarte, haz clic en "Registrarse" en la parte superior de la página. Puedes elegir entre registrarte como comprador o vendedor. Completa el formulario con tu información personal y verifica tu email para activar tu cuenta.',
    },
    {
      category: 'cuenta',
      question: '¿Puedo cambiar mi información de perfil?',
      answer:
        'Sí, puedes actualizar tu información de perfil en cualquier momento. Ve a tu panel de usuario, selecciona "Perfil" y edita los campos que desees modificar. Algunos cambios pueden requerir verificación adicional.',
    },
    {
      category: 'cuenta',
      question: '¿Cómo recupero mi contraseña?',
      answer:
        'Si olvidaste tu contraseña, haz clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión. Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.',
    },
    {
      category: 'compras',
      question: '¿Cómo realizo una compra?',
      answer:
        'Busca el producto que deseas, revisa la información del vendedor y del producto, y haz clic en "Contactar vendedor" o "Comprar ahora". Puedes coordinar los detalles de la compra directamente con el vendedor.',
    },
    {
      category: 'compras',
      question: '¿Puedo cancelar una compra?',
      answer:
        'Puedes cancelar una compra antes de que el vendedor confirme el pedido. Una vez confirmado, deberás contactar al vendedor para discutir la cancelación según sus políticas.',
    },
    {
      category: 'compras',
      question: '¿Qué hago si tengo problemas con mi compra?',
      answer:
        'Si tienes problemas con una compra, primero contacta al vendedor para resolver el inconveniente. Si no puedes llegar a una solución, puedes reportar el problema a nuestro equipo de soporte.',
    },
    {
      category: 'ventas',
      question: '¿Cómo empiezo a vender?',
      answer:
        'Para vender, regístrate como vendedor, completa tu perfil con información detallada sobre ti y tus productos/servicios. Una vez verificado, podrás publicar tus ofertas y conectar con compradores.',
    },
    {
      category: 'ventas',
      question: '¿Hay comisiones por vender?',
      answer:
        'Mercado Fiel cobra una pequeña comisión por cada transacción exitosa. Esta comisión nos permite mantener la plataforma segura y funcionando. Puedes consultar las tarifas actuales en nuestra sección de precios.',
    },
    {
      category: 'ventas',
      question: '¿Cómo recibo los pagos?',
      answer:
        'Los pagos se procesan de forma segura a través de nuestra plataforma. Una vez completada la transacción, el dinero se transferirá a tu cuenta bancaria registrada según los plazos establecidos.',
    },
    {
      category: 'pagos',
      question: '¿Qué métodos de pago aceptan?',
      answer:
        'Aceptamos tarjetas de débito y crédito, transferencias bancarias y otros métodos de pago populares en Chile. Todos los pagos son procesados de forma segura.',
    },
    {
      category: 'pagos',
      question: '¿Es seguro pagar en línea?',
      answer:
        'Sí, utilizamos tecnología de encriptación de última generación y cumplimos con los estándares de seguridad internacionales para proteger tu información financiera.',
    },
    {
      category: 'pagos',
      question: '¿Cuándo se cobra mi tarjeta?',
      answer:
        'Tu tarjeta se cobra cuando confirmas la compra. Si hay algún problema con el pedido, procesaremos el reembolso según corresponda.',
    },
    {
      category: 'seguridad',
      question: '¿Cómo verifican a los vendedores?',
      answer:
        'Todos los vendedores pasan por un proceso de verificación que incluye validación de identidad, información de contacto y, en algunos casos, verificación de antecedentes.',
    },
    {
      category: 'seguridad',
      question: '¿Qué hago si encuentro actividad sospechosa?',
      answer:
        'Si encuentras cualquier actividad sospechosa, repórtala inmediatamente a nuestro equipo de seguridad a través del botón "Reportar" o contactando a soporte.',
    },
    {
      category: 'seguridad',
      question: '¿Mercado Fiel protege mi información personal?',
      answer:
        'Sí, protegemos tu información personal de acuerdo con nuestras políticas de privacidad y las leyes aplicables. Nunca compartimos tu información con terceros sin tu consentimiento.',
    },
  ];

  const filteredFAQs =
    selectedCategory === 'todos' ? faqs : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <>
      <Meta title="Preguntas Frecuentes - Mercado Fiel" />

      <FAQSection>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            textAlign="center"
            gutterBottom
            fontWeight="bold"
            color="primary.dark"
          >
            Preguntas Frecuentes
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Encuentra respuestas a las preguntas más comunes sobre Mercado Fiel
          </Typography>

          {/* Category Filter */}
          <Grid container spacing={2} sx={{ mb: 6 }}>
            {categories.map((category) => (
              <Grid item xs={6} sm={4} md={2} key={category.id}>
                <CategoryCard
                  onClick={() => setSelectedCategory(category.id)}
                  sx={{
                    bgcolor: selectedCategory === category.id ? category.color : 'white',
                    border: selectedCategory === category.id ? 2 : 1,
                    borderColor: selectedCategory === category.id ? 'primary.main' : 'grey.300',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Box sx={{ color: 'primary.main', mb: 1 }}>{category.icon}</Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {category.name}
                    </Typography>
                  </CardContent>
                </CategoryCard>
              </Grid>
            ))}
          </Grid>

          {/* FAQ Accordions */}
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" color="primary.dark">
                {selectedCategory === 'todos'
                  ? 'Todas las preguntas'
                  : categories.find((cat) => cat.id === selectedCategory)?.name}
              </Typography>
              <Chip
                label={`${filteredFAQs.length} preguntas`}
                color="primary"
                size="small"
                sx={{ ml: 2 }}
              />
            </Box>

            {filteredFAQs.map((faq, index) => (
              <StyledAccordion key={index}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" fontWeight="bold">
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </StyledAccordion>
            ))}
          </Box>

          {/* Contact Support Section */}
          <Box
            sx={{
              textAlign: 'center',
              mt: 8,
              p: 4,
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: theme.shadows[2],
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight="bold" color="primary.dark">
              ¿No encontraste lo que buscabas?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Nuestro equipo de soporte está aquí para ayudarte con cualquier pregunta adicional.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Typography
                component="a"
                href="/contacto"
                sx={{
                  display: 'inline-block',
                  px: 3,
                  py: 1.5,
                  bgcolor: 'primary.main',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: 1,
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Contactar Soporte
              </Typography>
              <Typography
                component="a"
                href="mailto:contacto@mercadofiel.cl"
                sx={{
                  display: 'inline-block',
                  px: 3,
                  py: 1.5,
                  border: 1,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  textDecoration: 'none',
                  borderRadius: 1,
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                  },
                }}
              >
                Enviar Email
              </Typography>
            </Box>
          </Box>
        </Container>
      </FAQSection>
    </>
  );
}

export default PreguntasFrecuentes;
