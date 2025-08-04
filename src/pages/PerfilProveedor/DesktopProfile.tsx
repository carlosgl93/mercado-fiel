import Reviews from '@/components/Reviews';
import { Text, Title } from '@/components/StyledComponents';
import { Prestador } from '@/store/auth/proveedor';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { Box } from '@mui/material';
import {
  ProfileGrid,
  StyledAbout,
  StyledAvatar,
  StyledBackButton,
  StyledCTAs,
  StyledHeroBox,
  StyledHeroContent,
  StyledName,
  StyledServicio,
  StyledShortListButton,
} from './DesktopPerfilPrestadorStyledComponents';
import { styles } from './styles';

type DesktopProfileProps = {
  prestador: Prestador;
};

export const DesktopProfile = ({ prestador }: DesktopProfileProps) => {
  const {
    firstname,
    lastname,
    averageReviews,
    totalReviews,
    imageUrl,
    servicio,
    especialidad,
    description,
  } = prestador;

  return (
    <>
      <StyledHeroBox>
        <Box sx={styles.topBar}>
          <StyledBackButton
            variant="contained"
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => {
              window.history.back();
            }}
          >
            Atras
          </StyledBackButton>
        </Box>
        <StyledHeroContent>
          <Box>
            <StyledAvatar alt={`Imagen de perfil de ${firstname}`} src={imageUrl} />
          </Box>
          <Box>
            <StyledName>
              {firstname} {lastname}
            </StyledName>
            <Reviews average={averageReviews || 0} total_reviews={totalReviews || 0} />

            <StyledServicio>
              {servicio} / {especialidad}
            </StyledServicio>
            <StyledCTAs>
              {/* <StyledContactButton onClick={handleContact}>Contactar</StyledContactButton> */}
              <StyledShortListButton startIcon={<BookmarkBorderOutlinedIcon />}>
                Guardar
              </StyledShortListButton>
            </StyledCTAs>
          </Box>
        </StyledHeroContent>
      </StyledHeroBox>
      <StyledAbout>
        <Box
          sx={{
            px: '10%',
            alignItems: 'start',
          }}
        >
          <Title
            align="left"
            sx={{
              fontSize: '1.3rem',
            }}
          >
            Acerca de {firstname} {lastname && lastname[0]?.toUpperCase() + '.'}
          </Title>
        </Box>
        <Box>
          <Text
            sx={{
              px: '10%',
              fontSize: '1rem',
              alignItems: 'start',
              fontWeight: '600',
            }}
          >
            {description}
          </Text>
        </Box>
      </StyledAbout>
      <ProfileGrid>
        {/* top left availability */}
        {/* Mercado Fiel Verified */}
        <Box>Mercado Fiel Verified</Box>
        {/* top right services offered */}
        <Box>Services Offered</Box>
        {/* left below availability: Indicative rates */}
        <Box>
          <Box>Availability</Box>
          <Box>Indicative rates</Box>
        </Box>
        {/* right below services offered: Badges */}
        <Box>Badges</Box>
        {/* Inmunizacion */}
        <Box>
          <Text>Inmunizacion</Text>
        </Box>
        <Box>Experiencia</Box>
        <Box>Ubicaciones de trabajo</Box>
        <Box>More Information</Box>

        <Box>Reviews</Box>
      </ProfileGrid>
    </>
  );
};
