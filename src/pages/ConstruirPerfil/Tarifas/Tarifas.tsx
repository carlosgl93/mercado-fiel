import BackButton from '@/components/BackButton';
import {
  Container,
  StyledTitle,
  SubTitle,
  Wrapper,
} from '@/pages/PrestadorDashboard/StyledPrestadorDashboardComponents';
import { StyledText } from '../StyledConstruirPerfilComponents';
import { Box } from '@mui/material';
import { TarifaDiaria } from './TarifaDiaria';
import { TarifaFront } from '@/types';
import { SaveButton } from '@/components/SaveButton';
import { useRecoilValue } from 'recoil';
import { tarifasState } from '@/store/construirPerfil/tarifas';
import { TarifaController } from './TarifaController';
import Loading from '@/components/Loading';

export const Tarifas = () => {
  const {
    prestador,
    isSavingTarifas,
    fetchPrestadorTarifasIsLoading,
    handleChangeTarifa,
    handleChangeFreeMeetGreet,
    handleSaveTarifas,
  } = TarifaController();
  const newTarifas = useRecoilValue(tarifasState);

  return (
    <Wrapper>
      <BackButton />
      <Container>
        <StyledTitle>Tarifas</StyledTitle>
        <StyledText>
          Las tarifas se muestran en tu perfil como una guía para posibles clientes. Las tarifas
          reales que acuerdes e incluyas en un acuerdo de servicio pueden diferir ligeramente,
          basándose en los requisitos individuales de servicio de un cliente.
        </StyledText>

        <Box
          sx={{
            marginTop: '2rem',
          }}
        >
          <SubTitle>Tus tarifas</SubTitle>
          <StyledText>
            Toma en consideracion tu experiencia, educación, certificaciones y tipo de servicio. Los
            clientes pueden ver estas tarifas en tu perfil y pueden ser un factor decisivo para que
            te elijan.
          </StyledText>
          <StyledText
            sx={{
              color: 'red',
            }}
          >
            Usa solo números, sin puntos ni comas.
          </StyledText>
          {isSavingTarifas || fetchPrestadorTarifasIsLoading ? (
            <Loading />
          ) : (
            <form onSubmit={handleSaveTarifas}>
              {newTarifas?.map((tarifa: TarifaFront) => (
                <div key={tarifa.id}>
                  <TarifaDiaria tarifa={tarifa} handleChangeTarifa={handleChangeTarifa} />
                </div>
              ))}

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'start',
                  alignItems: 'center',
                  marginTop: '1rem',
                }}
              >
                <input
                  id="meetAndGreet"
                  type="checkbox"
                  name="meetAndGreet"
                  checked={prestador?.offersFreeMeetAndGreet}
                  onChange={handleChangeFreeMeetGreet}
                />
                <label htmlFor="meetAndGreet">Ofrezco conocernos gratuitamente.</label>
              </Box>
              <SaveButton />
            </form>
          )}
        </Box>
      </Container>
    </Wrapper>
  );
};
