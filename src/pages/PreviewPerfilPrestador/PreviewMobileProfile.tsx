import Reviews from '@/components/Reviews';
import { Box, styled } from '@mui/material';
import PerfilBackButton from './PerfilBackButton';
import {
  StyledContactButton,
  StyledShortListButton,
} from './DesktopPerfilPrestadorStyledComponents';
import { Prestador } from '@/store/auth/prestador';
import { DateCalendar } from '@mui/x-date-pickers';
import {
  AboutContainer,
  AboutDescription,
  AboutTitle,
  HeroContainer,
  ReviewsContainer,
  StyledAvatar,
  StyledCTAs,
  StyledNameContainer,
  StyledServicio,
  StyledTitle,
  Wrapper,
} from '../PerfilPrestador/MobilePerfilPrestadorStyledComponents';
import { ServiciosCarousel } from '../PerfilPrestador/ServiciosCarousel';
import { ScheduleController } from '@/components/Schedule/ScheduleController';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';

const SectionContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'start',
  width: '100%',
  padding: '1rem 1rem',
}));

const SectionTitle = styled(StyledTitle)(({ theme }) => ({
  color: theme.palette.primary.dark,
  fontSize: '1.5rem',
}));

type PreviewMobileProfileProps = {
  fullProvider: Prestador | undefined;
};

export const PreviewMobileProfile = ({ fullProvider }: PreviewMobileProfileProps) => {
  const {
    firstname,
    averageReviews,
    totalReviews,
    description,
    email,
    servicio,
    especialidad,
    createdServicios,
    profileImageUrl,
  } = fullProvider as Prestador;

  const { shouldDisableDay, renderAvailableDay } = ScheduleController();

  return (
    <Wrapper
      sx={{
        px: 'auto',
        margin: 'auto',
      }}
    >
      <HeroContainer>
        <PerfilBackButton />
        <StyledAvatar alt={`Imagen de perfil de ${firstname}`} src={profileImageUrl} />
        <StyledNameContainer>
          <StyledTitle>{firstname ? firstname : email}</StyledTitle>
        </StyledNameContainer>
        <ReviewsContainer>
          <Reviews average={averageReviews || 0} total_reviews={totalReviews || 0} />
        </ReviewsContainer>

        <StyledServicio>
          {servicio} {especialidad && `/ ${especialidad}`}
        </StyledServicio>
        <StyledCTAs>
          <StyledContactButton>Ver conversación</StyledContactButton>
          <StyledShortListButton startIcon={<EditCalendarOutlinedIcon />}>
            Agendar
          </StyledShortListButton>
        </StyledCTAs>
      </HeroContainer>
      <AboutContainer
        sx={{
          width: '100%',
          px: {
            xs: '1rem',
            sm: '2rem',
            md: '33vw',
          },
        }}
      >
        <AboutTitle>Sobre {firstname ? firstname : email}</AboutTitle>
        <AboutDescription>
          {description ? description : 'Este prestador aun no agrega información'}
        </AboutDescription>
      </AboutContainer>
      <SectionContainer
        sx={{
          width: '100%',
        }}
      >
        <SectionTitle>Servicios</SectionTitle>
        <ServiciosCarousel createdServicios={createdServicios} />
      </SectionContainer>
      <AboutContainer>
        <SectionTitle>Disponibilidad</SectionTitle>
        <DateCalendar
          shouldDisableDate={shouldDisableDay}
          disablePast={true}
          slots={{ day: renderAvailableDay }}
          readOnly
        />
        {/* <ListAvailableDays disponibilidad={availability ?? []} /> */}
      </AboutContainer>
    </Wrapper>
  );
};
