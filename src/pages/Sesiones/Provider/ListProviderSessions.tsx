import dayjs from 'dayjs';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import { Fragment, useMemo, useState } from 'react';
import { Text } from '@/components/StyledComponents';
import { Appointment } from '@/api/appointments';
import { ProviderSessionCard } from './ProviderSessionCard';

type ListProviderSessionsProps = {
  providerSessions: Appointment[];
};

export const ListProviderSessions = ({ providerSessions }: ListProviderSessionsProps) => {
  const [showPastSessions, setShowPastSessions] = useState(false);
  const { providerPastSessions, providerFutureSessions } = useMemo(() => {
    const providerPastSessions: Appointment[] = [];
    const providerFutureSessions: Appointment[] = [];

    providerSessions.forEach((session) => {
      const dateTime = session.scheduledDate + ' ' + session.scheduledTime;
      const sesionDate = typeof dateTime === 'string' ? dateTime : undefined;
      const isPast = dayjs().isAfter(dayjs(sesionDate));
      if (isPast) {
        providerPastSessions.push(session);
      } else {
        providerFutureSessions.push(session);
      }
    });

    return { providerPastSessions, providerFutureSessions };
  }, [providerSessions]);

  if (!providerSessions.length) {
    return (
      <>
        <Text>Aun no tienes sesiones.</Text>
      </>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Button
          sx={{ my: 2 }}
          variant={showPastSessions ? 'contained' : 'outlined'}
          onClick={() => setShowPastSessions((prev) => !prev)}
        >
          {showPastSessions ? 'Pasadas' : 'Futuras'}
        </Button>
      </Box>
      {/* PAST SESSIONS MAP/ITERATION */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr',
            lg: '1fr 1fr 1fr',
          },
          gridTemplateRows: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr',
          },
        }}
      >
        {showPastSessions &&
          providerPastSessions.length > 0 &&
          providerPastSessions.map((appointment, y) => (
            <Fragment key={y}>
              <ProviderSessionCard appointment={appointment} />
            </Fragment>
          ))}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr',
            lg: '1fr 1fr 1fr',
          },
          gridTemplateRows: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr',
          },
        }}
      >
        {providerFutureSessions?.map((appointment, i) => (
          <Fragment key={i}>
            {i === 0 ? (
              <Text
                sx={{
                  px: '1rem',
                }}
              >
                Tu siguiente sesión:
              </Text>
            ) : null}
            <ProviderSessionCard appointment={appointment} />
          </Fragment>
        ))}
      </Box>
    </>
  );
};
