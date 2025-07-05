import BackButton from '@/components/BackButton';
import {
  Container,
  StyledTitle,
  SubTitle,
  Wrapper,
} from '@/pages/PrestadorDashboard/StyledPrestadorDashboardComponents';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
} from '@mui/material';
import { experienceType } from './experienciaOptions';
import { useExperiencia } from '@/hooks/useExperiencia';
import { Text } from '@/components/StyledComponents';
import { StyledExperienceTypeContainer } from './StyledExperienciaComponents';
import { ExperienceType } from '@/store/construirPerfil/experiencia';
import { ArrowDropDownCircleOutlined } from '@mui/icons-material';
import Loading from '@/components/Loading';
import { SaveButton } from '@/components/SaveButton';
import { CenteredFlexBox } from '@/components/styled';

export const Experiencia = () => {
  const {
    saveExpLoading,
    isLoading,
    experienceOptions,
    aggregatedExperience,
    selectPreviousExperience,
    detectPreviousExperience,
    selectExperienceType,
    detectSelectedExperienceType,
    selectMainExperienceAreas,
    detectMainExperienceAreas,
    detectOtherExperienceAreas,
    selectOtherExperienceAreas,
    handleSaveExperience,
  } = useExperiencia();

  if (isLoading || saveExpLoading) return <Loading />;

  return (
    <Wrapper>
      <BackButton to="/construir-perfil" />
      <Container>
        <StyledTitle>Experiencia</StyledTitle>
        <SubTitle>
          Selecciona todas las areas en las que has trabajado, profesional y personalmente.
        </SubTitle>
        <StyledExperienceTypeContainer>
          <Grid container spacing={2}>
            {experienceOptions.map((option) => (
              <Grid item xs={6} key={option.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={detectPreviousExperience(option.id)}
                      icon={<option.icon />}
                      checkedIcon={<option.checkedIcon />}
                    />
                  }
                  label={option.label}
                  onChange={() => selectPreviousExperience(option)}
                />
              </Grid>
            ))}
          </Grid>
        </StyledExperienceTypeContainer>

        <form onSubmit={(e) => handleSaveExperience(e)}>
          <Text>Detalla tu experiencia en cada una de las areas seleccionadas.</Text>
          {experienceOptions?.map(
            (exp) =>
              aggregatedExperience?.find((e) => e.id === exp.id) &&
              exp.specialities &&
              exp.specialities.length > 0 && (
                <Accordion key={exp.id}>
                  <AccordionSummary expandIcon={<ArrowDropDownCircleOutlined />}>
                    <Text>{exp.label}</Text>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Text>¿Que tipo de experiencia tienes con {exp.label.toLowerCase()}?</Text>
                    <FormGroup>
                      {experienceType.map((t) => (
                        <FormControlLabel
                          key={t}
                          control={
                            <Checkbox
                              checked={detectSelectedExperienceType(t as ExperienceType, exp.id)}
                            />
                          }
                          label={t}
                          onChange={() => selectExperienceType(t as ExperienceType, exp.id)}
                        />
                      ))}
                    </FormGroup>
                    <Text
                      sx={{
                        mt: '1rem',
                      }}
                    >
                      Selecciona tu especialidad
                    </Text>
                    <FormGroup
                      sx={{
                        mb: '1rem',
                      }}
                    >
                      {exp.specialities.map((s) => (
                        <FormControlLabel
                          key={s.id}
                          control={
                            <Checkbox checked={detectMainExperienceAreas(s.label, exp.id)} />
                          }
                          label={s.label}
                          onChange={() => selectMainExperienceAreas(s.label, exp.id)}
                        />
                      ))}
                    </FormGroup>
                    {(aggregatedExperience?.find((e) => e?.id === exp?.id)?.mainArea ?? [])
                      ?.length < exp.specialities.length && (
                      <>
                        <Text>¿Tienes experiencia en otras areas?</Text>
                        <FormGroup>
                          {exp.specialities?.map((o) => {
                            const experienceAreaAlreadyInTheMainExperienceAreas =
                              aggregatedExperience.find((e) => e.id === exp.id)?.mainArea ===
                              o.label;
                            if (!experienceAreaAlreadyInTheMainExperienceAreas) {
                              return (
                                <FormControlLabel
                                  key={o.id}
                                  control={
                                    <Checkbox
                                      checked={detectOtherExperienceAreas(o.label, exp.id)}
                                    />
                                  }
                                  label={o.label}
                                  onChange={() => selectOtherExperienceAreas(o.label, exp.id)}
                                />
                              );
                            } else {
                              return null;
                            }
                          })}
                        </FormGroup>
                      </>
                    )}
                  </AccordionDetails>
                </Accordion>
              ),
          )}
          <CenteredFlexBox>
            <SaveButton />
          </CenteredFlexBox>
        </form>
      </Container>
    </Wrapper>
  );
};
