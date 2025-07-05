import useConstruirPerfil from '@/store/construirPerfil';
import { Wrapper } from './MobilePerfilPrestadorStyledComponents';
import { Box, styled } from '@mui/material';
import { Title } from '@/components/StyledComponents';
import { formatCLP } from '@/utils/formatCLP';
import { paymentSettings } from '../../config';

const StyledSubtitle = styled(Title)(({ theme }) => ({
  color: theme.palette.secondary.dark,
  fontSize: '1.125rem',
}));

const Grid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridTemplateRows: 'repeat(2, 1fr)',
  gap: '1rem',
  width: '100%',
  padding: '1rem  0',
}));

const StyledTarifaContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'start',
  width: '100%',
}));

const StyledTarifa = styled(Title)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '1.5rem',
}));

const SmallText = styled(Title)(({ theme }) => ({
  color: theme.palette.secondary.dark,
  fontSize: '1rem',
}));

const StyledGreyText = styled(SmallText)(({ theme }) => ({
  color: theme.palette.secondary.dark,
  fontSize: '0.85rem',
}));

const StyledGreyTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'start',
  width: '100%',
  backgroundColor: theme.palette.background.default,
  padding: '1rem',
  borderRadius: '1rem',
}));

export const Tarifas = () => {
  const [{ tarifas, prestador }] = useConstruirPerfil();

  const freeMeetGreet = prestador?.offersFreeMeetAndGreet;
  const fee = paymentSettings.appCommission;

  return (
    <Wrapper>
      <Grid>
        <StyledTarifaContainer>
          <StyledSubtitle>Juntarse y conocerse gratis</StyledSubtitle>
          <StyledTarifa>{freeMeetGreet ? 'Gratis' : 'No'}</StyledTarifa>
        </StyledTarifaContainer>
        {tarifas?.map((tarifa) => {
          const { id, dayName, price } = tarifa;
          return (
            <StyledTarifaContainer key={id}>
              <StyledSubtitle>{dayName}</StyledSubtitle>
              <StyledTarifa>{formatCLP(Number(price) + Number(price) * fee)} p/hr</StyledTarifa>
              <StyledGreyText>
                Basado en una tarifa indicada de {formatCLP(Number(price))}
              </StyledGreyText>
            </StyledTarifaContainer>
          );
        })}
      </Grid>
      <StyledGreyTextContainer>
        <SmallText>El costo total del apoyo es {fee}% mas alto que lo acordado.</SmallText>
      </StyledGreyTextContainer>
    </Wrapper>
  );
};
