import { Link } from 'react-router-dom';

import ComoFunciona from '@/components/ComoFunciona';
import { Image, StyledImageContainer } from '@/components/ImageContainer';
import Meta from '@/components/Meta';
import {
  AvatarContainer,
  PersonContainer,
  Section,
  StyledButton,
  Text,
  TextContainer,
  Title,
} from '@/components/StyledComponents';
import { Avatar, Box, Button } from '@mui/material';
import { comoFuncionaCardsContent } from '../Welcome/comoFuncionaContent';

const serviciosPrestados = [
  {
    img: '/images/servicios/tecnologia.jpg',
    title: 'Tecnología',
    description: 'En Mercado Fiel podrás ofrecer productos tecnológicos y servicios de reparación.',
  },
  {
    img: '/images/servicios/hogar-jardin.jpg',
    title: 'Hogar y Jardín',
    description: 'En Mercado Fiel podrás vender productos para el hogar y servicios de jardinería.',
  },
  {
    img: '/images/servicios/alimentacion.jpg',
    title: 'Alimentación',
    description: 'En Mercado Fiel podrás ofrecer alimentos frescos y productos gourmet.',
  },
  {
    img: '/images/servicios/artesania.jpg',
    title: 'Artesanía',
    description: 'En Mercado Fiel podrás vender productos artesanales y hechos a mano.',
  },
  {
    img: '/images/servicios/ropa-accesorios.jpg',
    title: 'Ropa y Accesorios',
    description: 'En Mercado Fiel podrás ofrecer ropa y accesorios únicos.',
  },
  {
    img: '/images/servicios/servicios-profesionales.jpg',
    title: 'Servicios Profesionales',
    description: 'En Mercado Fiel podrás ofrecer servicios profesionales especializados.',
  },
  {
    img: '/images/servicios/belleza-bienestar.jpg',
    title: 'Belleza y Bienestar',
    description: 'En Mercado Fiel podrás vender productos de belleza y bienestar.',
  },
  {
    img: '/images/servicios/educacion.jpg',
    title: 'Educación',
    description: 'En Mercado Fiel podrás ofrecer cursos y servicios educativos.',
  },
  {
    img: '/images/servicios/deporte-fitness.jpg',
    title: 'Deporte y Fitness',
    description: 'En Mercado Fiel podrás vender equipos deportivos y servicios de entrenamiento.',
  },
  {
    img: '/images/servicios/entretenimiento.jpg',
    title: 'Entretenimiento',
    description: 'En Mercado Fiel podrás ofrecer servicios de entretenimiento y eventos.',
  },
];

