import { ChatModal } from '@/components/ChatModal';
import Loading from '@/components/Loading';
import Reviews from '@/components/Reviews';
import { ScheduleController } from '@/components/Schedule/ScheduleController';
import { ScheduleModal } from '@/components/Schedule/ScheduleModal';
import { useAuth, useChat } from '@/hooks';
import { Box, styled } from '@mui/material';
import { useParams } from 'react-router-dom';
import { SupplierWithProducts } from '../../models';
import { StyledContactButton } from './DesktopPerfilPrestadorStyledComponents';
import {
  AboutContainer,
  AboutDescription,
  AboutTitle,
  HeroContainer,
  ReviewsContainer,
  StyledAvatar,
  StyledCTAs,
  StyledNameContainer,
  StyledTitle,
  Wrapper,
} from './MobilePerfilPrestadorStyledComponents';
import './mobileProfile.css';
import PerfilBackButton from './PerfilBackButton';
import { ProductosCarousel } from './ProductosCarousel';
import { usePerfilPrestador } from './usePerfilProveedor';

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
  proveedor: SupplierWithProducts;
};

export const MobileProfile = ({ proveedor }: MobileProfileProps) => {
  const {
    open,
    scheduleModalOpen,
    handleClose,
    handleContact,
    handleSchedule,
    handleCloseScheduleModal,
  } = usePerfilPrestador(proveedor);

  const { id } = useParams();
  const { user } = useAuth();

  const { message, setMessage, messages, messagesLoading, savingMessageLoading } = useChat(
    user?.id ?? '',
    id ?? '',
  );
  console.log({ proveedor });

  const { nombreNegocio, usuario, descripcion, productos } = proveedor;
  const { nombre, profilePictureUrl } = usuario || {};

  const {
    shouldDisableDay,
    renderAvailableDay,
    selectedTimes,
    selectedDates,
    handleSelectSessionHour,
    providersAppointments,
    providerAvailability,
  } = ScheduleController();

  return (
    <Wrapper>
      <HeroContainer>
        <PerfilBackButton />
        <StyledAvatar alt={`Imágen de perfil de ${nombreNegocio}`} src={profilePictureUrl || ''} />
        <StyledNameContainer>
          <StyledTitle>{nombreNegocio}</StyledTitle>
        </StyledNameContainer>
        <ReviewsContainer>
          {/* TODO: implement real reviews */}
          <Reviews average={0} total_reviews={0} />
        </ReviewsContainer>

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
              {/* {(createdServicios ?? []).length > 0 ? (
                <StyledShortListButton
                  startIcon={<EditCalendarOutlinedIcon />}
                  onClick={handleSchedule}
                >
                  Agendar
                </StyledShortListButton>
              ) : null} */}
            </>
          )}
        </StyledCTAs>
      </HeroContainer>
      <AboutContainer>
        <AboutTitle>Sobre {nombreNegocio}</AboutTitle>
        <AboutDescription>{descripcion}</AboutDescription>
      </AboutContainer>
      <SectionContainer>
        <AboutTitle
          sx={{
            my: '1rem',
          }}
        >
          Productos
        </AboutTitle>
        <ProductosCarousel productos={productos} />
      </SectionContainer>

      <ScheduleModal handleClose={handleCloseScheduleModal} open={scheduleModalOpen} />
    </Wrapper>
  );
};
