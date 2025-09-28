import Loading from '@/components/Loading';
import Meta from '@/components/Meta';
import { FlexBox, FullSizeCenteredFlexBox } from '@/components/styled';
import { Text, Title } from '@/components/StyledComponents';
import { CenteredDivider } from '@/components/StyledDivider';
import { useLoading } from '@/store/global';
import { Box, styled } from '@mui/material';
import { StyledAvatar } from '../PerfilProveedor/MobilePerfilPrestadorStyledComponents';
import { Container } from '../ProveedorDashboard/StyledPrestadorDashboardComponents';

function BookingConfirmation() {
  const { loading } = useLoading();

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
              />
            </StyledFlexBoxInner>

            <CenteredDivider />

            <StyledBox>
              <StyledFlexBoxInner>
                <StyledLeftText>Proveedor</StyledLeftText>
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
              </StyledFlexBoxInner>
            </StyledBox>

            <CenteredDivider />
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
