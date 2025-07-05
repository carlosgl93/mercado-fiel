import { styled } from '@mui/material/styles';

import Meta from '@/components/Meta';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Avatar, Box, Container, Link, Typography, useTheme } from '@mui/material';

const lideres = [
  {
    profileImg: '/images/_francisco.jpg',
    name: 'Francisco Durney',
    linkedinUrl: 'https://www.linkedin.com/in/franciscodurney/',
  },
  {
    profileImg: '/images/_cano.png',
    name: 'Carlos Gumucio',
    linkedinUrl: 'https://www.linkedin.com/in/carlos-gumucio-labb%C3%A9-30b01b70/',
  },
  {
    profileImg: '/images/_nicolas.jpeg',
    name: 'Nicolás Boetto',
    linkedinUrl: 'https://www.linkedin.com/in/nicol%C3%A1s-boetto-415b0a161/',
  },
];

const Section = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(4),
  backgroundColor: '#f9f7f6',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const TextContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '3rem',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: theme.spacing(4),
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  [theme.breakpoints.down('sm')]: {
    height: 'auto',
  },
}));

const Image = styled('img')({
  height: '100%',
  width: 'auto',
  objectFit: 'cover',
});

const Text = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  fontSize: '1rem',
  fontWeight: 400,
  textAlign: 'justify',
  textRendering: 'optimizeLegibility',
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  paddingBottom: '3rem',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const PersonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

const PersonName = styled(Typography)(() => ({
  fontWeight: 'bold',
}));

