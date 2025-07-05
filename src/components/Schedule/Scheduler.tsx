import 'dayjs/locale/es-mx';
import './styles.css';
import {
  StyledScheduleContainer,
  StyledScheduleForm,
  StyledTitleContainer,
} from './StyledScheduleModal';
import Loading from '../Loading';
import { Box, Button } from '@mui/material';
import { Text, Title } from '../StyledComponents';
import { ServiceQuestion } from './ServiceQuestion';
import { IsMultipleQuestion } from './IsMultipleQuestion';
import { ScheduleController } from './ScheduleController';
import { ColumnCenteredFlexBox, FlexBox } from '../styled';
import { NumberOfSessionsQuestion } from './NumberOfRecurringSessions';
import { HowManySessionsToConfirmQuestion } from './HowManySessionsToConfirmQuestion';
import { SelectCalendarDate } from './SelectCalendarDate';
import { SelectSessionTime } from './SelectSessionTime';

export const Scheduler = () => {
  const {
    schedule,
    handleSubmit,
    waitingForPayku,
    shouldDisableDay,
    handleSelectDate,
    // shouldDisableTime,
    providersAppointments,
    providerAvailability,
    renderAvailableDay,
    handleSelectServicio,
    handleCheckIsMultiple,
    scheduleServiceLoading,
    numberOfSessionsOptions,
    handleSelectSessionHour,
    handleCloseScheduleModal,
    handleSelectHowManySessionsToConfirm,
    handleSelectHowManySessionsToSchedule,
  } = ScheduleController();

  const { selectedTimes, selectedService, selectedDates, isMultiple, howManySessionsToSchedule } =
    schedule;
  const selectedServiceDuration = selectedService?.duration;
  const availableTimesStep =
    selectedServiceDuration && selectedServiceDuration > 45 ? 60 : selectedServiceDuration;

  if (scheduleServiceLoading || waitingForPayku) return <Loading />;

  return (
    <StyledScheduleContainer>
      <StyledTitleContainer>
        <Title>Agendar</Title>
      </StyledTitleContainer>
      <StyledScheduleForm
        sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center', gap: '1rem' }}
      >
        <ServiceQuestion handleSelectServicio={handleSelectServicio} />

        {selectedService && (
          <ColumnCenteredFlexBox sx={{ gap: '1rem' }}>
            <IsMultipleQuestion
              isMultiple={isMultiple}
              handleCheckRecurring={handleCheckIsMultiple}
            />

            {isMultiple && (
              <NumberOfSessionsQuestion
                numberOfRecurringSessionsOptions={numberOfSessionsOptions}
                handleSelectHowManySessionsToSchedule={handleSelectHowManySessionsToSchedule}
              />
            )}
            {isMultiple && howManySessionsToSchedule !== 1 && (
              <HowManySessionsToConfirmQuestion
                howManySessionsToSchedule={howManySessionsToSchedule}
                handleSelectHowManySessionsToConfirm={handleSelectHowManySessionsToConfirm}
              />
            )}
          </ColumnCenteredFlexBox>
        )}

        {selectedService && (isMultiple ? howManySessionsToSchedule > 1 : true) && (
          <FlexBox
            sx={{
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center',
              aklignItems: 'center',
              gap: { xs: '0.25rem', md: '1rem' },
              maxWidth: { md: '50vw' },
            }}
          >
            <SelectCalendarDate
              shouldDisableDay={shouldDisableDay}
              renderAvailableDay={renderAvailableDay}
              handleSelectDate={handleSelectDate}
              selectedDates={selectedDates}
            />
            <FlexBox
              sx={{
                alignItems: 'center',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              {Object?.keys(selectedTimes || {})?.length === selectedDates?.length &&
              selectedDates?.length < howManySessionsToSchedule ? (
                <>
                  <Text>
                    {selectedDates?.length || 0} / {howManySessionsToSchedule}
                  </Text>
                  <FlexBox
                    sx={{
                      margin: '0 auto',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      sx={{
                        textAlign: 'left',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        maxWidth: {
                          xs: '80%',
                          md: '100%',
                        },
                      }}
                    >
                      Selecciona la siguiente fecha que quieres agendar
                    </Text>
                  </FlexBox>
                </>
              ) : (
                selectedService?.duration &&
                selectedDates?.length &&
                Object?.keys(selectedTimes || {})?.length !== selectedDates?.length && (
                  <SelectSessionTime
                    selectedTimes={selectedTimes}
                    availableTimesStep={availableTimesStep}
                    selectedDates={selectedDates}
                    handleSelectSessionHour={handleSelectSessionHour}
                    // shouldDisableTime={shouldDisableTime}
                    providerAppointments={providersAppointments}
                    serviceDuration={selectedService?.duration}
                    providerAvailability={providerAvailability}
                  />
                )
              )}
            </FlexBox>
          </FlexBox>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button variant="contained" onClick={handleCloseScheduleModal}>
            Cancelar
          </Button>
          <Button
            id="agendar-button"
            variant="contained"
            disabled={
              !selectedService?.id ||
              !selectedDates ||
              !selectedTimes ||
              scheduleServiceLoading ||
              waitingForPayku ||
              howManySessionsToSchedule > selectedDates.length ||
              howManySessionsToSchedule > Object.keys(selectedTimes).length
            }
            onClick={handleSubmit}
          >
            Agendar
          </Button>
        </Box>
      </StyledScheduleForm>
    </StyledScheduleContainer>
  );
};
