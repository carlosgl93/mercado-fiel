import { styled } from '@mui/material/styles';

import Meta from '@/components/Meta';
import { Store, TrendingUp } from '@mui/icons-material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Avatar, Box, Container, Link, Typography, useMediaQuery, useTheme } from '@mui/material';

const whyWeareHereImages = {
  mobile: '/images/why-we-are-here-960p.jpg',
  tablet: '/images/why-we-are-here-960p.jpg',
  desktop: '/images/why-we-are-here-2880p.jpg',
};

const lideres = [
  {
    profileImg: '/images/_benjamin.svg',
    name: 'Benjamín Sepúlveda',
    linkedinUrl: 'https://www.linkedin.com/in/benjam%C3%ADn-sep%C3%BAlveda-zepeda',
    description: 'Gestión del Proyecto - Fundador',
  },
  {
    profileImg: '/images/_benjamin.svg',
    name: 'Vicente Arechavala',
    // linkedinUrl: 'https://www.linkedin.com/in/benjam%C3%ADn-sep%C3%BAlveda-zepeda',
    description: 'Marketing - Fundador',
  },
  {
    profileImg: '/images/_benjamin.svg',
    name: 'Joaquín Droguett',
    // linkedinUrl: 'https://www.linkedin.com/in/benjam%C3%ADn-sep%C3%BAlveda-zepeda',
    description: 'Socio Externo - Fundador',
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
  gap: '1.6rem',
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Select appropriate image based on screen size
  const getResponsiveImage = () => {
    if (isMobile) return whyWeareHereImages.mobile;
    if (isTablet) return whyWeareHereImages.tablet;
    return whyWeareHereImages.desktop;
  };

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
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: '2.5rem',
              },
            }}
            color="primary.dark"
          >
            Nuestra historia
          </Typography>
          <Box>
            <Text gutterBottom>
              Mercado fiel nace en un ambiente académico con la visión de trasformar la manera en la
              que proveedores locales se conectan con los consumidores en Chile.
            </Text>
            <Text gutterBottom>
              La idea surgió al observar las dificultades que enfrentan tanto los pequeños
              productores y comerciantes locales para poder llegar a mas clientes, como los
              consumidores para acceder a productos de calidad a un precio mas accesible. Por medio
              de esta plataforma, se identificó una oportunidad única para crear un marketplace que
              no solo facilitara estas conexiones, sino que también promoviera el comercio local y
              redujera el desperdicio a través de compras colaborativas.
            </Text>
            <Text gutterBottom>
              Al enfocarse en las necesidades del mercado de la región, Mercado Fiel ofrece una
              solución innovadora que permite a los vendedores mostrar sus productos con precios
              diferenciados según la cantidad de la compra, incentivando las compras grupales y
              beneficiando tanto a compradores como a vendedores en el proceso.
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
        {/* <TextContainer
          sx={{
            // display: 'flex',
            
          }}
        > */}
        <Typography
          variant="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: {
              xs: '2.5rem',
            },
            mb: 8,
          }}
          color="primary.dark"
        >
          Nuestros fundadores
        </Typography>
        {/* </TextContainer> */}
        <AvatarContainer>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'row',
                md: 'row',
                lg: 'row',
              },
              gap: theme.spacing(2),
              justifyContent: {
                xs: 'center',
                sm: 'space-around',
                md: 'space-around',
                lg: 'space-around',
              },
              alignItems: 'center',
            }}
          >
            {lideres.map((lider) =>
              lider.linkedinUrl ? (
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
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      {lider.description}
                    </Typography>
                    <LinkedInLogo />
                  </PersonContainer>
                </Link>
              ) : (
                <PersonContainer key={lider.name}>
                  <Avatar
                    sx={{ width: 140, height: 140 }}
                    src={lider.profileImg}
                    alt={lider.name}
                  />
                  <PersonName variant="h6">{lider.name}</PersonName>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {lider.description}
                  </Typography>
                </PersonContainer>
              ),
            )}
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
          <Box
            sx={{
              width: '100%',
              textAlign: 'center',
              mx: 'auto',
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
                },
              }}
              color="primary.dark"
            >
              ¿Por qué existe Mercado Fiel?
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Descubre la motivación detrás de Mercado Fiel y cómo estamos transformando el comercio
            local en Chile.
          </Typography>

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
              <img
                src={getResponsiveImage()}
                srcSet={`
                  ${whyWeareHereImages.mobile} 426w,
                  ${whyWeareHereImages.tablet} 960w,
                  ${whyWeareHereImages.desktop} 1080w
                `}
                sizes="(max-width: 600px) 426px, (max-width: 960px) 960px, 1080px"
                alt="2 personas mirando el horizonte en un atardecer en el sur de Chile"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  borderRadius: '8px',
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
                Mercado Fiel se crea con el objetivo de revolucionar la forma en que compradores y
                vendedores se conectan en el mercado chileno. Nuestra plataforma digital permite a
                los productores locales y comerciantes llegar directamente a más clientes, mientras
                los consumidores acceden a productos de calidad a precios justos.
              </Text>
              <Text gutterBottom>
                Ante la brecha entre oferta y demanda en el comercio local, muchos pequeños
                productores y comerciantes de la región tienen dificultades para expandirse y
                encontrar nuevos clientes, mientras que los consumidores a menudo pagan un precio
                mayor por productos al obtenerlos desde un distribuidor y no directamente desde el
                proveedor.
              </Text>
              <Text gutterBottom>
                Mercado Fiel resuelve este problema creando una plataforma transparente donde los
                vendedores pueden mostrar sus productos con precios diferenciados según cantidades
                de compra, incentivando las compras colaborativas. Esto permite mejores precios para
                los compradores y mayores volúmenes de venta para los productores, beneficiando a
                toda la comunidad comercial.
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
            },
            py: {
              xs: 2,
              sm: 4,
            },
            gap: 4,
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
                  },
                }}
                color="primary.dark"
              >
                Nuestra misión
              </Typography>
              <Text gutterBottom>
                Somos una plataforma digital que conecta a proveedores locales con consumidores,
                facilitando el comercio directo y las compras colaborativas. Buscamos democratizar
                el acceso a productos de calidad a precios justos, mientras impulsamos el
                crecimiento de los negocios locales y promovemos una economía más sostenible y
                colaborativa en Chile.
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
                  },
                }}
                color="primary.dark"
              >
                Nuestra visión
              </Typography>
              <Typography variant="body1" gutterBottom>
                Convertirnos en la plataforma líder de comercio colaborativo en Chile, empoderando a
                productores locales y consumidores para crear una economía más justa, sostenible e
                inclusiva. Aspiramos a ser el puente que fortalezca las comunidades comerciales
                locales y reduzca las brechas en el acceso a productos de calidad en todo el país.
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

              <TrendingUp
                sx={{
                  fontSize: '4rem',
                }}
              />
              <Text variant="subtitle1">Calidad</Text>

              <Store
                sx={{
                  fontSize: '4rem',
                }}
              />
              <Text variant="subtitle1">Comercio Justo</Text>
            </Box>
          </TextContainer>
        </Box>
      </Box>
    </>
  );
}

export default Nosotros;
