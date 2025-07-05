import './mobileProfile.css';
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
} from './MobilePerfilPrestadorStyledComponents';
import Reviews from '@/components/Reviews';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import {
  StyledContactButton,
  StyledShortListButton,
} from './DesktopPerfilPrestadorStyledComponents';
import { ChatModal } from '@/components/ChatModal';
import { usePerfilPrestador } from './usePerfilPrestador';
import PerfilBackButton from './PerfilBackButton';
import { Box, styled, useTheme } from '@mui/material';
import { Prestador } from '@/store/auth/prestador';
import { useChat } from '@/hooks';
import { useParams } from 'react-router-dom';
import { useAuthNew } from '@/hooks/useAuthNew';
import Loading from '@/components/Loading';
import { ScheduleModal } from '@/components/Schedule/ScheduleModal';
import { ServiciosCarousel } from './ServiciosCarousel';
import { DateCalendar } from '@mui/x-date-pickers';
import { ScheduleController } from '@/components/Schedule/ScheduleController';
import { SelectSessionTime } from '@/components/Schedule/SelectSessionTime';

export const SectionContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'start',
  width: '100%',
  padding: '0.5rem 1rem',
}));

export const SectionTitle = styled(StyledTitle)(({ theme }) => ({
  marginTop: '1rem',
  color: theme.palette.secondary.dark,
  fontSize: '1.5rem',
}));

type MobileProfileProps = {
  prestador: Prestador;
};

export const MobileProfile = ({ prestador }: MobileProfileProps) => {
  const {
    open,
    scheduleModalOpen,
    handleClose,
    handleContact,
    handleSchedule,
    handleCloseScheduleModal,
  } = usePerfilPrestador(prestador);
  const theme = useTheme();

  const { id } = useParams();
  const { user } = useAuthNew();

  const { message, setMessage, messages, messagesLoading, savingMessageLoading } = useChat(
    user?.id ?? '',
    id ?? '',
  );

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
  } = prestador;

  const {
    shouldDisableDay,
    renderAvailableDay,
    selectedTimes,
    selectedDates,
    availableTimesStep,
    handleSelectSessionHour,
    providersAppointments,
    selectedService,
    providerAvailability,
  } = ScheduleController();

  return (
    <Wrapper>
      <HeroContainer>
        <PerfilBackButton />
        <StyledAvatar alt={`Imágen de perfil de ${firstname}`} src={profileImageUrl} />
        <StyledNameContainer>
          <StyledTitle>{firstname ? firstname : email}</StyledTitle>
        </StyledNameContainer>
        <ReviewsContainer>
          <Reviews average={averageReviews || 0} total_reviews={totalReviews || 0} />
        </ReviewsContainer>

        <StyledServicio>
          {servicio} {especialidad && `/ ${especialidad}`}
        </StyledServicio>

        <StyledServicio>
          {prestador.comunas.map((c, i) => {
            if (i !== prestador?.comunas?.length - 1) {
              return `${c.name} - `;
            } else {
              return c.name;
            }
          })}
        </StyledServicio>

        <StyledCTAs>
          {messagesLoading ? (
            <Loading />
          ) : (
            <>
              <StyledContactButton onClick={handleContact}>
                {(messages?.messages ?? []).length > 0 ? 'Ver conversación' : 'Contactar'}
              </StyledContactButton>
              <ChatModal
                isLoading={savingMessageLoading}
                open={open}
                handleClose={handleClose}
                message={message}
                setMessage={setMessage}
              />
              {(createdServicios ?? []).length > 0 ? (
                <StyledShortListButton
                  startIcon={<EditCalendarOutlinedIcon />}
                  onClick={handleSchedule}
                >
                  Agendar
                </StyledShortListButton>
              ) : null}
            </>
          )}
        </StyledCTAs>
      </HeroContainer>
      <AboutContainer>
        <AboutTitle>Sobre {firstname ? firstname : email}</AboutTitle>
        <AboutDescription>
          {description ? description : 'Este prestador aun no agrega información'}
        </AboutDescription>
      </AboutContainer>
      <SectionContainer>
        <AboutTitle
          sx={{
            my: '1rem',
          }}
        >
          Servicios
        </AboutTitle>
        <ServiciosCarousel createdServicios={createdServicios} />
      </SectionContainer>
      <SectionContainer
        sx={{
          backgroundColor: theme.palette.background.default,
        }}
      >
        <AboutTitle
          sx={{
            my: '1rem',
          }}
        >
          Disponibilidad
        </AboutTitle>
        <DateCalendar
          shouldDisableDate={shouldDisableDay}
          disablePast={true}
          slots={{ day: renderAvailableDay }}
          readOnly
        />
        Object?.keys(selectedTimes || {})?.length !== selectedDates?.length && (
        <SelectSessionTime
          selectedTimes={selectedTimes}
          availableTimesStep={availableTimesStep}
          selectedDates={selectedDates}
          handleSelectSessionHour={handleSelectSessionHour}
          // shouldDisableTime={shouldDisableTime}
          providerAppointments={providersAppointments}
          serviceDuration={selectedService?.duration}
          providerAvailability={providerAvailability}
        />
        ){/* <ListAvailableDays disponibilidad={availability ?? []} /> */}
      </SectionContainer>

      <ScheduleModal handleClose={handleCloseScheduleModal} open={scheduleModalOpen} />
    </Wrapper>
  );
};
