import { Box, Button, Switch } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers';
import { AvailabilityData, StyledDayName } from './ListAvailableDays';
import { CenteredDivider } from '@/components/StyledDivider';
import {
  Container,
  StyledDayContainer,
  StyledEditableDay,
  StyledTimePickerContainer,
  StyledTimerContainer,
  StyledToggleContainer,
} from './EditAvailableDaysStyledComp';
import { useDisponibilidadNew } from '@/hooks/useDisponibilidadNew';
import Loading from '@/components/Loading';
import dayjs from 'dayjs';

type EditAvailableDaysProps = {
  availability: AvailabilityData[];
};

export const EditAvailableDays = ({ availability }: EditAvailableDaysProps) => {
  const {
    saveDisponibilidadLoading,
    handleToggleDisponibilidadDay,
    handleTimeChange,
    handleSaveDisponibilidad,
    handleEditDisponibilidad,
  } = useDisponibilidadNew();

  return saveDisponibilidadLoading ? (
    <Loading />
  ) : (
    <Container>
      {availability &&
        availability?.map((d) => {
          const { id, day, times, isAvailable } = d;
          return (
            <StyledDayContainer key={id + day}>
              <CenteredDivider />
              <StyledEditableDay
                sx={{
                  width: {
                    xs: '100%',
                    sm: '100%',
                    md: '50%',
                  },
                }}
              >
                <StyledToggleContainer>
                  <StyledDayName>{day}</StyledDayName>
                  <Switch
                    checked={isAvailable}
                    onClick={() => handleToggleDisponibilidadDay(day)}
                  />
                </StyledToggleContainer>
                {isAvailable && (
                  <StyledTimePickerContainer>
                    <StyledTimerContainer>
                      <TimeField
                        label="Inicio"
                        value={dayjs(times.startTime, 'HH:mm')}
                        onChange={(e) => handleTimeChange(e!, id, 'startTime')}
                        format="HH:mm"
                        minutesStep={30}
                        ampm={false}
                        helperText="Format de hora 24 horas, ej: 14:30 - Se sugiere usar intervalos de 30 minutos"
                        FormHelperTextProps={{
                          sx: {
                            fontSize: '0.5rem',
                            maxWidth: '200px',
                          },
                        }}
                      />
                      {/* <TimePicker
                        label="Inicio"
                        value={dayjs(times.startTime, 'HH:mm')}
                        onChange={(e) => handleTimeChange(e!, id, 'startTime')}
                        minutesStep={30}
                        ampm={false}
                      /> */}
                    </StyledTimerContainer>
                    <StyledTimerContainer>
                      <TimeField
                        label="Término"
                        value={dayjs(times.endTime, 'HH:mm')}
                        onChange={(e) => handleTimeChange(e!, id, 'endTime')}
                        format="HH:mm"
                        minutesStep={30}
                        ampm={false}
                        helperText="Format de hora 24 horas, ej: 14:30 - Se sugiere usar intervalos de 30 minutos"
                        FormHelperTextProps={{
                          sx: {
                            fontSize: '0.5rem',
                            maxWidth: '200px',
                          },
                        }}
                      />
                      {/* <TimePicker
                        sx={{
                          display: 'flex',
                        }}
                        label="Término"
                        value={dayjs(times.endTime, 'HH:mm')}
                        onChange={(e) => handleTimeChange(e!, id, 'endTime')}
                        minutesStep={30}
                        minTime={dayjs(times.startTime, 'HH:mm')}
                        ampm={false}
                        views={['hours', 'minutes']}
                      /> */}
                    </StyledTimerContainer>
                  </StyledTimePickerContainer>
                )}
              </StyledEditableDay>
            </StyledDayContainer>
          );
        })}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '80vw',
          gap: '2rem',
          mt: '1rem',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            my: '1rem',
          }}
          onClick={() => handleEditDisponibilidad()}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            my: '1rem',
          }}
          onClick={() => handleSaveDisponibilidad()}
        >
          Guardar
        </Button>
      </Box>
    </Container>
  );
};
