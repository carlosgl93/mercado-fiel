import { DashboardHeader } from '@/components';
import Loading from '@/components/Loading';
import { useConstruirPerfilNew } from '@/hooks/useConstruirPerfilNew';
import useConstruirPerfil from '@/store/construirPerfil';
import { Build as BuildIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { alpha, Box, Button, Container, List, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SubTitle, Wrapper } from '../ProveedorDashboard/StyledPrestadorDashboardComponents';
import { construirPerfilOpciones } from './construirPerfilOpciones';
import {
  StyledCheckedIcon,
  Container as StyledContainer,
  StyledLink,
  StyledListItem,
  StyledOption,
  StyledText,
  StyledUncheckedIcon,
} from './StyledConstruirPerfilComponents';
import './styles.css';

export const ConstruirPerfil = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [construirPerfil, { handleVerPerfil }] = useConstruirPerfil();
  const { settings } = useConstruirPerfilNew();

  const handleBackToDashboard = () => {
    navigate('/proveedor-dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <DashboardHeader
          title="Construir Perfil"
          description="Completa tu perfil profesional para atraer más clientes"
          icon={<BuildIcon sx={{ fontSize: 32 }} />}
          breadcrumbs={[
            {
              label: 'Dashboard',
              onClick: handleBackToDashboard,
            },
            {
              label: 'Construir Perfil',
            },
          ]}
          onBack={handleBackToDashboard}
          actions={
            <Button
              variant="contained"
              startIcon={<VisibilityIcon />}
              onClick={handleVerPerfil}
              sx={{
                bgcolor: 'primary.contrastText',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.contrastText, 0.9),
                },
              }}
            >
              Ver perfil
            </Button>
          }
        />

        <Wrapper sx={{ bgcolor: 'white', p: 3, borderRadius: 2 }}>
          <StyledContainer>
            {construirPerfil.loading ? (
              <Loading />
            ) : (
              <>
                <SubTitle>Pasos a completar</SubTitle>
                <StyledText>
                  No todos son necesarios, pero aumentan las probabilidades de que los clientes te
                  contacten.
                </StyledText>
                <List>
                  {construirPerfilOpciones.map((opcion) => {
                    const { key, value } = opcion;
                    return (
                      <StyledLink
                        aria-disabled={!opcion.implemented}
                        key={opcion.key}
                        to={opcion.implemented ? `/construir-perfil/${opcion.key}` : ''}
                      >
                        <StyledListItem>
                          {settings?.[key] ? <StyledCheckedIcon /> : <StyledUncheckedIcon />}
                          <StyledOption>{value}</StyledOption>
                        </StyledListItem>
                      </StyledLink>
                    );
                  })}
                </List>
              </>
            )}
          </StyledContainer>
        </Wrapper>
      </Container>
    </Box>
  );
};