function PersonaApoyo() {
  return (
    <>
      <Meta title="Conviértete en proveedor" />
      <Section
        component="section"
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr',
            md: '1fr 1fr',
            lg: '1fr 1fr',
          },
          gap: '2rem',
          px: {
            xs: 1,
            sm: 4,
            md: 12,
            lg: 16,
          },
          py: {
            sm: 4,
            md: 8,
            lg: 20,
          },
        }}
      >
        <TextContainer
          sx={{
            justifyContent: 'start',
            height: '100%',
          }}
        >
          <Title>Comparte lo mejor de tu negocio</Title>
          <Text
            sx={{
              fontSize: '1.5rem',
            }}
          >
            Únete a nuestra comunidad Mercado Fiel y ofrece tus productos y servicios a una amplia
            personas con discapacidad que lo necesiten.
          </Text>
          <Button
            component={Link}
            to="/entrega-apoyo"
            variant="outlined"
            sx={{
              maxWidth: '30%',
              borderRadius: '5px',
            }}
          >
            Comenzar
          </Button>
        </TextContainer>
        <StyledImageContainer>
          <Image
            src="/images/una-comunidad-de-apoyo.png"
            alt="Enfermera ayudando a una persona a pararse de su silla de ruedas"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: {
                xs: 'contain',
                sm: 'cover',
              },
            }}
          />
        </StyledImageContainer>
      </Section>
      <Section
        sx={{
          backgroundColor: 'white',
          px: {
            xs: 1,
            sm: 4,
            md: 8,
            lg: 12,
          },
          py: {
            sm: 4,
            md: 8,
            lg: 20,
          },
          flexDirection: 'column',
        }}
      >
        <TextContainer
          sx={{
            textAlign: 'center',
            px: {
              xs: 1,
              sm: 4,
              md: 8,
              lg: 12,
            },
            py: {
              sm: 4,
              md: 8,
            },
          }}
        >
          <Title
            variant="h2"
            sx={{
              fontsize: {
                xs: '1.5rem',
                sm: '2.5rem',
                md: '3rem',
                lg: '4rem',
              },
            }}
            gutterBottom
          >
            Los productos y servicios que puedes ofrecer en Mercado Fiel
          </Title>
        </TextContainer>
        <AvatarContainer>
          {serviciosPrestados.map((servicio) => (
            <PersonContainer key={servicio.title}>
              <Avatar
                sx={{ width: 120, height: 120, borderRadius: '50%' }}
                src={servicio.img}
                alt={servicio.title}
                slotProps={{
                  img: {
                    loading: 'lazy',
                  },
                }}
              />
              <Title
                variant="h6"
                sx={{
                  fontSize: '1.5rem',
                  color: 'primary.main',
                }}
              >
                {servicio.title}
              </Title>
            </PersonContainer>
          ))}
        </AvatarContainer>
        <Link to="/entrega-apoyo">
          <StyledButton
            sx={{
              py: 1,
              px: 4,
              fontSize: '1.25rem',
            }}
          >
            Conviértete en persona de apoyo
          </StyledButton>
        </Link>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            my: {
              xs: 4,
              sm: 8,
            },
          }}
        >
          <Title gutterBottom>¿Por qué elegir Mercado Fiel?</Title>

          <Box
            sx={{
              display: {
                xs: 'flex',
                md: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gridTemplateRow: 'repeat(2, 1fr)',
                gap: '2rem',
              },
              flexDirection: {
                xs: 'column',
                md: 'row',
              },
              px: {
                xs: 1,
                sm: 2,
                md: 4,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Title
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: '1.75rem',
                }}
              >
                Sé tu propio jefe
              </Title>
              <Text
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: '1.5rem',
                }}
              >
                Como proveedor de Mercado Fiel tú diriges tu propio negocio. Elige a tus clientes,
                los servicios que quieres proporcionar y las horas que trabajas ¡Administra tu
                propio tiempo!
              </Text>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Title
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: '1.75rem',
                }}
              >
                Red de clientes y prestadores
              </Title>
              <Text
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: '1.5rem',
                }}
              >
                Podrás ser parte de la comunidad de apoyo a domicilio más grande del país, con una
                gran cantidad de clientes que requerirán de tus servicios. También podrás encontrar
                en nuestra comunidad a prestadores de servicios complementarios a los tuyos con los
                que podrás crear equipos de trabajo.
              </Text>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Title
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: '1.75rem',
                }}
              >
                Establece tus propias tarifas
              </Title>
              <Text
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: '1.5rem',
                }}
              >
                Dado que manejas tu propio negocio, eres libre de poder acordar con el cliente el
                valor del servicio que vayas a prestar.
              </Text>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Title
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: '1.75rem',
                }}
              >
                Cobertura de seguro
              </Title>
              <Text
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: '1.5rem',
                }}
              >
                Los proveedores de Mercado Fiel podrán quedar cubiertos por seguros de
                responsabilidad profesional y contra accidentes.
              </Text>
            </Box>
          </Box>
        </Box>
      </Section>
      <ComoFunciona
        subtitle="Mercado Fiel es una plataforma online diseñada para que su uso sea fácil y amigable. Con un simple proceso de 3 pasos podrás estar dentro de nuestra comunidad y listo para comenzar a vender tus productos y servicios."
        steps={comoFuncionaCardsContent}
      />
    </>
  );
}

export default PersonaApoyo;
