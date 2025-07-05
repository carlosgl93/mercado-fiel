import { BackButtonContainer } from '../StyledPrestadorDashboardComponents';
import { CenteredFlexBox, FlexBox } from '@/components/styled';
import { useGetClientes, useSupportRequests } from '@/hooks';
import { Text } from '@/components/StyledComponents';
import { EncuentraClientesHeader } from './Header';
import { MobileClientes } from './MobileClientes';
import BackButton from '@/components/BackButton';
import Loading from '@/components/Loading';
import { Box } from '@mui/material';

export const EncuentraClientes = () => {
  const { lastClientElementRef, hasNextPage } = useGetClientes();

  const {
    isFetching,
    infiniteSupportRequests,
    totalSupportRequestsIsLoading,
    infiniteSupportRequestsIsLoading,
  } = useSupportRequests();

  if (infiniteSupportRequestsIsLoading || isFetching || totalSupportRequestsIsLoading) <Loading />;

  return (
    <>
      <FlexBox sx={{ px: '1rem' }}>
        <BackButtonContainer
          sx={{
            pt: '1rem',
          }}
        >
          <BackButton displayText to="/prestador-dashboard" />
        </BackButtonContainer>
      </FlexBox>
      <EncuentraClientesHeader />
      {/* {isTablet && <MobileClientes />} */}
      {/* TODO: add ? <MobileClientes/> : <DesktopClientes/> */}
      {infiniteSupportRequests?.pages[0].supportRequests.length === 0 && (
        <CenteredFlexBox
          sx={{
            height: '55vh',
            m: '1rem 1.4rem',
          }}
        >
          <Text>Aún no hay personas buscando apoyo para tus comunas y/o servicio.</Text>
        </CenteredFlexBox>
      )}
      {!hasNextPage &&
        (infiniteSupportRequests?.pages[0]?.supportRequests?.length || [].length) > 0 && (
          <CenteredFlexBox
            sx={{
              m: '1rem 1.4rem',
            }}
          >
            <Text>No hay más registros para mostrar para tus comunas y tipo de servicio.</Text>
          </CenteredFlexBox>
        )}
      {(infiniteSupportRequests?.pages[0].supportRequests || []).length > 0 && <MobileClientes />}

      {hasNextPage && <Box ref={lastClientElementRef} className="bottomSentinel" />}
    </>
  );
};
