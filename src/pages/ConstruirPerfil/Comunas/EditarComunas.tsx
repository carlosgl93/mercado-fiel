import { Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  BackButtonContainer,
  Wrapper,
} from '@/pages/PrestadorDashboard/StyledPrestadorDashboardComponents';
import BackButton from '@/components/BackButton';
import { ComunasSearchBar } from './ComunasSearchBar';
import { useComunas } from '@/hooks/useComunas';
import Loading from '@/components/Loading';
import {
  ContentContainer,
  StyledList,
  StyledListItemButton,
  StyledSubtitle,
  StyledTextContainer,
  StyledTitle,
} from './StyledCompEditarComunas';

export const EditarComunas = () => {
  const {
    selectedComunas,
    comunasSearched,
    matchedComunas,
    updateComunasisLoading,
    removeComunaIsLoading,
    fetchPrestadorComunasIsLoading,
    handleRemoveComuna,
    handleSelectComuna,
    handleChangeSearchComuna,
    handleUpdatePrestadorComunas,
  } = useComunas();

  return (
    <Wrapper>
      <BackButtonContainer>
        <BackButton to="/construir-perfil" />
      </BackButtonContainer>
      {fetchPrestadorComunasIsLoading ? (
        <Loading />
      ) : (
        <>
          <StyledTextContainer>
            <StyledTitle>Editar comunas</StyledTitle>
            <Box>
              <StyledSubtitle>Comunas seleccionadas:</StyledSubtitle>
              {removeComunaIsLoading ? (
                <Loading />
              ) : (
                <StyledList>
                  {selectedComunas?.map((comuna) => (
                    <StyledListItemButton
                      key={comuna.id}
                      onClick={() => handleRemoveComuna(comuna)}
                    >
                      {comuna.name}
                      <CloseIcon sx={{ marginLeft: '0.5rem' }} />
                    </StyledListItemButton>
                  ))}
                </StyledList>
              )}
            </Box>
          </StyledTextContainer>
          {updateComunasisLoading ? (
            <Loading />
          ) : (
            <ContentContainer>
              <ComunasSearchBar
                handleSelectComuna={handleSelectComuna}
                comunasSearched={comunasSearched}
                matchedComunas={matchedComunas}
                handleChangeSearchComuna={handleChangeSearchComuna}
              />
              <Button variant="contained" onClick={handleUpdatePrestadorComunas}>
                Guardar
              </Button>
            </ContentContainer>
          )}
        </>
      )}
    </Wrapper>
  );
};