const LinkedInLogo = styled(LinkedInIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

function Nosotros() {
  const theme = useTheme();

  return (
    <>
      <Meta title="Nosotros" />
      <Section
        sx={{
          px: {
            sm: 4,
            md: 8,
            lg: 12,
          },
          py: {
            sm: 4,
            md: 8,
            lg: 20,
          },
        }}
      >
        <TextContainer>
          <Typography
            variant="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: '2.5rem',
                sm: '3.5rem',
              },
            }}
            color="primary.dark"
          >
            Nuestra historia
          </Typography>
          <Box>
            <Text gutterBottom>
              Nuestra historia comienza el año 2020 en las lejanas tierras de Australia, lugar donde
              nuestro socio fundador Francisco Durney se encontraba realizando sus estudios de
              postgrado. Allí, pudo observar la gran calidad de vida que llevan adultos mayores y
              personas con discapacidad, al tener la posibilidad de acceder con facilidad a
              distintos servicios de salud y de cuidado a domicilio.
            </Text>
            <Text gutterBottom>
              A partir de esto, y teniendo en mente la difícil experiencia que vivió en Chile junto
              a sus hermanos para conformar un equipo de cuidado de confianza y de calidad para su
              madre durante sus últimos años, Francisco se motivó con desarrollar una solución
              innovadora para resolver este gran problema que aqueja a miles de chilenos y personas
              en el mundo, de manera de poder ofrecerles a nuestros adultos mayores y personas con
              discapacidad una mejor calidad de vida.
            </Text>
            <Text gutterBottom>
              Es así como Francisco contacta a Nicolás Boetto y Carlos Gumucio para poder darle
              forma a este innovador y desafiante proyecto que es lo que se conoce hoy en día como
              Mercado Fiel.
            </Text>
          </Box>
        </TextContainer>
        <ImageContainer
          sx={{
            ml: '1rem',
          }}
        >
          <Image
            src="/images/nuestra-historia.png"
            alt="2 personas mirando el horizonte en un atardecer en el sur de Chile"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: {
                xs: 'contain',
                sm: 'cover',
              },
              borderRadius: '2.5%',
            }}
          />
        </ImageContainer>
      </Section>

      <Box
        sx={{
          px: {
            sm: 4,
            md: 8,
            lg: 12,
          },
          py: {
            sm: 4,
            md: 8,
            lg: 12,
          },
        }}
      >
        <TextContainer>
          <Typography
            variant="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: '2.5rem',
                sm: '3.5rem',
              },
            }}
            color="primary.dark"
          >
            Nuestros líderes
          </Typography>
        </TextContainer>
        <AvatarContainer>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: theme.spacing(8),
              justifyContent: 'center',
            }}
          >
            {lideres.map((lider) => (
              <Link
                key={lider.name}
                href={lider.linkedinUrl}
                underline="none"
                target="_blank"
                rel="noopener"
              >
                <PersonContainer>
                  <Avatar
                    sx={{ width: 140, height: 140 }}
                    src={lider.profileImg}
                    alt={lider.name}
                  />
                  <PersonName variant="h6">{lider.name}</PersonName>
                  <LinkedInLogo />
                </PersonContainer>
              </Link>
            ))}
          </Box>
        </AvatarContainer>
        <Box
          sx={{
            px: {
              xs: 2,
              sm: 4,
              md: 8,
              lg: 12,
            },
            py: {
              xs: 2,
              sm: 4,
              md: 8,
              lg: 12,
            },
          }}
        >
          <TextContainer
            sx={{
              padding: theme.spacing(1),
            }}
          >
            <Typography
              variant="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: '2.5rem',
                  sm: '3.5rem',
                },
              }}
              color="primary.dark"
            >
              Por qué estamos aquí
            </Typography>
          </TextContainer>

          {/* flex container that on md and up it displays and image in the left and in the right there is a text container. in sm and lower it changes to flex direction column and displays the text container first and then the image*/}
          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: 'row',
              },
              gap: {
                xs: 0,
                md: theme.spacing(4),
              },
              alignItems: 'center',
              justifyContent: 'space-between',
              py: theme.spacing(4),
            }}
          >
            <Box
              sx={{
                width: {
                  xs: '100%',
                  md: '50%',
                },
              }}
            >
              <Image
                src="/images/porque-estamos-aqui.png"
                alt="2 personas mirando el horizonte en un atardecer en el sur de Chile"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Box
              sx={{
                width: {
                  xs: '100%',
                  md: '50%',
                },
              }}
            >
              <Text gutterBottom>
                Mercado Fiel se creó con el objetivo de romper los paradigmas actuales en el apoyo a
                adultos mayores y personas en situación de discapacidad con algún grado de
                dependencia, poniendo a disposición de la comunidad una plataforma en línea que
                permita conectar de forma fácil y segura a personas que buscan apoyo con aquellas
                que puedan proporcionarlo.
              </Text>
              <Text gutterBottom>
                El problema que existe actualmente es la dificultad de encontrar a personas que
                ofrezcan servicios de cuidado y/o servicios profesionales y técnicos de salud a
                domicilio según las necesidades del paciente. Además, las alternativas que pueden
                encontrarse en Chile son muy caras, siendo inasequibles para muchas personas que lo
                requieren.
              </Text>
              <Text gutterBottom>
                En ese sentido, Mercado Fiel nace como una solución a estos problemas, permitiendo
                que la comunidad pueda tener acceso a una gran red de personas que ofrezcan
                servicios de asistencia y cuidado a adultos mayores y personas en situación de
                discapacidad con algún grado de dependencia, dando la posibilidad de encontrar el
                perfil de ayuda que mejor se adapta a las propias necesidades, requerimientos y
                presupuesto de los pacientes.
              </Text>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9f7f6',
            px: {
              xs: 2,
              sm: 4,
              md: 8,
              lg: 12,
            },
            py: {
              xs: 2,
              sm: 4,
              md: 8,
              lg: 12,
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              textAlign: 'center',
            }}
          >
            <TextContainer
              sx={{
                textAlign: 'start',
                gap: theme.spacing(4),
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: {
                    xs: '2.5rem',
                    sm: '3.5rem',
                  },
                }}
                color="primary.dark"
              >
                Nuestra misión
              </Typography>
              <Text gutterBottom>
                Somos una plataforma en línea que busca generar un medio para que la comunidad pueda
                conectarse entre sí, permitiéndoles acceder a una mejor calidad de vida, más
                inclusiva y con mayores oportunidades, todo ello con un enfoque directo a la
                realidad de nuestros adultos mayores y personas en situación de discapacidad con
                algún grado de dependencia que requieran apoyo viviendo en sus casas.
              </Text>
            </TextContainer>
          </Box>
          <Box
            sx={{
              width: '100%',
              textAlign: 'center',
            }}
          >
            <TextContainer
              sx={{
                textAlign: 'start',
                gap: theme.spacing(4),
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: {
                    xs: '2.5rem',
                    sm: '3.5rem',
                  },
                }}
                color="primary.dark"
              >
                Nuestra visión
              </Typography>
              <Typography variant="body1" gutterBottom>
                Crear una gran comunidad de apoyo para adultos mayores y personas en situación de
                discapacidad con algún grado de dependencia, permitiendo de esta manera dar las
                herramientas para desarrollar una sociedad más inclusiva y con mayores oportunidades
                para estas personas.
              </Typography>
            </TextContainer>
          </Box>

          <TextContainer
            sx={{
              textAlign: 'start',
              gap: theme.spacing(4),
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 700,
                fontSize: {
                  xs: '2.5rem',
                  sm: '3.5rem',
                },
              }}
              color="primary.dark"
            >
              Nuestros valores
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'center',
                alignItems: 'center',
                color: theme.palette.primary.main,
                gap: 2,
              }}
            >
              <PeopleAltOutlinedIcon
                sx={{
                  fontSize: '4rem',
                }}
              />
              <Text variant="subtitle1">Colaboración</Text>

              <VisibilityOutlinedIcon
                sx={{
                  fontSize: '4rem',
                }}
              />
              <Text variant="subtitle1">Transparencia</Text>

              <ShieldOutlinedIcon
                sx={{
                  fontSize: '4rem',
                }}
              />
              <Text variant="subtitle1">Seguridad</Text>

              <FavoriteBorderOutlinedIcon
                sx={{
                  fontSize: '4rem',
                }}
              />
              <Text variant="subtitle1">Confianza</Text>
            </Box>
          </TextContainer>
        </Box>
      </Box>
    </>
  );
}

export default Nosotros;
