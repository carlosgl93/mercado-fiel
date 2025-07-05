import { useMemo } from 'react';
import {
  Container,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  Input,
} from '@mui/material';
import {
  BackButtonContainer,
  SectionTitleContainer,
  StyledTitle,
} from '../../PrestadorDashboard/StyledPrestadorDashboardComponents';
import { User } from '@/store/auth/user';
import Loading from '@/components/Loading';
import BackButton from '@/components/BackButton';
import { Text } from '@/components/StyledComponents';
import { PublicarApoyoController } from './PublicarApoyoController';
import { CenteredFlexBox, ColumnCenteredFlexBox, FlexBox } from '@/components/styled';
import { useComunas } from '@/hooks';
import { ComunasSearchBar } from '@/pages/ConstruirPerfil/Comunas/ComunasSearchBar';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { forWhomOptions } from '@/pages/RecibeApoyo/ForWhomList';
import { DateTimePicker } from '@mui/x-date-pickers';
import { esES } from '@mui/x-date-pickers/locales';
import { SelectCalendarDate } from '@/components/Schedule/SelectCalendarDate';
import { Recurrency } from '@/utils/getRecurrencyText';
import { AddButton, RemoveButton } from '@/components';

export const PublicarApoyo = () => {
  const {
    user,
    setUserState,
    title,
    setTitle,
    description,
    setDescription,
    handleSubmit,
    isLoading,
    allServicios,
    recurrency,
    setRecurrency,
    sessionsPerRecurrency,
    setSessionsPerRecurrency,
    handleSelectDate,
    totalHours,
    setTotalHours,
    selectedDates,
    startingDateAndTime,
    setStartingDateAndTime,
    patientName,
    setPatientName,
    patientAge,
    setPatientAge,
    patientRut,
    setPatientRut,
    selectedPatient,
    handleChangeSelectedPatient,
    isCreatingNewPatient,
    setIsCreatingNewPatient,
  } = PublicarApoyoController();

  const {
    selectedComunas,
    handleSelectComuna,
    comunasSearched,
    matchedComunas,
    handleChangeSearchComuna,
    handleRemoveComuna,
  } = useComunas();

  const specialities = useMemo(() => {
    return allServicios?.find((s) => s.serviceName === user?.service)?.especialidades || [];
  }, [user?.service]);

  return (
    <Container
      sx={{
        minHeight: '80vh',
        m: '1rem auto',
      }}
    >
      <BackButtonContainer
        sx={{
          py: '1rem',
        }}
      >
        <BackButton displayText to="/mis-apoyos" />
      </BackButtonContainer>
      <SectionTitleContainer sx={{ width: '100%', m: '1rem auto', justifyContent: 'space-around' }}>
        <StyledTitle>Publicar apoyo</StyledTitle>
      </SectionTitleContainer>
      <ColumnCenteredFlexBox sx={columnStyle}>
        {isLoading ? (
          <Loading />
        ) : (
          <FlexBox
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <Text>
              Cuentanos más sobre el apoyo que necesitas para que recibas apoyo acorde a tus
              necesidades.
            </Text>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Título"
                placeholder={'Resumen de una línea de tu solicitud'}
                fullWidth
                margin="normal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                helperText="Ejemplo: 'Cuidados paleativos paciente con cancer' o 'Apoyo emocional para mi madre'"
                required
                error={title.length > 120}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>¿Para quíen?</InputLabel>
                <Select
                  value={user?.forWhom}
                  onChange={(e) =>
                    setUserState((prev) => {
                      return { ...prev, forWhom: e.target.value } as User;
                    })
                  }
                  label="¿Para quíen?"
                  required
                >
                  {forWhomOptions.map((f) => (
                    <MenuItem key={f.value} value={f.value}>
                      {f.text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {user?.forWhom === 'tercero' &&
                user?.pacientes &&
                user?.pacientes.length > 0 &&
                !isCreatingNewPatient && (
                  <FlexBox>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Selecciona el paciente</InputLabel>
                      <Select
                        value={selectedPatient?.rut || user.pacientes[0].rut}
                        onChange={handleChangeSelectedPatient}
                        label="Selecciona el paciente"
                        required
                      >
                        {user.pacientes.map(({ name, rut }) => (
                          <MenuItem key={rut} value={rut}>
                            {name} - {rut}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <AddButton onClick={() => setIsCreatingNewPatient(!isCreatingNewPatient)} />
                  </FlexBox>
                )}
              {isCreatingNewPatient && user?.forWhom === 'tercero' && (
                <>
                  {!user.pacientes || user.pacientes.length === 0 ? null : (
                    <RemoveButton
                      label="Cancelar"
                      labelPosition="right"
                      onClick={() => setIsCreatingNewPatient(!isCreatingNewPatient)}
                    />
                  )}
                  <TextField
                    label="Nombre del paciente"
                    placeholder={'Nombre del paciente'}
                    fullWidth
                    margin="normal"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                  />
                  <TextField
                    type="number"
                    label="Edad del paciente"
                    placeholder={patientAge?.toString()}
                    fullWidth
                    margin="normal"
                    value={patientAge}
                    onChange={(e) => setPatientAge(parseInt(e.target.value, 10))}
                    required
                  />
                  <TextField
                    type="text"
                    label="Rut del paciente"
                    placeholder={patientRut.toString()}
                    fullWidth
                    margin="normal"
                    value={patientRut}
                    onChange={(e) => setPatientRut(e.target.value)}
                    required
                  />
                </>
              )}
              <TextField
                label="Dirección"
                placeholder={user?.address || 'Dirección donde quieres recibir apoyo'}
                fullWidth
                margin="normal"
                value={user?.address}
                onChange={(e) =>
                  setUserState((prev) => {
                    return { ...prev, address: e.target.value } as User;
                  })
                }
                required
              />
              <FlexBox
                sx={{
                  flexDirection: 'column',
                }}
              >
                <ComunasSearchBar
                  handleSelectComuna={handleSelectComuna}
                  comunasSearched={comunasSearched}
                  matchedComunas={matchedComunas}
                  handleChangeSearchComuna={handleChangeSearchComuna}
                  placeholder="Comuna donde necesitas apoyo"
                />
                <FlexBox
                  sx={{
                    p: '0.5rem 1rem',
                    gap: '0.5rem',
                  }}
                >
                  {selectedComunas.length > 0 &&
                    selectedComunas.map((comuna) => (
                      <Chip
                        key={comuna.id}
                        sx={{
                          width: 'fit-content',
                        }}
                        label={comuna.name}
                        variant="outlined"
                        onClick={() => handleRemoveComuna(comuna)}
                        icon={<CloseOutlinedIcon />}
                      />
                    ))}
                </FlexBox>
              </FlexBox>
              <FormControl fullWidth margin="normal">
                <InputLabel>Servicio</InputLabel>
                <Select
                  value={user?.service}
                  onChange={(e) =>
                    setUserState((prev) => {
                      return { ...prev, service: e.target.value } as User;
                    })
                  }
                  label="Servicio"
                  required
                >
                  {allServicios.map((s) => (
                    <MenuItem key={s.id} value={s.serviceName}>
                      {s.serviceName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {user?.service && specialities?.length > 0 && (
                <FormControl
                  fullWidth
                  sx={{
                    my: '1rem',
                  }}
                >
                  <InputLabel>Especialidad</InputLabel>
                  <Select
                    value={user?.speciality}
                    onChange={(e) =>
                      setUserState((prev) => {
                        return { ...prev, speciality: e.target.value } as User;
                      })
                    }
                    label="Especialidad"
                  >
                    {specialities.map((s) => (
                      <MenuItem key={s.id} value={s.especialidadName}>
                        {s.especialidadName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <FormControl fullWidth sx={{}}>
                <InputLabel id="select-recurrency">
                  {/* ¿Qué tan seguido necesitas este apoyo? */}
                  Recurrencia
                </InputLabel>

                <Select
                  labelId="select-recurrency"
                  id="select-recurrency-id"
                  value={recurrency}
                  label="Recurrencia"
                  onChange={(e) => {
                    setRecurrency(e.target.value as Recurrency);
                  }}
                  required
                >
                  <MenuItem value={'one-off'}>Sólo una vez</MenuItem>
                  <MenuItem value={'weekly'}>Semanalmente</MenuItem>
                  <MenuItem value={'monthly'}>Mensualmente</MenuItem>
                </Select>
              </FormControl>
              {recurrency !== 'one-off' && (
                <FormControl
                  fullWidth
                  sx={{
                    mt: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                >
                  <InputLabel id="sessions-recurrent">
                    {`¿Cuántas sesiones necesitas ${
                      recurrency === 'weekly' ? 'semanalmente' : 'mensualmente'
                    }?`}
                  </InputLabel>
                  <Input
                    type="number"
                    value={sessionsPerRecurrency}
                    onChange={(e) => {
                      if (e.target.value === '0' || e.target.value === '') {
                        setSessionsPerRecurrency('');
                      } else {
                        setSessionsPerRecurrency(e.target.value);
                      }
                    }}
                    sx={{
                      px: '1rem',
                    }}
                  />
                </FormControl>
              )}
              <FormControl
                fullWidth
                sx={{
                  mt: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              >
                <InputLabel id="totalHoursInput">
                  {`¿Cuántas horas approximadas ${
                    recurrency === 'one-off'
                      ? ''
                      : recurrency === 'weekly'
                      ? 'semanalmente'
                      : 'mensualmente'
                  }`}
                </InputLabel>
                <Input
                  type="number"
                  value={totalHours}
                  onChange={(e) => setTotalHours(e.target.value)}
                  sx={{
                    px: '1rem',
                  }}
                />
              </FormControl>
              {recurrency === 'one-off' ? (
                <FormControl
                  fullWidth
                  sx={{
                    mt: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                >
                  <DateTimePicker
                    format="DD/MM/YYYY HH:mm"
                    localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                    minutesStep={30}
                    showDaysOutsideCurrentMonth
                    skipDisabled
                    value={startingDateAndTime}
                    disablePast
                    label="Selecciona la fecha y hora"
                    onChange={(e) => {
                      if (e) {
                        setStartingDateAndTime(e);
                      }
                    }}
                  />
                </FormControl>
              ) : (
                <SelectCalendarDate
                  title="Selecciona los días"
                  handleSelectDate={handleSelectDate}
                  selectedDates={selectedDates}
                  withMargin
                />
                // <DateCalendar
                //   disablePast={true}
                //   onChange={handleSelectDate}
                //   slotProps={{
                //     day: {
                //       // @ts-ignore
                //       selectedDays: selectedDates,
                //     },
                //   }}
                //   showDaysOutsideCurrentMonth
                // />
              )}
              <TextField
                label="Descripción del apoyo"
                placeholder="Describe las actividades claves y requerimientos en detalle. Esto podría ser lo que deseas que se enfoque el apoyo, por ejemplo, si necesitas apoyo emocional, apoyo para realizar actividades de la vida diaria, etc. También, puedes proveer mas información sobre el paciente y sus necesidades."
                multiline
                rows={4}
                fullWidth
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <CenteredFlexBox>
                <Button
                  disabled={isLoading}
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Publicar
                </Button>
              </CenteredFlexBox>
            </form>
          </FlexBox>
        )}
      </ColumnCenteredFlexBox>
    </Container>
  );
};

const columnStyle = {
  padding: '1rem 1.4rem',
  backgroundColor: 'white',
  borderRadius: '1rem',

  maxWidth: {
    xs: '100%',
    sm: '80%',
    md: '70%',
    lg: '60%',
    xl: '50%',
  },
  margin: 'auto',
};
