import Reviews from '@/components/Reviews';
import { Text, Title } from '@/components/StyledComponents';
import useAuth from '@/store/auth';
import useRecibeApoyo from '@/store/recibeApoyo';
import { Especialidad, Servicio } from '@/types/Servicio';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ProfileGrid,
  StyledAbout,
  StyledAvatar,
  StyledBackButton,
  StyledCTAs,
  StyledContactButton,
  StyledHeroBox,
  StyledHeroContent,
  StyledName,
  StyledServicio,
  StyledShortListButton,
} from './DesktopPerfilPrestadorStyledComponents';
import { styles } from './styles';

import Loading from '@/components/Loading';
import { useAuthNew } from '@/hooks';
import { Prestador } from '@/types';

export const PreviewDesktopProfile = () => {
  const { prestador, isLoggedIn } = useAuthNew();
  const [, { updateRedirectToAfterLogin }] = useAuth();

  const {
    id,
    firstname,
    lastname,
    imageUrl,
    servicio,
    especialidad,
    averageReviews,
    totalReviews,
    description,
  } = prestador as Prestador;

  const [{ allServicios }] = useRecibeApoyo();
  const [prestadorServicio, setPrestadorServicio] = useState({} as Servicio);
  const [prestadorEspecialidad, setPrestadorEspecialidad] = useState({} as Especialidad);
  const navigate = useNavigate();

  const handleContact = () => {
    if (isLoggedIn && prestador) {
      navigate(`/chat/${id}`);
      return;
    }

    updateRedirectToAfterLogin(`/perfil-prestador/${id}`);
    navigate('/registrar-usuario');
    return;
  };

  useEffect(() => {
    const thisPrestadorServicio = allServicios?.find((s) => s.serviceName === servicio);
    if (thisPrestadorServicio) {
      setPrestadorServicio(thisPrestadorServicio);
    }

    const thisPrestadorEspecialidad = thisPrestadorServicio?.especialidades?.find(
      (e) => e.especialidadName === especialidad,
    ) as Especialidad;

    if (thisPrestadorEspecialidad) {
      setPrestadorEspecialidad(thisPrestadorEspecialidad);
    }
  }, [allServicios, servicio, especialidad]);

  if (!prestador) return <Loading />;

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
              {prestadorServicio?.serviceName} / {prestadorEspecialidad?.especialidadName}
            </StyledServicio>
            <StyledCTAs>
              <StyledContactButton onClick={handleContact}>Contactar</StyledContactButton>
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
