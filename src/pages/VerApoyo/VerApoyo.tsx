import '../PerfilPrestador/mobileProfile.css';
import {
  HeroContainer,
  StyledCTAs,
  StyledTitle,
  Wrapper,
} from '../PerfilPrestador/MobilePerfilPrestadorStyledComponents';
import Loading from '@/components/Loading';
import { Apoyo } from '@/api/supportRequests';
import { BackButtonContainer } from '../PrestadorDashboard/StyledPrestadorDashboardComponents';
import BackButton from '@/components/BackButton';
import { ColumnCenteredFlexBox, FlexBox, FlexColumn } from '@/components/styled';
import { SubTitle, Text } from '@/components/StyledComponents';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, styled } from '@mui/material';
import { DescriptionOutlined, LocationOn } from '@mui/icons-material';
import { CalendarIcon } from '@mui/x-date-pickers';
import { StyledContactButton } from '../PerfilPrestador/DesktopPerfilPrestadorStyledComponents';
import { VerApoyoController } from './VerApoyoController';
import { VerApoyoChatModal } from './VerApoyoChatModal';
import { Prestador } from '@/store/auth/prestador';
import { capitalizeFirst } from '../../utils/capitalizeFirstLetter';

type VerApoyoProps = {
  apoyo: Apoyo;
};

export const VerApoyo = (props: VerApoyoProps) => {
  const {
    isLoading,
    error,
    allComunas,
    translatedRecurrency,
    profileImageUrl,
    speciality,
    firstname,
    service,
    email,
    message,
    setMessage,
    messages,
    messagesLoading,
    savingMessageLoading,
    handleContact,
    openContactCustomer,
    setOpenContactCustomer,
    customer,
    apoyo,
    disableContact,
    prestador,
  } = VerApoyoController(props.apoyo);
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <div>Error loading customer data</div>;
  }

  return (
    <Wrapper>
      <HeroContainer>
        <BackButtonContainer
          sx={{
            p: '1rem',
          }}
        >
          <BackButton
            style={{
              color: 'white',
              borderColor: 'white',
            }}
            displayText
            // to="/mis-apoyos"
          />
        </BackButtonContainer>
        <ColumnCenteredFlexBox>
          <FlexBox>
            <StyledTitle
              sx={{
                lineHeight: '2.5rem',
              }}
            >
              {capitalizeFirst(apoyo.title)}
            </StyledTitle>
          </FlexBox>
          <List
            sx={{
              m: '1rem',
            }}
          >
            <ListItem
              sx={{
                gap: '1rem',
              }}
            >
              <ListItemAvatar>
                <SmallUserAvatar alt={`Imágen de perfil de ${firstname}`} src={profileImageUrl} />
              </ListItemAvatar>
              <ListItemText sx={{ width: '100%' }}>
                <FlexColumn
                  sx={{
                    justifyContent: 'space-between',
                  }}
                >
                  <WhiteText>Publicado por: {firstname ? firstname : email}</WhiteText>
                </FlexColumn>
                {apoyo.patientName && (
                  <FlexColumn
                    sx={{
                      justifyContent: 'space-between',
                    }}
                  >
                    <WhiteText>
                      Paciente: {apoyo.patientName ? apoyo.patientName : customer.patientName}
                    </WhiteText>
                    <WhiteText>
                      Edad del paciente:{' '}
                      {apoyo.patientAge ? apoyo.patientAge : customer?.patientAge} años
                    </WhiteText>
                    <WhiteText>Servicio: {service}</WhiteText>
                    {speciality && <WhiteText>Especialidad: {speciality}</WhiteText>}
                  </FlexColumn>
                )}
              </ListItemText>
            </ListItem>
          </List>
        </ColumnCenteredFlexBox>
        <StyledCTAs>
          {messagesLoading ? (
            <Loading />
          ) : (
            <>
              <StyledContactButton onClick={handleContact} disabled={disableContact}>
                {(messages?.messages ?? []).length > 0 ? 'Ver conversación' : 'Contactar'}
              </StyledContactButton>
              <VerApoyoChatModal
                isLoading={savingMessageLoading}
                open={openContactCustomer}
                handleClose={() => setOpenContactCustomer(false)}
                message={message}
                setMessage={setMessage}
                apoyo={apoyo}
                customer={customer}
                prestador={prestador as Prestador}
              />
            </>
          )}
        </StyledCTAs>
      </HeroContainer>
      <FlexColumn>
        <SubTitle>Detalles del apoyo</SubTitle>
        <List
          sx={{
            width: { xs: '100%', md: '50vw' },
            backgroundColor: 'secondary.main',
            borderRadius: '0.5rem',
          }}
        >
          <ListItem alignItems="center">
            <CenteredListItemAvatar>
              <LocationOn sx={{ color: 'primary.main' }} />
            </CenteredListItemAvatar>
            <ListItemText>
              {apoyo.comunasIds.map((c) => {
                const renderComuna = allComunas.find((comuna) => comuna.id === c);
                return <Text key={c}>{renderComuna?.name}</Text>;
              })}
            </ListItemText>
          </ListItem>
          <ListItem>
            <CenteredListItemAvatar>
              <DescriptionOutlined sx={{ color: 'primary.main' }} />
            </CenteredListItemAvatar>
            <ListItemText>{apoyo.description}</ListItemText>
          </ListItem>
          <ListItem>
            <CenteredListItemAvatar>
              <CalendarIcon sx={{ color: 'primary.main' }} />
            </CenteredListItemAvatar>
            <ListItemText>{translatedRecurrency}</ListItemText>
          </ListItem>
        </List>
      </FlexColumn>
    </Wrapper>
  );
};

const WhiteText = styled(Text)({
  color: 'white',
  fontSize: '1rem',
  textAlign: 'left',
});

const SmallUserAvatar = styled(Avatar)({
  width: '5rem',
  height: '5rem',
});

const CenteredListItemAvatar = styled(ListItemAvatar)({
  display: 'flex',
  alignContent: 'center',
  alignItems: 'center',
  justifyContent: 'center',
});
