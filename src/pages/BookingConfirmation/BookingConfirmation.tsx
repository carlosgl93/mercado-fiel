import Loading from '@/components/Loading';
import Meta from '@/components/Meta';
import { ScheduleController } from '@/components/Schedule/ScheduleController';
import { FlexBox, FullSizeCenteredFlexBox } from '@/components/styled';
import { Text, Title } from '@/components/StyledComponents';
import { CenteredDivider } from '@/components/StyledDivider';
import { paymentSettings } from '@/config';
import { useLoading } from '@/store/global';
import { interactedProveedorState } from '@/store/resultados/interactedPrestador';
import { formatDate } from '@/utils/formatDate';
import { Box, styled } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { formatCLP } from '../../utils/formatCLP';
import { StyledAvatar } from '../PerfilProveedor/MobilePerfilPrestadorStyledComponents';
import { Container } from '../PrestadorDashboard/StyledPrestadorDashboardComponents';
import { ButtonCTA } from '../UsuarioDashboard/StyledComponents';

function BookingConfirmation() {
  const { schedule, handleConfirmBooking } = ScheduleController();
  const {
    isMultiple,
    selectedDates,
    selectedTimes,
    howManySessionsToConfirm,
    howManySessionsToSchedule,
  } = schedule;
  const { loading } = useLoading();

  const interactedPrestador = useRecoilValue(interactedProveedorState);
  if (!selectedDates || !selectedTimes || !interactedPrestador) return null;
  const { firstname, lastname, email, profileImageUrl } = interactedPrestador;

  if (loading) return <Loading />;

  return (
    <>
      <Meta title="Confirmación de la reserva" />
      <FullSizeCenteredFlexBox
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <StyledContainer>
          <Title
            sx={{
              fontSize: '2rem',
              textAlign: 'center',
            }}
          >
            Confirmación de la reserva
          </Title>
          <StyledFlexBox>
            <StyledFlexBoxInner>
              <StyledAvatar
                sx={{
                  width: '90px',
                  height: '90px',
                  my: '1rem',
                }}
                alt={`Imágen de perfil de ${firstname}`}
                src={profileImageUrl}
              />
            </StyledFlexBoxInner>

            <CenteredDivider />

            <StyledBox>
              <StyledFlexBoxInner>
                <StyledLeftText>Proveedor</StyledLeftText>
                <StyledText>{firstname ? `${firstname} ${lastname}` : email}</StyledText>
              </StyledFlexBoxInner>

              <StyledFlexBoxInner>
                <StyledLeftText>Servicio</StyledLeftText>
                {/* <StyledText>{name}</StyledText> */}
              </StyledFlexBoxInner>

              <StyledFlexBoxInner>
                <StyledLeftText>Duración</StyledLeftText>
                {/* <StyledText>{formatMinutes(duration)}</StyledText> */}
              </StyledFlexBoxInner>

              <StyledFlexBoxInner>
                <StyledLeftText>Cuando</StyledLeftText>
                <StyledText>
                  {selectedDates.map(
                    (selectedDate) =>
                      formatDate(selectedDate?.toDate()).toString()?.[0].toUpperCase() +
                      formatDate(selectedDate?.toDate()).toString()?.slice(1) +
                      ' a las ' +
                      selectedTimes[selectedDate.format('YYYY-MM-DD') as unknown as number].format(
                        'HH:mm',
                      ) +
                      '\n',
                  )}
                </StyledText>
              </StyledFlexBoxInner>

              {isMultiple && (
                <>
                  <StyledFlexBoxInner>
                    <StyledLeftText>Cuantas sesiones a agendar:</StyledLeftText>
                    <StyledText>{howManySessionsToSchedule}</StyledText>
                  </StyledFlexBoxInner>
                  <StyledFlexBoxInner>
                    <StyledLeftText>Sesiones a confirmar/pagar ahora</StyledLeftText>
                    <StyledText>{howManySessionsToConfirm}</StyledText>
                  </StyledFlexBoxInner>
                </>
              )}
            </StyledBox>

            <CenteredDivider />

            <StyledBox>
              <StyledFlexBoxInner>
                <StyledLeftText>Valor a pagar hoy:</StyledLeftText>
                <StyledText>
                  {/* {formatCLP(Number(price) * (howManySessionsToConfirm || 1))} CLP */}
                </StyledText>
              </StyledFlexBoxInner>
              <StyledFlexBoxInner>
                <StyledLeftText>Comisión Mercado Fiel: </StyledLeftText>
                <StyledText>
                  {formatCLP(
                    Math.round(
                      (paymentSettings.appCommission - 1) *
                        // Number(price) *
                        (howManySessionsToConfirm || 1),
                    ),
                  )}{' '}
                  CLP
                </StyledText>
              </StyledFlexBoxInner>
            </StyledBox>

            <CenteredDivider />
            <ButtonCTA variant="contained" onClick={handleConfirmBooking}>
              Agendar
            </ButtonCTA>
          </StyledFlexBox>
        </StyledContainer>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default BookingConfirmation;

const StyledContainer = styled(Container)(({ theme }) => ({
  maxWidth: '100%', // default value
  [theme.breakpoints.up('xs')]: {
    maxWidth: '90%',
    padding: '1rem',
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: '600px',
    padding: '2rem',
  },
  margin: '1rem 0',
}));

const StyledFlexBox = styled(FlexBox)({
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyItems: 'space-between',
});

const StyledFlexBoxInner = styled(FlexBox)({
  alignItems: 'center',
  justifyContent: 'space-between',
  px: '1rem',
  width: '100%',
  gap: '1rem',
});

const StyledBox = styled(Box)({
  width: '100%',
  margin: '1rem 0',
});

const StyledText = styled(Text)({
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
  textAlign: 'end',
  fontSize: '1rem',
});

const StyledLeftText = styled(Text)({
  textAlign: 'start',
  fontSize: '1rem',
});
